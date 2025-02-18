import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { IonicModule, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import {AuthHttpService, AuthService} from "../../services/auth";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class PasswordChangeComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authHttpService = inject(AuthHttpService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly alertController = inject(AlertController);

  protected form!: FormGroup;
  protected isSubmitting = false;

  constructor() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      passwordNew: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      await this.showAlert('Error', 'Debe completar todos los campos correctamente.');
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authHttpService.changePasswordFirst(this.authService.auth.id, this.form.value).subscribe({
      next: async () => {
        this.form.reset();
        this.isSubmitting = false;
        await this.showAlert('Éxito', 'Contraseña actualizada correctamente.');
        this.router.navigateByUrl('/');
      },
      error: async () => {
        this.isSubmitting = false;
        await this.showAlert('Error', 'No se pudo cambiar la contraseña. Intente nuevamente.');
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
