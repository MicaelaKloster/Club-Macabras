import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const obtenerUsuarios = async () => {
        const token = localStorage.getItem("token");

        try{
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/usuarios`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsuarios(data || []);
        }catch (error) {
            console.error("❌ Error al obtener usuarios: ", error);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    if (loading) return <p className="text-center">Cargando usuarios...</p>

    return (
        <div className="space-y-6">
        <h2 className="text-2xl font-bold text-pink-800">Gestión de Usuarios</h2>

        <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead>
            <tr className="bg-pink-100 text-left">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Provincia</th>
                <th className="px-4 py-2 border">Ciudad</th>
                <th className="px-4 py-2 border">Rol</th>
                <th className="px-4 py-2 border">Estado</th>
            </tr>
            </thead>
            <tbody>
            {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{u.id}</td>
                <td className="px-4 py-2 border">{u.nombre}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.provincia || "-"}</td>
                <td className="px-4 py-2 border">{u.ciudad || "-"}</td>
                <td className="px-4 py-2 border">{u.rol}</td>
                <td className="px-4 py-2 border">
                    {u.estado === 1 ? "✅ Activo" : "❌ Inactivo"}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default AdminUsuarios;