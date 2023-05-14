export type patient = {
  id: number;
  name: string;
  lastEvolution: string;
  evolutions: evolution[];
};

export type evolution = {
  id: number;
  professionalName: string;
  professionalArea: string;
};
