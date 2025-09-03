import { Outlet, useLocation } from 'react-router-dom';

const LayoutPublico = ({ children }) => {
    const location = useLocation();
    
    // Páginas que no necesitan el contenedor centrado (como Home)
    const paginasCompletas = ['/', '/pago-exitoso', '/pago-fallido', '/pago-pendiente'];
    const esPaginaCompleta = paginasCompletas.includes(location.pathname);

    if (esPaginaCompleta) {
        return (
            <div className="min-h-screen">
                {children}
                <Outlet />
            </div>
        );
    }

    // Layout centrado para login, registro, etc.
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                {children}
                <Outlet />
            </div>
        </div>
    );
}; 

export default LayoutPublico;