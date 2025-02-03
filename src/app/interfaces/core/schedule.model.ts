import {EmployeeModel} from "./employee.model";

export interface ScheduleModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  employee: EmployeeModel;
  hourStartedAt: number;
  hourEndedAt: number;
  minuteStartedAt: number;
  minuteEndedAt: number;

}

export interface CreateScheduleDto extends Omit<ScheduleModel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface UpdateScheduleDto extends Partial<Omit<ScheduleModel, 'createdAt' | 'updatedAt' | 'deletedAt'>> {}

export interface SelectScheduleDto extends Partial<ScheduleModel> {}
