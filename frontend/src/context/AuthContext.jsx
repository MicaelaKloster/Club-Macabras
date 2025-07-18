import { createContext, useContext, useState } from "react";

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(() => {
        const stored = localStorage.getItem("usuario");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (usuarioData) => {
        setUsuario(usuarioData);
        localStorage.setItem("usuario", JSON.stringify(usuarioData)); // guardamos usuario
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario"); // eliminamos usuario
        localStorage.removeItem("token"); // eliminamos token
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};