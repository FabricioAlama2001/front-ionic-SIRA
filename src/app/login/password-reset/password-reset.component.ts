import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from "../../services/auth";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class PasswordResetComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authHttpService = inject(AuthHttpService);

  protected form: FormGroup;
  protected emailMasked = '';
  protected isCodeSent = false;
  protected isCodeValid = false;
  protected errorAlert = false;
  protected successAlert = false;
  protected errorMessage = '';
  protected successMessage = '';

  constructor() {
    this.form = this.formBuilder.group({
      username: [''],
      code: [''],
      newPassword: ['']
    });
  }

  /** 🚀 Paso 1: Enviar código de verificación */
  sendVerificationCode() {
    this.errorMessage = '';
    this.authHttpService.requestVerificationCode(this.form.value.username).subscribe({
      next: (response) => {
        this.isCodeSent = true;
        this.emailMasked = response.data;
        this.successMessage = 'Código enviado correctamente.';
        this.successAlert = true;
      },
      error: (err) => {
        this.errorMessage = 'Usuario no encontrado. Verifique su información.';
        this.errorAlert = true;
      }
    });
  }

  /** 🚀 Paso 2: Verificar Código */
  verifyCode() {
    this.errorMessage = '';
    this.authHttpService.verifyVerificationCode(this.form.value.code, this.form.value.username).subscribe({
      next: () => {
        this.isCodeValid = true;
        this.successMessage = 'Código verificado con éxito.';
        this.successAlert = true;
      },
      error: (err) => {
        this.errorMessage = 'Código incorrecto o expirado.';
        this.errorAlert = true;
      }
    });
  }

  /** 🚀 Paso 3: Cambiar Contraseña */
  updatePassword() {
    this.errorMessage = '';
    this.authHttpService.resetPassword(this.form.value.username, this.form.value.newPassword).subscribe({
      next: () => {
        this.successMessage = '✅ Contraseña actualizada correctamente. Redirigiendo al login...';
        this.successAlert = true;
        setTimeout(() => {
          window.location.href = "/login"; // 🔄 Redirigir al login
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'No se pudo actualizar la contraseña.';
        this.errorAlert = true;
      }
    });
  }
  /** 🔙 Método para regresar al login */
  goBack() {
    window.location.href = "/login"; // 🔄 Redirigir al login
  }
}
