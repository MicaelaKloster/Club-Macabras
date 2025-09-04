import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InfoExtraAdmin = () => {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [infoExistente, setInfoExistente] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);

    // Estados para configuraciones
    const [precioMembresia, setPrecioMembresia] = useState('');
    const [mensajeConfig, setMensajeConfig] = useState('');

    useEffect(() => {
        cargarInfoExistente();
        cargarConfiguraciones();
    }, []);

    const cargarInfoExistente = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/info-extra`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setInfoExistente(res.data);
            setTitulo(res.data.titulo);
            setDescripcion(res.data.descripcion || '');
            setUrl(res.data.url);
            setModoEdicion(true);

        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error al cargar info extra:', error);
            }
            // Si no existe info, quedamos en modo creación
            setModoEdicion(false);
        }
    };

    const cargarConfiguraciones = async () => {
        const token = localStorage.getItem('token');
        
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/info-extra/configuraciones`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setPrecioMembresia(res.data.precio_membresia.toString());

        } catch (error) {
            console.error('Error al cargar configuraciones:', error);
        }
    };

    const handleSubmitInfo = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        const token = localStorage.getItem('token');
        const datos = { titulo, descripcion, url };

        try {
            if (modoEdicion && infoExistente) {
                // Actualizar existente
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/info-extra/${infoExistente.id}`,
                    datos,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setMensaje('Información actualizada exitosamente');
            } else {
                // Crear nueva
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/info-extra`,
                    datos,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setMensaje('Información creada exitosamente');
                setModoEdicion(true);
            }

            setTimeout(() => setMensaje(''), 3000);

        } catch (err) {
            console.error('Error al guardar info extra:', err);
            setError(err.response?.data?.error || 'Error al guardar la información');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmitConfig = async (e) => {
        e.preventDefault();
        setMensajeConfig('');

        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/info-extra/configuraciones`,
                { precio_membresia: parseInt(precioMembresia) },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMensajeConfig('Precio actualizado exitosamente');
            setTimeout(() => setMensajeConfig(''), 3000);

        } catch (err) {
            console.error('Error al actualizar precio:', err);
            setMensajeConfig('Error al actualizar el precio');
            setTimeout(() => setMensajeConfig(''), 3000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
            >
                Volver
            </button>

            {/* Sección Info Extra */}
            <div className="p-6 bg-white shadow rounded">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">
                    {modoEdicion ? 'Editar Info Extra' : 'Crear Info Extra'}
                </h2>

                <form onSubmit={handleSubmitInfo} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Descripción (opcional)</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={4}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Descripción del contenido..."
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">URL del documento (Google Drive, etc.)</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="https://..."
                            required
                        />
                    </div>

                    {error && <p className="text-red-600">{error}</p>}
                    {mensaje && <p className="text-green-600">{mensaje}</p>}

                    <button
                        type="submit"
                        className="bg-pink-700 text-white px-6 py-2 rounded hover:bg-pink-800"
                    >
                        {modoEdicion ? 'Actualizar' : 'Crear'} Info Extra
                    </button>
                </form>
            </div>

            {/* Sección Configuraciones */}
            <div className="p-6 bg-white shadow rounded">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">
                    Configuración de Precios
                </h2>

                <form onSubmit={handleSubmitConfig} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Precio de Membresía (ARS)</label>
                        <input
                            type="number"
                            value={precioMembresia}
                            onChange={(e) => setPrecioMembresia(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            min="1"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Este precio se aplicará a todas las nuevas compras de membresía.
                        </p>
                    </div>

                    {mensajeConfig && (
                        <p className={`${mensajeConfig.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                            {mensajeConfig}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Actualizar Precio
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InfoExtraAdmin;