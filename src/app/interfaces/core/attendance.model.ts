import { EmployeeModel } from './employee.model';
import { CatalogueModel } from './catalogue.model';

export interface AttendanceModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  employee: EmployeeModel;
  type: CatalogueModel;
  registeredAt: Date;
  late: boolean;
}

export interface CreateAttendanceDto extends Omit<AttendanceModel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}
export interface UpdateAttendanceDto extends Partial<Omit<AttendanceModel, 'createdAt' | 'updatedAt' | 'deletedAt'>> {}
export interface SelectAttendanceDto extends Partial<AttendanceModel> {}
