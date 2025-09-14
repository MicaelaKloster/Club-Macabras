import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import dotenv from "dotenv";
import { crearMembresia, obtenerMembresiaActivaPorUsuario } from "../services/membresias.service.js";

dotenv.config();

// Inicializar cliente de Mercado Pago
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// Crear preferencia de pago
export const crearPreferencia = async (req, res) => {
  try {
    const { usuario_id, precio } = req.body;

    const preference = new Preference(mpClient);

    const result = await preference.create({
      body: {
        items: [
          {
            title: "Membresía Club Macabras",
            quantity: 1,
            unit_price: parseFloat(precio),
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago-exitoso`,
          failure: `${process.env.FRONTEND_URL}/pago-fallido`,
          pending: `${process.env.FRONTEND_URL}/pago-pendiente`,
        },
        auto_return: "approved",
        notification_url: `${process.env.BACKEND_URL}/mercadopago/webhook`, // 🔹 Ngrok URL aquí
        metadata: {
          usuario_id
        }
      }
    });

    res.status(200).json({ id: result.id });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
};

// Webhook para recibir notificaciones de Mercado Pago
export const recibirWebhook = async (req, res) => {
  try {
    const paymentId = req.query["data.id"];
    const type = req.query["type"];

    console.log("📩 Webhook recibido:", { type, paymentId });

    if (type === "payment" && paymentId) {
      const paymentClient = new Payment(mpClient);
      const payment = await paymentClient.get({ id: paymentId });

      console.log("💳 Detalles del pago:", payment);

      if (payment.status === "approved") {
        const usuarioId = payment.metadata?.usuario_id;

        if (usuarioId) {
          // 📌 Verificar si ya tiene una membresía activa para evitar duplicados
          const membresiaExistente = await obtenerMembresiaActivaPorUsuario(usuarioId);

          if (!membresiaExistente) {
            const fechaInicio = new Date();
            const fechaVencimiento = new Date();
            fechaVencimiento.setDate(fechaInicio.getDate() + 30);

            await crearMembresia(
              usuarioId,
              fechaInicio.toISOString().split("T")[0],
              fechaVencimiento.toISOString().split("T")[0],
              "Mercado Pago",
              1
            );

            console.log(`✅ Membresía creada automáticamente para usuario ${usuarioId}`);
          } else {
            console.log(`ℹ️ Usuario ${usuarioId} ya tiene una membresía activa, no se crea otra.`);
          }
        } else {
          console.warn("⚠️ Pago aprobado pero sin usuario_id en metadata");
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.sendStatus(500);
  }
};