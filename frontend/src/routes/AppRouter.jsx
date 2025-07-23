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
import Bienvenida from '../pages/Bienvenida';
import Perfil from '../pages/Perfil';
import EditarPerfil from '../pages/EditarPerfil'

import RutaPrivada from './RutaPrivada';

const AppRouter = () => {
  const { usuario } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<Bienvenida />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<RutaPrivada><LayoutPrivado /></RutaPrivada>}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoDetalle />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/foro/:id" element={<TemaDetalle />} />
          <Route path="/foro/nuevo" element={<NuevoTema />} />
          {/* <Route path="/trabajos" element={<Trabajos />} /> */}
          <Route path="/cursos/:cursoId/trabajos" element={<Trabajos />} />
          <Route path="/cursos/:cursoId/trabajos/nuevo" element={<SubirTrabajo />} />
          {usuario && (
            <>
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/perfil/editar" element={<EditarPerfil />} />
            </>  
          )}
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;