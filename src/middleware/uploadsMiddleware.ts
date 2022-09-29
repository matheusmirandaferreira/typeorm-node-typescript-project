import { Request } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v4 } from 'uuid';

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, 'public/storage/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const token = req.headers.authorization.split(' ')[1];
    const {} = jwt.decode(token, {});
    cb(null, `${v4()}-${file.originalname}`);
  },
});

const fileFilter = (_: Request, file: Express.Multer.File, cb) => {
  const fileType = file.mimetype;

  const acceptedFiles = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg'];

  if (acceptedFiles.includes(fileType)) {
    cb(null, true);
  } else {
    cb(new Error(`O tipo ${fileType} não é aceito`), false);
  }
};

const uploadsMiddleware = multer({ storage, fileFilter: fileFilter });

export { uploadsMiddleware };
