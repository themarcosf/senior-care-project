import { User } from "../../users/entities/user.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
////////////////////////////////////////////////////////////////////////////////

export interface QueryRunnerInterface {
  connect(): Promise<void>;
  startTransaction(): Promise<void>;
  commitTransaction(obj: User | ProgressionType | MedicalRecord): Promise<void>;
  rollbackTransaction(): Promise<void>;
  release(): Promise<void>;
}
