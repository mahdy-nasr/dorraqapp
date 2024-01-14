import path from 'path';
import multer, { type StorageEngine } from 'multer';

interface File {
  fieldname: string;
  originalname: string;
}

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file: File, cb) => {
    cb(null, 'Upload/Images');
  },
  filename: (req, file: File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

export const upload = multer({ storage });
