import Handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import Mailjet from 'node-mailjet';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config Mailjet
const MAILJET_PUBLIC = process.env.MAILJET_PUBLIC_KEY;
const MAILJET_SECRET = process.env.MAILJET_SECRET_KEY;
const FROM_EMAIL = process.env.MAILJET_FROM || process.env.EMAIL_ADMIN;

if (!MAILJET_PUBLIC || !MAILJET_SECRET) {
  console.error('❌ MAILJET_PUBLIC_KEY o SECRET_KEY no configurados en .env');
  throw new Error('Configuración de Mailjet incompleta');
}

// Inicializar Mailjet con la API v6.x
const mailjet = Mailjet.apiConnect(MAILJET_PUBLIC, MAILJET_SECRET);
console.log('✅ SDK Mailjet inicializado');

// Render templates
const renderTemplate = async (templateName, context) => {
  try {
    const templatePath = path.resolve(__dirname, '../templates/emails', `${templateName}.handlebars`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(context);
  } catch (error) {
    console.error(`❌ Error al cargar template ${templateName}:`, error);
    throw error;
  }
};

const enviarEmailMailjet = async (to, subject, html, retries = 2) => {
  const payload = {
    Messages: [
      {
        From: {
          Email: FROM_EMAIL,
          Name: 'Club Macabras'
        },
        To: [
          {
            Email: to
          }
        ],
        ReplyTo: {
          Email: process.env.EMAIL_ADMIN,  
          Name: 'Camila - Club Macabras'
        },
        Subject: subject,
        HTMLPart: html
      }
    ]
  };

  console.log(`📤 Enviando email a ${to}...`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const request = await mailjet
        .post('send', { version: 'v3.1' })
        .request(payload);

      const response = request.body;
      
      if (response.Messages && response.Messages[0].Status === 'success') {
        console.log(`✅ Email enviado a ${to}: MessageID ${response.Messages[0].To[0].MessageID}`);
        return response;
      } else {
        const errorMsg = response.Messages?.[0]?.Errors?.[0]?.ErrorMessage || 'Envío falló';
        throw new Error(`Error Mailjet: ${errorMsg}`);
      }
    } catch (error) {
      console.error(`❌ Error intento ${attempt}/${retries}:`, error.message);
      
      // Si es el último intento, lanzar el error
      if (attempt === retries) {
        throw error;
      }
      
      // Esperar antes de reintentar (backoff exponencial)
      const waitTime = attempt * 1000;
      console.log(`⏳ Reintentando en ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Funciones de correo
export const enviarCorreoRecuperacion = async (emailDestino, token) => {
  try {
    const link = `${process.env.FRONTEND_URL}/restablecer-password?token=${token}`;
    const html = await renderTemplate('recuperacion', { link, email: emailDestino });
    await enviarEmailMailjet(emailDestino, 'Recuperación de contraseña - Club Macabras', html);
  } catch (error) {
    console.error('❌ Error al enviar correo de recuperación:', error);
    throw error;
  }
};

export const enviarCorreoBienvenida = async (emailDestino, nombre) => {
  try {
    const html = await renderTemplate('bienvenida', { nombre });
    await enviarEmailMailjet(emailDestino, '¡Bienvenida a Club Macabras!', html);
  } catch (error) {
    console.error('❌ Error al enviar correo de bienvenida:', error);
    throw error;
  }
};

export const enviarCorreoPagoExitoso = async (emailDestino, nombre, fechaVencimiento) => {
  try {
    const html = await renderTemplate('pago-exitoso', {
      nombre, 
      fechaVencimiento, 
      linkDashboard: `${process.env.FRONTEND_URL}/dashboard`
    });
    await enviarEmailMailjet(emailDestino, '¡Pago confirmado! Tu membresía está activa - Club Macabras', html);
  } catch (error) {
    console.error('❌ Error al enviar correo de pago exitoso:', error);
    throw error;
  }
};

export const enviarCorreoNuevoPagoAdmin = async (nombreUsuario, email, monto) => {
  try {
    const html = await renderTemplate('nuevo-pago-admin', {
      nombreUsuario, 
      email, 
      monto,
      fecha: new Date().toLocaleDateString('es-AR'),
      linkAdmin: `${process.env.FRONTEND_URL}/admin/usuarios`
    });
    await enviarEmailMailjet(process.env.EMAIL_ADMIN, `Nuevo pago recibido - ${nombreUsuario}`, html);
  } catch (error) {
    console.error('❌ Error al enviar correo de nuevo pago al admin:', error);
    throw error;
  }
};

export const enviarCorreoProximoVencimiento = async (emailDestino, nombre, diasRestantes, fechaVencimiento) => {
  try {
    const html = await renderTemplate('proximo-vencimiento', {
      nombre, 
      diasRestantes, 
      fechaVencimiento,
      linkRenovacion: `${process.env.FRONTEND_URL}/membresia`
    });
    await enviarEmailMailjet(emailDestino, `Tu membresía vence en ${diasRestantes} días - Club Macabras`, html);
  } catch (error) {
    console.error('❌ Error al enviar correo de próximo vencimiento:', error);
    throw error;
  }
};

export const enviarCorreoMembresiaVencida = async (emailDestino, nombre, diasVencida) => {
  try {
    const html = await renderTemplate('membresia-vencida', {
      nombre, 
      diasVencida, 
      linkRenovacion: `${process.env.FRONTEND_URL}/membresia`
    });
    await enviarEmailMailjet(emailDestino, 'Tu membresía ha vencido - Renueva ahora - Club Macabras', html);
  } catch (error) {
    console.error('❌ Error al enviar correo de membresía vencida:', error);
    throw error;
  }
};

export const enviarCorreoCancelacionMembresia = async (email, nombre) => {
  try {
    const html = await renderTemplate('cancelacion-membresia', {
      nombre,
      fecha_cancelacion: new Date().toLocaleDateString('es-AR'),
      email_soporte: 'clubmacabras@gmail.com',
      linkReactivar: `${process.env.FRONTEND_URL}/membresia`
    });
    await enviarEmailMailjet(email, 'Membresía cancelada - Club Macabras', html);
  } catch (error) {
    console.error('❌ Error al enviar correo de cancelación:', error);
    throw error;
  }
};