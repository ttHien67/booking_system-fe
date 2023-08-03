import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/cors/guards/auth.guard';
import { BookingCustomerComponent } from './booking-customer/booking-customer.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { EmployeeComponent } from './employee/employee.component';
import { CustomerComponent } from './customer/customer.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
    path:"",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"service/booking",
    component: BookingFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"personnel/employee",
    component: EmployeeComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"menu",
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingManagementRoutingModule { }
