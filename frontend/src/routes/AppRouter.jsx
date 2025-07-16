import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutPublico from '../layouts/LayoutPublico';
import LayoutPrivado from '../layouts/LayoutPrivado';

import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Cursos from '../pages/Cursos';
import Foro from '../pages/Foro';
import Trabajos from '../pages/Trabajos';
import Home from '../pages/Home';
import Bienvenida from '../pages/Bienvenida';

import RutaPrivada from './RutaPrivada';

const AppRouter = () => {
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
          <Route path="/foro" element={<Foro />} />
          <Route path="/trabajos" element={<Trabajos />} />
        </Route>

        {/* Página no encontrada */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;