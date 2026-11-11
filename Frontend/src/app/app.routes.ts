import { Routes } from '@angular/router';
import { Login } from './login/login';
import { authGuard } from './guards/auth-guard';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    // canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    // canActivate: [authGuard]
  }
];
