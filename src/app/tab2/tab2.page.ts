import {Component, inject, OnInit} from '@angular/core';
import {AttendanceModel, CatalogueModel} from "../interfaces/core";
import {AuthService} from "../services/auth";
import {AttendanceHttpService} from "../services/attendances-http.service";
import {CataloguesHttpService} from "../services/catalogues-http.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  protected types: CatalogueModel[] = [];
  protected attendances: AttendanceModel[] = []
  private readonly authService = inject(AuthService);
  private readonly attendanceHttpService = inject(AttendanceHttpService);
  protected startedAtControl = new FormControl();
  protected endedAtControl = new FormControl();

  constructor() {
  }


  findAttendancesByEmployee() {
    this.attendanceHttpService.findAttendancesByEmployee(
      this.authService.auth.employee.id,
      new Date(this.startedAtControl.value),
      new Date(this.endedAtControl.value)).subscribe(response => {
      this.attendances = response;
    })
  }
}
