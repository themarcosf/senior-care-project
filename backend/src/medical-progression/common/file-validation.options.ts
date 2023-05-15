import { mkdir } from "fs";
import { Request } from "express";
import { diskStorage } from "multer";
import { UnauthorizedException } from "@nestjs/common";
////////////////////////////////////////////////////////////////////////////////

function createMedicalTestsDestination(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void
) {
  const medicalRecord = req.query.medicalRecord;
  const destination = `./uploads/medTests/${medicalRecord}`;
  mkdir(destination, { recursive: true }, (err) => {
    if (err) new UnauthorizedException(err);
  });
  cb(null, destination);
}

function medicalTestsFilename(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void
) {
  cb(null, `${Date.now()}-${file.originalname}`);
}

function medicalTestsFileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptedFile: boolean) => void
) {
  const acceptedFormats = /\.(jpg|jpeg|png|gif|pdf)$/;
  if (!file.originalname.match(acceptedFormats)) {
    cb(
      new UnauthorizedException("Accepted formats: JPG, JPEG, PNG, GIF, PDF"),
      false
    );
  } else {
    cb(null, true);
  }
}

export default {
  storage: diskStorage({
    destination: createMedicalTestsDestination,
    filename: medicalTestsFilename,
  }),
  fileFilter: medicalTestsFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB
  },
};
