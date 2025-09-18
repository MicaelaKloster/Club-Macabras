import { Resend } from 'resend';
import Handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

// Necesario para que funcione __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Resend con la API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Función auxiliar para renderizar templates Handlebars
const renderTemplate = async (templateName, context) => {
  const templatePath = path.resolve(__dirname, '../templates/emails', `${templateName}.handlebars`);
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);
  return template(context);
};

// Notificación de recuperación de contraseña al usuario
export const enviarCorreoRecuperacion = async (emailDestino, token) => {
  const link = `${process.env.FRONTEND_URL}/restablecer-password?token=${token}`;
  const html = await renderTemplate('recuperacion', {
    link,
    email: emailDestino,
  });

  await resend.emails.send({
    from: `Club Macabras <noreply@resend.dev>`,
    to: emailDestino,
    subject: 'Recuperación de contraseña - Club Macabras',
    html,
  });
};

// Notificación de bienvenida al usuario
export const enviarCorreoBienvenida = async (emailDestino, nombre) => {
  const html = await renderTemplate('bienvenida', {
    nombre,
  });

  await resend.emails.send({
    from: `Club Macabras <noreply@resend.dev>`,
    to: emailDestino,
    subject: '¡Bienvenida a Club Macabras!',
    html,
  });
};

// Notificación de pago exitoso al usuario
export const enviarCorreoPagoExitoso = async (emailDestino, nombre, fechaVencimiento) => {
  const html = await renderTemplate('pago-exitoso', {
    nombre,
    fechaVencimiento,
    linkDashboard: `${process.env.FRONTEND_URL}/dashboard`,
  });

  await resend.emails.send({
    from: `Club Macabras <noreply@resend.dev>`,
    to: emailDestino,
    subject: '¡Pago confirmado! Tu membresía está activa - Club Macabras',
    html,
  });
};

// Notificación de nuevo pago al admin
export const enviarCorreoNuevoPagoAdmin = async (nombreUsuario, email, monto) => {
  const html = await renderTemplate('nuevo-pago-admin', {
    nombreUsuario,
    email,
    monto,
    fecha: new Date().toLocaleDateString('es-AR'),
    linkAdmin: `${process.env.FRONTEND_URL}/admin/usuarios`,
  });

  await resend.emails.send({
    from: `Club Macabras <noreply@resend.dev>`,
    to: process.env.EMAIL_ADMIN,
    subject: `Nuevo pago recibido - ${nombreUsuario}`,
    html,
  });
};

// Recordatorio de vencimiento próximo
export const enviarCorreoProximoVencimiento = async (emailDestino, nombre, diasRestantes, fechaVencimiento) => {
  const html = await renderTemplate('proximo-vencimiento', {
    nombre,
    diasRestantes,
    fechaVencimiento,
    linkRenovacion: `${process.env.FRONTEND_URL}/membresia`,
  });

  await resend.emails.send({
    from: `Club Macabras <noreply@resend.dev>`,
    to: emailDestino,
    subject: `Tu membresía vence en ${diasRestantes} días - Club Macabras`,
    html,
  });
};

// Notificación de membresía vencida
export const enviarCorreoMembresiaVencida = async (emailDestino, nombre, diasVencida) => {
  const html = await renderTemplate('membresia-vencida', {
    nombre,
    diasVencida,
    linkRenovacion: `${process.env.FRONTEND_URL}/membresia`,
  });

  await resend.emails.send({
    from: `Club Macabras <noreply@resend.dev>`,
    to: emailDestino,
    subject: 'Tu membresía ha vencido - Renueva ahora - Club Macabras',
    html,
  });
};

// Notificación de cancelación de membresía
export const enviarCorreoCancelacionMembresia = async (email, nombre) => {
  const html = await renderTemplate('cancelacion-membresia', {
    nombre,
    fecha_cancelacion: new Date().toLocaleDateString('es-AR'),
    email_soporte: 'clubmacabras@gmail.com', // Cambia si tienes un email de soporte
    linkReactivar: `${process.env.FRONTEND_URL}/membresia`,
  });

  await resend.emails.send({
    from: `Club Macabras <noreply@resend.dev>`,
    to: email,
    subject: 'Membresía cancelada - Club Macabras',
    html,
  });
};