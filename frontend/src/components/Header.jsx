import { Link, NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-pink-100 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo o Nombre*/}
                <Link to="/" className="text-2xl font-bold text-pink-700">
                    Club Macabras
                </Link>

                {/* Navegación */}
                <nav className="flex gap-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Inicio
                    </NavLink>
                    <NavLink
                        to="/cursos"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Cursos
                    </NavLink>
                    <NavLink
                        to="/foro"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Foro
                    </NavLink>
                    {/* <NavLink
                        to="/trabajos"
                        className={({ isActive }) =>
                            isActive ? "text-pink-700 font-semibold" : "text-gray-700"
                        }
                    >
                        Trabajos
                    </NavLink> */}
                </nav>
            </div>
        </header>
    );
};

export default Header;