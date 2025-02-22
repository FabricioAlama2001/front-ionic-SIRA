import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthHttpService, AuthService} from "../services/auth";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {NativeBiometric} from 'capacitor-native-biometric';
import {arrayUnion} from "@angular/fire/firestore";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authHttpService = inject(AuthHttpService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected isAlertOpen: boolean = false;

  protected form!: FormGroup;

  constructor() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  login() {
    this.authHttpService.login(this.form.value).subscribe(response => {
      this.form.reset();

      if(!response.passwordChanged){
        this.router.navigateByUrl('/password-change');
        return;
      }

      this.router.navigateByUrl('/tabs/tab1');
    }, error => {
      this.isAlertOpen = true;
    });
  }

  verifyIdentity() {
    NativeBiometric.isAvailable().then((isAvailable) => {
      if (isAvailable) {
        NativeBiometric.verifyIdentity({
          reason: 'For easy log in',
          title: 'Log in',
          subtitle: 'Authenticate',
          description: 'Please authenticate to proceed',
          maxAttempts: 5,
          useFallback: true,
        }).then((result) => {
          this.authHttpService.login({
            username: this.authService.username,
            password: this.authService.password
          }).subscribe(response => {
            this.router.navigateByUrl('/tabs/tab1');
          });
        }).catch((error) => {
          console.error('Error verifying identity:', error);
        });
      } else {
        alert('Biometric authentication is not available on this device.');
      }
    }).catch((e) => {
      console.error(e);
      alert('Authentication failed');
    });
  }

  goToPasswordReset() {
    this.router.navigate(['/password-reset']);
  }

  protected readonly environment = environment;
}
