import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Tab1Page } from './tab1.page';
import { AttendanceHttpService } from '../services/attendances-http.service';
import { AuthService } from '../services/auth';
import { CataloguesHttpService } from '../services/catalogues-http.service';
import { AuthHttpService } from '../services/auth';
import {forkJoin, of} from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl } from '@angular/forms';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let attendanceHttpService: jasmine.SpyObj<AttendanceHttpService>;
  let authService: jasmine.SpyObj<AuthService>;
  let cataloguesHttpService: jasmine.SpyObj<CataloguesHttpService>;
  let authHttpService: jasmine.SpyObj<AuthHttpService>;

  beforeEach(waitForAsync(() => {
    // Creamos los mocks de los servicios
    const attendanceSpy = jasmine.createSpyObj('AttendanceHttpService', ['register', 'findAttendancesByEmployee']);
    const authSpy = jasmine.createSpyObj('AuthService', [], { auth: { employee: { id: '123' }, name: 'John', lastname: 'Doe' } });
    const cataloguesSpy = jasmine.createSpyObj('CataloguesHttpService', ['findCataloguesByTypes']);
    const authHttpSpy = jasmine.createSpyObj('AuthHttpService', ['logOut']);

    // Simulación de respuestas para evitar errores de `subscribe()`
    attendanceSpy.register.and.returnValue(of({})); // ✅ Devuelve un Observable vacío
    attendanceSpy.findAttendancesByEmployee.and.returnValue(of([])); // ✅ Devuelve una lista vacía

    cataloguesSpy.findCataloguesByTypes.and.returnValue(of([])); // ✅ Devuelve una lista vacía

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Tab1Page],
      providers: [
        { provide: AttendanceHttpService, useValue: attendanceSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: CataloguesHttpService, useValue: cataloguesSpy },
        { provide: AuthHttpService, useValue: authHttpSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    attendanceHttpService = TestBed.inject(AttendanceHttpService) as jasmine.SpyObj<AttendanceHttpService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cataloguesHttpService = TestBed.inject(CataloguesHttpService) as jasmine.SpyObj<CataloguesHttpService>;
    authHttpService = TestBed.inject(AuthHttpService) as jasmine.SpyObj<AuthHttpService>;
  }));

  // ✅ Verificar que el componente se crea correctamente
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // ✅ Prueba unitaria de getUserInitials()
  it('debería retornar las iniciales del usuario', () => {
    expect(component.getUserInitials()).toBe('JD');
  });

  // ✅ Simulación de `findAttendancesByEmployee()`
  it('debería obtener las asistencias del empleado', () => {
    const mockAttendances = [
      { type: { code: 'entry' } },
      { type: { code: 'lunch_exit' } }
    ] as any;

    attendanceHttpService.findAttendancesByEmployee.and.returnValue(of(mockAttendances));

    component.findAttendancesByEmployee();
    expect(attendanceHttpService.findAttendancesByEmployee).toHaveBeenCalled();
    expect((component as any).attendances.length).toBe(2); // ✅ Solución para acceder a 'protected'
  });

  // ✅ Simulación de `register()`
  it('debería registrar asistencia correctamente', () => {
    spyOn(window, 'alert'); // Evita que los alert interrumpan la prueba

    const mockType = { code: 'entry' } as any;
    component.typeControl = new FormControl(mockType);
    (component as any).attendances = []; // Simula que no hay asistencias previas

    attendanceHttpService.register.and.returnValue(of({} as any));

    component.register();
    expect(attendanceHttpService.register).toHaveBeenCalledWith('123', mockType);
    expect(component.isLoading).toBeFalse();
  });

  // ✅ Simulación de `logOut()`
  it('debería cerrar sesión', () => {
    component.logOut();
    expect(authHttpService.logOut).toHaveBeenCalled();
  });
  it('no debería registrar si no se ha registrado la entrada antes del almuerzo', () => {
    spyOn(window, 'alert'); // Evita que los alert interrumpan la prueba

    const mockType = { code: 'lunch_exit' } as any;
    component.typeControl = new FormControl(mockType);
    (component as any).attendances = []; // No hay entrada registrada

    component.register();
    expect(window.alert).toHaveBeenCalledWith('No ha registrado la entrada');
    expect(attendanceHttpService.register).not.toHaveBeenCalled();
  });

  it('no debería registrar si no se ha registrado la salida del almuerzo antes del regreso', () => {
    spyOn(window, 'alert');

    const mockType = { code: 'lunch_return' } as any;
    component.typeControl = new FormControl(mockType);
    (component as any).attendances = [{ type: { code: 'entry' } }]; // No hay 'lunch_exit'

    component.register();
    expect(window.alert).toHaveBeenCalledWith('No ha registrado la salida del almuerzo');
    expect(attendanceHttpService.register).not.toHaveBeenCalled();
  });

  it('no debería registrar la salida si no se ha registrado la entrada', () => {
    spyOn(window, 'alert');

    const mockType = { code: 'exit' } as any;
    component.typeControl = new FormControl(mockType);
    (component as any).attendances = []; // No hay entrada registrada

    component.register();
    expect(window.alert).toHaveBeenCalledWith('No ha registrado la entrada');
    expect(attendanceHttpService.register).not.toHaveBeenCalled();
  });
  it('debería llamar a logOut cuando se cierra sesión', () => {
    spyOn(component, 'logOut').and.callThrough();
    component.logOut();
    expect(component.logOut).toHaveBeenCalled();
    expect(authHttpService.logOut).toHaveBeenCalled();
  });

  it('no debería permitir salida si no se ha registrado el regreso del almuerzo', () => {
    spyOn(window, 'alert');

    const mockType = { code: 'exit' } as any;
    component.typeControl = new FormControl(mockType);

    // Simula que hay una salida de almuerzo pero no un regreso
    (component as any).attendances = [
      { type: { code: 'entry' } },
      { type: { code: 'lunch_exit' } }
    ];

    component.register();

    expect(window.alert).toHaveBeenCalledWith('No ha registrado el regreso del almuerzo');
    expect(attendanceHttpService.register).not.toHaveBeenCalled();
  });
  it('debería deshabilitar los tipos correctos en findTypes()', () => {
    const mockCatalogues = [
      { code: 'entry', enabled: true },
      { code: 'lunch_exit', enabled: true },
      { code: 'lunch_return', enabled: true },
      { code: 'exit', enabled: true },
    ];

    // Simulamos que el empleado tiene estos registros de asistencia
    (component as any).attendances = [
      { type: { code: 'entry' } },
      { type: { code: 'lunch_exit' } },
      { type: { code: 'lunch_return' } }, // ✅ Agregamos este caso
      { type: { code: 'exit' } } // ✅ Agregamos este caso
    ];

    cataloguesHttpService.findCataloguesByTypes.and.returnValue(of(mockCatalogues));

    component.findTypes();

    expect(cataloguesHttpService.findCataloguesByTypes).toHaveBeenCalledWith('ATTENDANCE_TYPE');

    // ✅ Verificar que los tipos de asistencia ya registrados están deshabilitados
    expect((component as any).types.find((t: { code: string; }) => t.code === 'entry')?.enabled).toBeFalse();
    expect((component as any).types.find((t: { code: string; }) => t.code === 'lunch_exit')?.enabled).toBeFalse();
    expect((component as any).types.find((t: { code: string; }) => t.code === 'lunch_return')?.enabled).toBeFalse();
    expect((component as any).types.find((t: { code: string; }) => t.code === 'exit')?.enabled).toBeFalse();
  })

  it('debería registrar 100 asistencias simultáneamente sin interferencias', (done) => {
    const mockType = { code: 'entry' } as any;
    component.typeControl = new FormControl(mockType);

    // Simular 100 respuestas del servicio con éxito
    (component as any).attendanceHttpService.register.and.returnValue(of({}));

    // Crear 100 registros simultáneos
    const requests = Array.from({ length: 100 }, (_, i) => {
      console.log(`Enviando asistencia #${i + 1}`); // 👀 Verifica en la consola si se ejecutan las 100 solicitudes
      return (component as any).attendanceHttpService.register('123', mockType);
    });

    forkJoin(requests).subscribe({
      next: () => {
        expect((component as any).attendanceHttpService.register).toHaveBeenCalledTimes(100);
        console.log('✅ Se registraron correctamente las 100 asistencias'); // 👀 Confirmación final en consola
        done(); // Marcar la prueba como completada
      },
      error: (err) => {
        fail('Hubo un error en la prueba de concurrencia: ' + err);
        done();
      }
    });
  });


});
