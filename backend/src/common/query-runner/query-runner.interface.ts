import { User } from "../../users/entities/user.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-records.entity";
import { MedicalProgression } from "../../medical-progression/entities/medical-progression.entity";
////////////////////////////////////////////////////////////////////////////////

/**
 * QueryRunnerInterface
 *
 * @description this interface defines the methods that a query runner must implement.
 */

export interface QueryRunnerInterface {
  connect(): Promise<void>;
  startTransaction(): Promise<void>;
  commitTransaction(
    obj: User | ProgressionType | MedicalRecord | MedicalProgression
  ): Promise<void>;
  rollbackTransaction(): Promise<void>;
  release(): Promise<void>;
}
