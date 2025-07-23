import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EditarPerfil = () => {
    const [nombre, setNombre] = useState("");
    const [provincia, setProvincia] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [contraseñaActual, setContraseñaActual] = useState("");
    const [contraseñaNueva, setContraseñaNueva] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const obtenerPerfil = async () => {
            try{
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/perfil`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setNombre(data.nombre || "");
                setProvincia(data.provincia || "");
                setCiudad(data.ciudad || "");

            }catch (error){
                console.error("❌ Error al obtener perfil: ", error);
            }
        };

        obtenerPerfil();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        const token = localStorage.getItem("token");

        try{
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/perfil`,
                {
                    nombre,
                    provincia,
                    ciudad,
                    contraseña_actual: contraseñaActual || undefined,
                    contraseña_nueva: contraseñaNueva || undefined,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMensaje(data.mensaje || "Perfil actualizado correctamente.");
            setTimeout(() => navigate("/perfil"), 1500);

        }catch (error){
            console.error("❌ Error al actualizar perfil: ", error);
            setMensaje(error.response?.data?.error || "Error al actualizar perfil. Inténtalo de nuevo.");
        }
    };

    const handleDesactivarCuenta = async () => {
        const confirmacion = window.confirm(
            "¿Estás seguro de que quieres desactivar tu cuenta? Esta acción no se puede deshacer."
        );

        if(!confirmacion) return;

        try{
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_URL}/perfil`, {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Cuenta desactivada correctamente.");
            logout(); // Cierra sesión

        }catch (error){
            console.error("❌ Error al desactivar cuenta: ", error);
            setMensaje("Ocurrió un error al intenar desactivar la cuenta");
        }
    }

    return (
    <div className="max-w-xl mx-auto mt-10 border rounded p-6 shadow bg-white">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-4">
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-4 text-pink-800">Editar Perfil</h2>

      {mensaje && <p className="mb-4 text-sm text-green-600">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Provincia</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Ciudad</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
        </div>

        <hr className="my-4" />

        <h3 className="text-lg font-semibold">Cambiar contraseña (opcional)</h3>

        <div>
          <label className="block font-medium">Contraseña actual</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={contraseñaActual}
            onChange={(e) => setContraseñaActual(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Nueva contraseña</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={contraseñaNueva}
            onChange={(e) => setContraseñaNueva(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-pink-700 text-white px-6 py-2 rounded hover:bg-pink-800"
          onClick={() => navigate("/perfil", { state: { actualizado: true } })}
        >
          Guardar cambios
        </button>

        <button
            onClick={handleDesactivarCuenta}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
            Desactivar cuenta
        </button>

      </form>
    </div>
  );
};

export default EditarPerfil;