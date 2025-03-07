import {CatalogueModel, EmployeeModel} from "../core";
import {RoleModel} from "./role.model";

export interface UserModel {
  id: string;
  identificationType: CatalogueModel;
  identificationTypeId: CatalogueModel;
  sex: CatalogueModel;
  gender: CatalogueModel;
  ethnicOrigin: CatalogueModel;
  bloodType: CatalogueModel;
  bloodTypeId: CatalogueModel;
  maritalStatus: CatalogueModel;
  phones: CatalogueModel[];
  emails: CatalogueModel[];
  roles: RoleModel[];
  avatar: string;
  birthdate: string;
  email: string;
  emailVerifiedAt: Date;
  identification: string;
  lastname: string;
  maxAttempts: number;
  name: string;
  password: string;
  passwordChanged: boolean;
  phone: string;
  suspendedAt: Date;
  username: string;
  employee: EmployeeModel;
}

export interface CreateUserDto extends Omit<UserModel, 'id'> {
}

export interface UpdateUserDto extends Partial<Omit<UserModel, 'id'>> {
}

export interface SelectUserDto extends Partial<UserModel> {
}
