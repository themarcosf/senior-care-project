export type patientCard = {
  id: number;
  patientFullName: string;
  __progressions__: progressions[];
};

export type progressions = {
  id: number;
  physicians: string;
  physiciansArea: string;
};
