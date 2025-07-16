const Bienvenida = () => {
  return (
    <div className="text-center p-6">
      <h1 className="text-4xl font-bold text-pink-800">Club Macabras 💖</h1>
      <p className="mt-4 text-gray-700">Capacitaciones en confección de marroquinería</p>

      <div className="mt-6 flex justify-center gap-4">
        <a href="/login" className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800">
          Ingresar
        </a>
        <a href="/registro" className="border border-pink-700 text-pink-700 px-4 py-2 rounded hover:bg-pink-100">
          Registrarme
        </a>
      </div>
    </div>
  );
};

export default Bienvenida;