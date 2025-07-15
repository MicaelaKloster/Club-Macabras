import { Outlet } from 'react-router-dom';

const LayoutPublico = ({ children }) => {
    return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                {children}
                <Outlet />
            </div>
        </div>
    );
}; 

export default LayoutPublico;