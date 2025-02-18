import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {PasswordChangeComponent} from "./login/password-change/password-change.component";
import {PasswordResetComponent} from "./login/password-reset/password-reset.component";
import {SidebarComponent} from "./layout/sidebar/sidebar.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path:'login',
    component:LoginComponent
  },
  { path: 'password-change',
    component: PasswordChangeComponent },

  { path: 'password-reset',
    component: PasswordResetComponent },
  { path: 'sidebar',
    component:  SidebarComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
