import { useState } from 'react';
import { supabase } from '../config/supabase';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

const ImageUploader = ({ currentImageUrl, onImageChange, label = "Imagen" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl || '');

  const uploadImage = async (event) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `cursos/${fileName}`;

      // Subir archivo a Supabase
      const { error: uploadError } = await supabase.storage
        .from('imagenes-cursos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtener URL pública
      const { data } = supabase.storage
        .from('imagenes-cursos')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setPreview(publicUrl);
      onImageChange(publicUrl);

    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview('');
    onImageChange('');
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold flex items-center">
        <ImageIcon className="h-4 w-4 mr-1" />
        {label}
      </Label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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