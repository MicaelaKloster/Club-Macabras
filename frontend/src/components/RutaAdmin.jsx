import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RutaAdmin = ({ children }) => {
    const { usuario } = useAuth();

    if(!usuario) return <Navigate to="/login" />;
    if(usuario.rol !== 'admin') return <Navigate to="/" />;

    return children;
};

export default RutaAdmin;