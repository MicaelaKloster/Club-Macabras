import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err){
        console.error('❌ Error al conectar a la base de datos:', err);
        return;
    }
    console.log('✅ Conexión a la base de datos exitosa');
});

export default connection;