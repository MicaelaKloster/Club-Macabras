import { desactivarMembresiasVencidas } from '../services/membresias.service.js';

export const ejecutarVerificacionDeMembresias = async () => {
    try{
        await desactivarMembresiasVencidas();

    }catch (error){
        console.error('❌ Error al desactivar membresías vencidas: ', error);
    }
};   