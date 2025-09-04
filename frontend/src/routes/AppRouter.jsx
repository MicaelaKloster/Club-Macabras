import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LayoutPublico from '../layouts/LayoutPublico';
import LayoutPrivado from '../layouts/LayoutPrivado';

import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Cursos from '../pages/Cursos';
import CursoDetalle from '../pages/CursoDetalle';
import Foro from '../pages/Foro';
import TemaDetalle from '../pages/TemaDetalle';
import NuevoTema from '../pages/NuevoTema';
import Trabajos from '../pages/Trabajos';
import SubirTrabajo from '../pages/SubirTrabajo';
import Home from '../pages/Home';
// import Bienvenida from '../pages/Bienvenida';
import Perfil from '../pages/Perfil';
import EditarPerfil from '../pages/EditarPerfil'
import DashboardAdmin from '../pages/DashboardAdmin';
import RutaAdmin from '../components/RutaAdmin';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import CursosAdmin from '../pages/admin/CursosAdmin';
import NuevoCurso from '../pages/admin/NuevoCurso';
import AdminMateriales from '../pages/admin/AdminMateriales';
import NuevoDocumento from '../pages/admin/NuevoDocumento';
import NuevoVideo from '../pages/admin/NuevoVideo';
import AdminPreguntas from '../pages/admin/AdminPreguntas';
import ComprarMembresia from '../pages/ComprarMembresia';
import PagoExitoso from "../pages/PagoExitoso";
import PagoFallido from "../pages/PagoFallido";
import PagoPendiente from "../pages/PagoPendiente";
import InfoExtra from "../pages/InfoExtra";
import InfoExtraAdmin from "../pages/admin/InfoExtraAdmin";
import PaginaNoEncontrada from '../pages/PaginaNoEncontrada';

import RutaPrivada from './RutaPrivada';

const AppRouter = () => {
  const { usuario } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/membresia" element={<ComprarMembresia />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-fallido" element={<PagoFallido />} />
          <Route path="/pago-pendiente" element={<PagoPendiente />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<RutaPrivada><LayoutPrivado /></RutaPrivada>}>
          <Route path="/dashboard" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoDetalle />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/foro/:id" element={<TemaDetalle />} />
          <Route path="/foro/nuevo" element={<NuevoTema />} />
          <Route path="/cursos/:cursoId/trabajos" element={<Trabajos />} />
          <Route path="/cursos/:cursoId/trabajos/nuevo" element={<SubirTrabajo />} />
          <Route path="/info-extra" element={<InfoExtra />} />

          {usuario && (
            <>
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/perfil/editar" element={<EditarPerfil />} />
            </>  
          )}
          </Route>
          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <DashboardAdmin />
              </RutaAdmin>
            }
          />
          {/* Rutas de administración */}
          {usuario?.rol === "admin" && (
            <>
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/admin/cursos" element={<CursosAdmin />} />
              <Route path="/admin/cursos/nuevo" element={<NuevoCurso />} />
              <Route path="/admin/materiales/:cursoId" element={<AdminMateriales />} />
              <Route path="/admin/materiales/:cursoId/documento/nuevo" element={<NuevoDocumento />} />
              <Route path="/admin/materiales/:cursoId/video/nuevo" element={<NuevoVideo />} />
              <Route path="/admin/preguntas" element={<AdminPreguntas />} />
              <Route path="/admin/info-extra" element={<InfoExtraAdmin />} />
            </>
          )}

        {/* Página no encontrada */}
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;