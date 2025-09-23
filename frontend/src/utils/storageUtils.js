import { supabase } from '../config/supabase';

export const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('supabase')) return;
  
  try {
    // Extraer el path correcto del archivo de la URL
    // URL típica: https://xxxxx.supabase.co/storage/v1/object/public/imagenes-cursos/cursos/filename.jpg
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    
    // Encontrar la parte después de 'public/imagenes-cursos/'
    const bucketIndex = pathParts.indexOf('imagenes-cursos');
    if (bucketIndex === -1) return;
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    console.log('Intentando eliminar archivo:', filePath);
    
    const { error } = await supabase.storage
      .from('imagenes-cursos')
      .remove([filePath]);
      
    if (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
    
    console.log('Imagen eliminada correctamente:', filePath);
    
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
  }
};

// Función adicional para verificar si una imagen existe
export const checkImageExists = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    return response.ok;
  } catch (error) {
    console.error('Error verificando imagen:', error);
    return false;
  }
};