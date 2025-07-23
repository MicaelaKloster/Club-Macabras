import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const Perfil = () => {
    // const {usuario} = useAuth();
    const [perfil, setPerfil] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

     const obtenerPerfil = async () => {
        const token = localStorage.getItem("token");

        try {
            const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/perfil`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setPerfil(data);
        } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        obtenerPerfil();
    }, []);

    useEffect(() => {
        if (location.state?.actualizado) {
        obtenerPerfil(); 
        }
    }, [location.state]);

    if(loading) return <p className="text-center"> Cargando perfil...</p>;

    return (
        
        <div className="max-w-md mx-auto bg-white shadow p-6 rounded mt-6 space-y-4">
            <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline mb-2"
            >
            ← Volver atrás
            </button>
            <h2 className="text-2xl font-bold text-pink-800 mb-4">Mi perfil</h2>

            <p><strong>Nombre:</strong> {perfil.nombre}</p>
            <p><strong>Email:</strong> {perfil.email}</p>
            <p><strong>Provincia:</strong> {perfil.provincia || "No especificada"}</p>
            <p><strong>Ciudad:</strong> {perfil.ciudad || "No especificada"}</p>

            <button
                onClick={() => navigate("/perfil/editar")}
                className="mt-6 bg-pink-700 text-white px-6 py-2 rounded hover:bg-pink-800"
            >
                Editar Perfil
            </button>
        </div>
    );
};

export default Perfil;