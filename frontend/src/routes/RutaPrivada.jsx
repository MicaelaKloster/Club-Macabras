import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RutaPrivada = ({ children }) => {
    const { usuario } = useAuth();

    if(!usuario) {
        // Si no hay usuario autenticado, redirigir a la página de login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RutaPrivada;