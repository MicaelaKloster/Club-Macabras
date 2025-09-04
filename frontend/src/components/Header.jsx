import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
    const {usuario} = useAuth();
    const [preguntasPendientes, setPreguntasPendientes] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const obtenerPreguntasPendientes = async () => {
            if(usuario?.rol !== "admin") return;

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/preguntas`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const sinResponder = res.data.filter((p) => !p.respuesta);
                setPreguntasPendientes(sinResponder.length);
            } catch (error) {
                console.error("Error al obtener preguntas pendientes:", error);
            }
        };

        obtenerPreguntasPendientes();

        const interval = setInterval(obtenerPreguntasPendientes, 60000); // cada 60 segundos

        return () => clearInterval(interval);

    }, [usuario]);

    return (
        <header className="bg-pink-100 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo o Nombre*/}
                <Link to="/" className="text-2xl font-bold text-pink-700">
                    Club Macabras
                </Link>

                {/* Navegación */}
                <nav className="flex gap-6">
                    
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Cursos
                    </NavLink>
                    <NavLink
                        to="/foro"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Foro de la Comunidad
                    </NavLink>
                    
                    {/* Info Extra - Solo mostrar si hay contenido */}
                    <NavLink
                        to="/info-extra"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Info Extra
                    </NavLink>
                    
                    {/* Mostrar membresía solo si NO es admin */}
                    {usuario?.rol !== "admin" && (
                        <NavLink
                            to="/membresia"
                            className={({ isActive }) =>
                                isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                            }
                        >
                            Membresía
                        </NavLink>
                    )}
                    
                    <NavLink
                        to="/perfil"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Mi Perfil
                    </NavLink>

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Cerrar Sesión
                    </NavLink>

                    {usuario?.rol === "admin" && (
                        <>
                            <NavLink
                                to="/admin"
                                className={({ isActive}) =>
                                    isActive ? "text-pink-700 font-semibold" : "text-gray-700" 
                                }
                            >
                                Panel Admin
                            </NavLink>

                            <div className="relative cursor-pointer ml-4">
                                <div className="relative">
                                <span className="text-2xl">🔔</span>
                                    {preguntasPendientes > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                                            {preguntasPendientes}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </nav>
            </div>
        </header>
    );
};

export default Header;