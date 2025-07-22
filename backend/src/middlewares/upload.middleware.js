import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configurar la ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde se guardarán las imágenes
const carpetaUploads = path.join(__dirname, '../uploads');

if (!fs.existsSync(carpetaUploads)) {
  fs.mkdirSync(carpetaUploads);
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaUploads);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, nombre);
  }
});

export const upload = multer({ storage });