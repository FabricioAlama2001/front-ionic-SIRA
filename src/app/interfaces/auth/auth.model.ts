import {RoleModel} from "./role.model";
import {EmployeeModel} from "../core";

export interface AuthModel {
  id: string;
  roles: RoleModel[];
  avatar: string;
  email: string;
  emailVerifiedAt: Date;
  lastname: string;
  name: string;
  username: string;
  employee: EmployeeModel;
}
