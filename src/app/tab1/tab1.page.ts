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

  types: CatalogueModel[] = [];
  protected attendances: AttendanceModel[] = []
  protected readonly authService = inject(AuthService);
  private readonly authHttpService = inject(AuthHttpService);
  private readonly attendanceHttpService = inject(AttendanceHttpService);
  private readonly cataloguesHttpService = inject(CataloguesHttpService);
  typeControl = new FormControl();
  protected startedAtControl = new FormControl(new Date());
  protected endedAtControl = new FormControl(new Date());
  isLoading = false;

  constructor() {
  }

  ngOnInit() {
    // this.findTypes();
    this.findAttendancesByEmployee();
  }

  register() {
    if (this.typeControl.value?.code == 'lunch_exit') {
      const entry = this.attendances.some(attendance => attendance.type.code == 'entry');

      if (!entry) {
        alert('No ha registrado la entrada');
        return;
      }
    }

    if (this.typeControl.value?.code == 'lunch_return') {
      const existLunchExit = this.attendances.some(attendance => attendance.type.code == 'lunch_exit');

      if (!existLunchExit) {
        alert('No ha registrado la salida del almuerzo');
        return;
      }
    }

    if (this.typeControl.value?.code == 'exit') {
      const existEntry = this.attendances.some(attendance => attendance.type.code == 'entry');

      if (this.attendances.some(attendance => attendance.type.code == 'lunch_exit')) {
        const existLunchReturn = this.attendances.some(attendance => attendance.type.code == 'lunch_return');

        if (!existLunchReturn) {
          alert('No ha registrado el regreso del almuerzo');
          return;
        }
      }

      if (!existEntry) {
        alert('No ha registrado la entrada');
        return;
      }
    }

    this.isLoading = true;

    this.attendanceHttpService.register(this.authService.auth.employee.id, this.typeControl.value)
      .subscribe(
      () => {
        this.typeControl.reset();
        this.findAttendancesByEmployee();
        this.isLoading = false;
      },error => this.isLoading = false

    );
  }


  getUserInitials(): string {
    if (this.authService.auth && this.authService.auth.name && this.authService.auth.lastname) {
      return this.authService.auth.name.charAt(0).toUpperCase() + this.authService.auth.lastname.charAt(0).toUpperCase();
    }
    return '??'; // Si no hay datos, muestra "??"
  }


  findTypes() {
    this.cataloguesHttpService.findCataloguesByTypes('ATTENDANCE_TYPE').subscribe(response => {
      this.attendances.forEach(attendance => {
        let type = null;

        switch (attendance.type.code) {
          case 'entry':
            type = response.find(type => type.code == 'entry')
            if (type) type.enabled = false;
            break;

          case 'lunch_exit':
            type = response.find(type => type.code == 'lunch_exit')
            if (type) type.enabled = false;
            break;

          case 'lunch_return':
            type = response.find(type => type.code == 'lunch_return')
            if (type) type.enabled = false;
            break;

          case 'exit':
            type = response.find(type => type.code == 'exit')
            if (type) type.enabled = false;
            break;
        }
      });

      this.types = response;
    });
  }

  findAttendancesByEmployee() {
    this.isLoading = true;
    this.attendanceHttpService.findAttendancesByEmployee(
      this.authService.auth.employee.id,
      this.startedAtControl.value!,
      this.endedAtControl.value!)
      .subscribe(response => {
      this.attendances = response;
      this.isLoading = false;
      this.findTypes();
    },error => this.isLoading = false
    )
  }

  logOut() {
    this.authHttpService.logOut();
  }
}
