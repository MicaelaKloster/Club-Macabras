import { createContext, useContext, useState } from "react";

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null); // o un objeto con info del usuario

    const login = (usuarioData) => {
        setUsuario(usuarioData);
    };

    const logout = () => {
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};