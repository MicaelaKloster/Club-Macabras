import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const LayoutPrivado = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutPrivado;