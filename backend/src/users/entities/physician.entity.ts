import { Entity } from "typeorm";
import { PracticalNurse } from "./practicalNurse.entity";
////////////////////////////////////////////////////////////////////////////////

@Entity()
export class Physician extends PracticalNurse {}
