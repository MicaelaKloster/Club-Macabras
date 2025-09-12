import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Configuración del pool de conexiones para PostgreSQL/Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necesario para Supabase
    },
    // Configuración del pool
    max: 20, // Máximo 20 conexiones en el pool
    idleTimeoutMillis: 30000, // Cerrar conexiones inactivas después de 30s
    connectionTimeoutMillis: 2000, // Timeout de conexión de 2s
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión a Supabase PostgreSQL exitosa');
        
        // Probar una consulta simple
        const result = await client.query('SELECT current_database(), current_user');
        console.log(`📊 Base de datos: ${result.rows[0].current_database}`);
        console.log(`👤 Usuario: ${result.rows[0].current_user}`);
        
        client.release();
    } catch (err) {
        console.error('❌ Error al conectar a Supabase:', err.message);
        console.error('💡 Verifica que DATABASE_URL esté correcta en tu .env');
    }
};

// Función helper para ejecutar queries con mejor manejo de errores
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`🔍 Query ejecutada en ${duration}ms:`, text.substring(0, 50) + '...');
        return res;
    } catch (error) {
        console.error('❌ Error en query:', error.message);
        console.error('📝 Query:', text);
        console.error('📋 Params:', params);
        throw error;
    }
};

// Probar conexión al iniciar
testConnection();

// Exportar el pool y funciones helper
export default pool;
export { query };