import { User } from "../../users/entities/user.entity";
import { ProgressionType } from "../../progression-type/entities/progression-type.entity";
////////////////////////////////////////////////////////////////////////////////

export interface QueryRunnerInterface {
  connect(): Promise<void>;
  startTransaction(): Promise<void>;
  commitTransaction(obj: User | ProgressionType): Promise<void>;
  rollbackTransaction(): Promise<void>;
  release(): Promise<void>;
}
