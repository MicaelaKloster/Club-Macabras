import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import hbs from 'nodemailer-express-handlebars';
import dotenv from 'dotenv';

dotenv.config();

// Necesario para que funcione __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configuración de Handlebars
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(__dirname, '../templates/emails/'),
    defaultLayout: false,
    extname: '.handlebars',
  },
  viewPath: path.resolve(__dirname, '../templates/emails/'),
  extName: '.handlebars',
};

transporter.use('compile', hbs(handlebarOptions));

export const enviarCorreoRecuperacion = async (emailDestino, token) => {
  const link = `${process.env.FRONTEND_URL}/restablecer-password?token=${token}`;

  const mailOptions = {
    from: `Club Macabras <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: 'Recuperación de contraseña - Club Macabras',
    template: 'recuperacion', // nombre del archivo .handlebars SIN la extensión
    context: {
      link: link,
      email: emailDestino,
    },
  };

  await transporter.sendMail(mailOptions);
};

export const enviarCorreoBienvenida = async (emailDestino, nombre) => {
  const mailOptions = {
    from: `Club Macabras <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: '¡Bienvenida a Club Macabras!',
    template: 'bienvenida', // nombre del archivo handlebars sin la extensión
    context: {
      nombre: nombre
    },
  };

  await transporter.sendMail(mailOptions);
};