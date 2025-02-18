import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly menuCtrl = inject(MenuController);

  logOut() {
    this.menuCtrl.close();
    this.router.navigate(['/login']);
  }
}
