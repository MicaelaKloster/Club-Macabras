import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const InfoExtra = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [infoExtra, setInfoExtra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarInfoExtra = async () => {
            const token = localStorage.getItem('token');
            
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/info-extra`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                setInfoExtra(res.data);

            } catch (error) {
                console.error('Error al cargar info extra:', error);
                if (error.response?.status === 404) {
                    setError('No hay información extra disponible en este momento.');
                } else {
                    setError('Error al cargar la información. Inténtalo más tarde.');
                }
            } finally {
                setLoading(false);
            }
        };

        cargarInfoExtra();
    }, []);

    if (loading) {
        return <p className="text-center">Cargando información...</p>;
    }

    if (error) {
        return (
            <div className="text-center space-y-4">
                <p className="text-gray-600">{error}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
                >
                    Volver a cursos
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-pink-800">Info Extra</h1>
                
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                        Volver a cursos
                    </button>
                    
                    {/* Solo mostrar opción de gestión a admin */}
                    {usuario?.rol === 'admin' && (
                        <button
                            onClick={() => navigate('/info-extra/admin')}
                            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
                        >
                            Gestionar Info Extra
                        </button>
                    )}
                </div>
            </div>

            {infoExtra && (
                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    {/* Título */}
                    <div className="border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {infoExtra.titulo}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Actualizado el: {new Date(infoExtra.actualizado_en).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Descripción */}
                    {infoExtra.descripcion && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Descripción
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {infoExtra.descripcion}
                            </p>
                        </div>
                    )}

                    {/* Enlace al documento */}
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-pink-700 mb-3">
                            Acceder al contenido
                        </h3>
                        <a
                            href={infoExtra.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                        >
                            <span className="mr-2">📄</span>
                            Abrir documento
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                            El enlace se abrirá en una nueva ventana
                        </p>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">
                            Información importante
                        </h3>
                        <ul className="text-blue-600 text-sm space-y-1">
                            <li>• Este contenido es exclusivo para miembros</li>
                            <li>• Si tienes problemas para acceder, contacta al soporte</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoExtra;