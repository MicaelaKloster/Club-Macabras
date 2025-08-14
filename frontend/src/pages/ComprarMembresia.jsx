import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ComprarMembresia = () => {
  const { usuario } = useAuth();

  const handleComprar = async () => {
    try {
      const precio = 2000; // 💰 Precio fijo de la membresía (puede venir del backend)
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/mercadopago/preferencia`,
        {
          usuario_id: usuario.id,
          precio
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.id) {
        // Redirigir al checkout de Mercado Pago
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${res.data.id}`;
      } else {
        alert("No se pudo generar la preferencia de pago");
      }
    } catch (error) {
      console.error("❌ Error al crear preferencia:", error);
      alert("Error al iniciar la compra. Intentalo nuevamente.");
    }
  };

  return (
    <div className="text-center mt-6">
      <button
        onClick={handleComprar}
        className="bg-pink-700 hover:bg-pink-800 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        💳 Comprar Membresía
      </button>
    </div>
  );
};

export default ComprarMembresia;