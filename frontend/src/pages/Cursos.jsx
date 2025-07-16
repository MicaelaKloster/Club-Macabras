import { useEffect, useState } from "react";
import axios from "axios";

const Cursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerCursos = async () => {
            try{
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cursos`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                setCursos(data.cursos);
            
            }catch (error) {
                console.error("❌ Error al obtener los cursos: ", error);
            } finally{
                setLoading(false);
            }
        };
        obtenerCursos();
    }, []);

    if (loading) return <p className="text-center">Cargando cursos...</p>;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cursos.map((curso) => (
            <div key={curso.id} className="bg-white shadow rounded p-4 border border-pink-200">
            <h3 className="text-xl font-bold text-pink-800">{curso.titulo}</h3>
            <p className="text-sm text-gray-600 mb-2">{curso.categoria}</p>
            <p className="text-gray-700">{curso.descripcion}</p>
            </div>
        ))}
        </div>
    );
};

export default Cursos;