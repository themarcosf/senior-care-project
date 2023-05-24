import { User } from "../../users/entities/user.entity";
////////////////////////////////////////////////////////////////////////////////

export interface QueryRunnerInterface {
  connect(): Promise<void>;
  startTransaction(): Promise<void>;
  commitTransaction(obj: User): Promise<void>;
  rollbackTransaction(): Promise<void>;
  release(): Promise<void>;
}
