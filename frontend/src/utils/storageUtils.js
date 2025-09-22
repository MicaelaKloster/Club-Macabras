import { supabase } from '../config/supabase';

export const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('supabase')) return;
  
  try {
    // Extraer el path del archivo de la URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `cursos/${fileName}`;
    
    const { error } = await supabase.storage
      .from('imagenes-cursos')
      .remove([filePath]);
      
    if (error) throw error;
    
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
  }
};