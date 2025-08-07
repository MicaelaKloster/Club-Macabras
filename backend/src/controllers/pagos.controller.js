import { metadata } from 'reflect-metadata/no-conflict';
import mercadopago from '../config/mercadoPago.config';

export const crearPreferenciaPago = async (req, res) => {
    const usuario = req.usuario; // Viene del token
    const precioMembresia = 1000; // Precio fijo de la membresía, editable más adelante

    const preferencia = {
        items: [
            {
                title: "Membresía Club Macabras",
                unit_price: precioMembresia,
                quantity: 1,
            },
        ],
        back_urls: {
            success: `${process.env.FRONT_URL}/pago-exitoso`,
            failure: `${process.env.FRONT_URL}/pago-fallido`,
            pending: `${process.env.FRONT_URL}/pago-pendiente`,
        },
        auto_return: "approved",
        notification_url: `${process.env.BACK_URL}/pagos/webhook`,
        metadata : {
            usuario_id: usuario.id,
        },
    };

    try{
        const response = await mercadopago.preferences.create(preferencia);
        return res.status(200).json({ init_point: response.body.init_point });

    }catch (error) {
        console.error("❌ Error al crear preferencia de pago:", error);
        return res.status(500).json({ error: "Error al generar link de pago" });
    }

};