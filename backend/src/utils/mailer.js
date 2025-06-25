import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Si usás Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarCorreoRecuperacion = async (emailDestino, token) => {
  const link = `http://localhost:3000/restablecer-password?token=${token}`;

  const mailOptions = {
    from: 'Club Macabras <' + process.env.EMAIL_USER + '>',
    to: emailDestino,
    subject: 'Recuperación de contraseña - Club Macabras',
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Hola! Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Hacé clic en el siguiente enlace para crear una nueva clave:</p>
      <a href="${link}">${link}</a>
      <p>Este enlace es válido por 15 minutos.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
