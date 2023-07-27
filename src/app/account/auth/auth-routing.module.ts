import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { 
    path: 'login', component: LoginComponent
  },
  {
    path: 'registration', component: RegistrationComponent
  }
];

export const AuthRoutingModule = RouterModule.forChild(routes);
