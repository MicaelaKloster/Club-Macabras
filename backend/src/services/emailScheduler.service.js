import cron from 'node-cron';
import { obtenerMembresiasPorVencer, obtenerMembresiaVencidas } from '../services/membresias.service.js';
import { enviarCorreoProximoVencimiento, enviarCorreoMembresiaVencida } from '../utils/mailer.js';

// Ejecutar todos los días a las 9:00 AM
export const inicializarSchedulerEmails = () => {
  console.log('📧 Scheduler de emails iniciado');
  
  // Revisión diaria de membresías
  cron.schedule('0 9 * * *', async () => {
    console.log('🔄 Ejecutando revisión diaria de membresías...');
    
    try {
      // Verificar membresías que vencen en 7 días
      await verificarProximosVencimientos();
      
      // Verificar membresías vencidas (hasta 3 días después del vencimiento)
      await verificarMembresiaVencidas();
      
      console.log('✅ Revisión de membresías completada');
    } catch (error) {
      console.error('❌ Error en la revisión de membresías:', error);
    }
  });
};

const verificarProximosVencimientos = async () => {
  try {
    const membresiasPorVencer = await obtenerMembresiasPorVencer(7); // 7 días
    
    for (const membresia of membresiasPorVencer) {
      const fechaVencimiento = new Date(membresia.fecha_vencimiento);
      const hoy = new Date();
      const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes === 7 || diasRestantes === 3 || diasRestantes === 1) {
        await enviarCorreoProximoVencimiento(
          membresia.email,
          membresia.nombre,
          diasRestantes,
          fechaVencimiento.toLocaleDateString('es-AR')
        );
        
        console.log(`📨 Email de vencimiento enviado a ${membresia.nombre} (${diasRestantes} días)`);
      }
    }
  } catch (error) {
    console.error('Error verificando próximos vencimientos:', error);
  }
};

const verificarMembresiaVencidas = async () => {
  try {
    const membresiaVencidas = await obtenerMembresiaVencidas(3); // Hasta 3 días vencidas
    
    for (const membresia of membresiaVencidas) {
      const fechaVencimiento = new Date(membresia.fecha_vencimiento);
      const hoy = new Date();
      const diasVencida = Math.ceil((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24));
      
      if (diasVencida === 1 || diasVencida === 3) { // Solo enviar el día 1 y día 3
        await enviarCorreoMembresiaVencida(
          membresia.email,
          membresia.nombre,
          diasVencida
        );
        
        console.log(`📨 Email de vencimiento enviado a ${membresia.nombre} (${diasVencida} días vencida)`);
      }
    }
  } catch (error) {
    console.error('Error verificando membresías vencidas:', error);
  }
};