/**
 * this entity describes a delivery of Personal Protective Equipment to a user,
 * as required by law in factories floors and distribution centers
 */
export class Issuance {
  id: number;
  user: string;
  psPtEquip: string;
  quantity: number;
  issuanceDate: Date;
  returnDate: Date;
  returnReason: string;
  returnStatus: string;
  comment: string;
}
