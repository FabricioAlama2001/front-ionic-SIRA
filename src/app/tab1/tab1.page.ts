import {Component, inject, OnInit} from '@angular/core';
import {AttendanceHttpService} from "../services/attendances-http.service";
import {AttendanceModel, CatalogueModel} from "../interfaces/core";
import {CataloguesHttpService} from "../services/catalogues-http.service";
import {FormControl} from "@angular/forms";
import {AuthHttpService, AuthService} from "../services/auth";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  protected types: CatalogueModel[] = [];
  protected attendances: AttendanceModel[] = []
  protected readonly authService = inject(AuthService);
  private readonly authHttpService = inject(AuthHttpService);
  private readonly attendanceHttpService = inject(AttendanceHttpService);
  private readonly cataloguesHttpService = inject(CataloguesHttpService);
  protected typeControl = new FormControl();
  protected startedAtControl = new FormControl(new Date());
  protected endedAtControl = new FormControl(new Date());

  constructor() {
  }

  ngOnInit() {
    // this.findTypes();
    this.findAttendancesByEmployee();
  }

  register() {
    this.attendanceHttpService.register(this.authService.auth.employee.id, this.typeControl.value).subscribe(
      () => {
        this.typeControl.reset();
        this.findAttendancesByEmployee();
      }
    );
  }

  findTypes() {
    this.cataloguesHttpService.findCataloguesByTypes('ATTENDANCE_TYPE').subscribe(response => {
      this.attendances.forEach(attendance => {
        let type = null;
        switch (attendance.type.code) {
          case 'entry':
            type = response.find(type=>type.code=='entry')
          if (type) type.enabled = false;
            break;

          case 'lunch_exit':
            type = response.find(type=>type.code=='lunch_exit')
            if (type) type.enabled = false;
            break;

          case 'lunch_return':
            type = response.find(type=>type.code=='lunch_return')
            if (type) type.enabled = false;
            break;

          case 'exit':
            type = response.find(type=>type.code=='exit')
            if (type) type.enabled = false;
            break;
       }
      })
      this.types = response;
    });
  }

  findAttendancesByEmployee() {
    this.attendanceHttpService.findAttendancesByEmployee(
      this.authService.auth.employee.id,
      this.startedAtControl.value!,
      this.endedAtControl.value!).subscribe(response => {
      this.attendances = response;

      this.findTypes();
    })
  }

  logOut() {
    this.authHttpService.logOut();
  }
}
