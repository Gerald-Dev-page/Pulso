import { supabase } from './supabaseClient';
import { convertToWebP } from './imageOptimizer';

export const storageService = {
  async uploadProductImage(file, customName = '') {
    try {
      // 1. Convertir a WebP en el navegador
      const webpBlob = await convertToWebP(file);

      // 2. Generar nombre de archivo único .webp
      const cleanPrefix = (customName || file.name.split('.')[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const fileName = `${cleanPrefix}-${Date.now()}.webp`;
      const filePath = `catalog/${fileName}`;

      // 3. Subir el Blob a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, webpBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 4. Obtener la URL pública permanente
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error al subir imagen a Storage:', error);
      throw error;
    }
  }
};