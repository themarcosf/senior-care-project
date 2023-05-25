export type patientCard = {
  id: number;
  patientFullName: string;
  __progressions__: progressions[];
};

export type progressions = {
  id: number;
  professional: string;
  physiciansArea: string;
  createdAt: string;
};
