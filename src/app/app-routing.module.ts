import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login-responder',
    loadChildren: () => import('./login-responder/login-responder.module').then( m => m.LoginResponderPageModule)
  },
  {
    path: 'register-responder',
    loadChildren: () => import('./register-responder/register-responder.module').then( m => m.RegisterResponderPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'login-citizen',
    loadChildren: () => import('./login-citizen/login-citizen.module').then( m => m.LoginCitizenPageModule)
  },
  {
    path: 'register-citizen',
    loadChildren: () => import('./register-citizen/register-citizen.module').then( m => m.RegisterCitizenPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
