import { Request } from "express";
import { diskStorage } from "multer";
import { UnauthorizedException } from "@nestjs/common";
////////////////////////////////////////////////////////////////////////////////

// creates a destination folder for the file
function createMedicalTestsDestination(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void
) {
  cb(null, `./uploads/medTests/${req.query.medicalRecord}`);
}

// creates a filename using the current date and the original name of the file
function medicalTestsFilename(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void
) {
  cb(null, `${Date.now()}-${file.originalname}`);
}

// validates the file extension
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
