import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NuevoVideo = () => {
    const { cursoId } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [url, setUrl] = useState('');
    const [esGratuito, setEsGratuito] = useState(false);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/videos`,
                {
                    curso_id: parseInt(cursoId),
                    titulo,
                    url,
                    es_gratuito: esGratuito ? 1 : 0,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMensaje(data.mensaje);
            setTitulo('');
            setUrl('');
            setEsGratuito(false);

            setTimeout(() => {
                navigate(`/admin/materiales/${cursoId}`);
            }, 2000);

        } catch (err) {
            console.error('❌ Error al subir video: ', err);
            setError('Error al subir el video. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded space-y-6">
        <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
        >
            ← Volver
        </button>

        <h2 className="text-2xl font-bold text-pink-800">➕ Subir nuevo video</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block font-medium">Título</label>
            <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
            />
            </div>

            <div>
            <label className="block font-medium">URL del video (YouTube)</label>
            <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
            />
            </div>

            <div className="flex items-center">
            <input
                id="gratuito"
                type="checkbox"
                checked={esGratuito}
                onChange={(e) => setEsGratuito(e.target.checked)}
                className="mr-2"
            />
            <label htmlFor="gratuito" className="font-medium">
                ¿Es gratuito?
            </label>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {mensaje && <p className="text-green-600">{mensaje}</p>}

            <button
                type="submit"
                className="bg-pink-700 text-white px-6 py-2 rounded hover:bg-pink-800"
            >
                Guardar video
            </button>
        </form>
        </div>
    );
};

export default NuevoVideo;