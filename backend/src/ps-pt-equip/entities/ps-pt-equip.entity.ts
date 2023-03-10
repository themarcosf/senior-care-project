/**
 * this entity describes a Personal Protective Equipment,
 * as commomly used in factories floors and distribution centers
 */
export class PsPtEquip {
  id: number;
  name: string;
  description: string;
  type: string;
  size: string;
  color: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseInvoice: string; // entity to be implemented, README.md
}
