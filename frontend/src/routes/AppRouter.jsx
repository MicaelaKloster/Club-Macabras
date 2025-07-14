import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Cursos from '../pages/Cursos';
import Foro from '../pages/Foro';
import Trabajos from '../pages/Trabajos';
import Home from '../pages/Home';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas privadas (luego agregamos protección) */}
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="/trabajos" element={<Trabajos />} />

        {/* Página por defecto si la ruta no existe */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;