import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { deleteImageFromStorage } from '../utils/storageUtils';

const ImageUploader = ({ currentImageUrl, onImageChange, label = "Imagen" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl || '');
  const [error, setError] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setPreview(currentImageUrl || '');
  }, [currentImageUrl]);

  const uploadImage = async (event) => {
    try {
      setUploading(true);
      setError('');
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen es muy grande. Máximo 5MB');
        return;
      }

      // Si hay una imagen anterior, eliminarla
      if (preview) {
        await deleteImageFromStorage(preview);
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `cursos/${fileName}`;

      console.log('Subiendo archivo:', filePath);

      // Subir archivo a Supabase
      const { error: uploadError } = await supabase.storage
        .from('imagenes-cursos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error de subida:', uploadError);
        throw uploadError;
      }

      // Obtener URL pública
      const { data } = supabase.storage
        .from('imagenes-cursos')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      console.log('URL generada:', publicUrl);

      fetch(publicUrl)
      .then(response => {
        console.log('Status de la imagen:', response.status);
        if (!response.ok) {
          console.error('Error en la imagen:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error al verificar imagen:', error);
      });
      
      setPreview(publicUrl);
      onImageChange(publicUrl);

    } catch (error) {
      console.error('Error al subir imagen:', error);
      setError('Error al subir la imagen: ' + (error.message || 'Error desconocido'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (preview) {
      await deleteImageFromStorage(preview);
    }
    setPreview('');
    onImageChange('');
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setError('');
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setError('No se pudo cargar la imagen');
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold flex items-center">
        <ImageIcon className="h-4 w-4 mr-1" />
        {label}
      </Label>
      
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg border overflow-hidden">
            <img 
              src={preview} 
              alt="Preview"
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 h-auto w-auto"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-4">Sube una imagen para tu curso</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          disabled={uploading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Subiendo...</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        Formatos soportados: JPG, PNG, GIF. Máximo 5MB. Recomendado: 800x450px (16:9)
      </p>
    </div>
  );
};

export default ImageUploader;