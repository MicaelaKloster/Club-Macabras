import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardAdmin = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pink-800">Panel del Administrador</h1>
      <p className="text-gray-600">¡Hola {usuario?.nombre}! Elegí qué querés gestionar:</p>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => navigate("/admin/usuarios")}
          className="bg-pink-700 text-white px-6 py-3 rounded hover:bg-pink-800 text-left"
        >
          <div className="text-2xl mb-2">👤</div>
          <div className="font-semibold">Gestión de Usuarios</div>
          <div className="text-pink-100 text-sm">Administrar cuentas de usuarios</div>
        </button>

        <button
          onClick={() => navigate("/admin/cursos")}
          className="bg-pink-700 text-white px-6 py-3 rounded hover:bg-pink-800 text-left"
        >
          <div className="text-2xl mb-2">📚</div>
          <div className="font-semibold">Gestión de Cursos</div>
          <div className="text-pink-100 text-sm">Crear, editar y eliminar cursos</div>
        </button>

        <button
          onClick={() => navigate("/admin/preguntas")}
          className="bg-pink-700 text-white px-6 py-3 rounded hover:bg-pink-800 text-left"
        >
          <div className="text-2xl mb-2">❓</div>
          <div className="font-semibold">Preguntas Pendientes</div>
          <div className="text-pink-100 text-sm">Responder consultas de estudiantes</div>
        </button>

        <button
          onClick={() => navigate("/admin/info-extra")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-left"
        >
          <div className="text-2xl mb-2">📄</div>
          <div className="font-semibold">Info Extra & Configuraciones</div>
          <div className="text-blue-100 text-sm">Gestionar información adicional y precios</div>
        </button>
      </div>

      {/* Sección de estadísticas rápidas */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Acceso rápido</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Ver cursos como usuario
          </button>
          <button
            onClick={() => navigate("/foro")}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Ver foro de la comunidad
          </button>
        </div>
      </div>
    </div>
  );

};

export default DashboardAdmin;