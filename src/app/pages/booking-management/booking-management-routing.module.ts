import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/cors/guards/auth.guard';
import { BookingCustomerComponent } from './booking-customer/booking-customer.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { EmployeeComponent } from './employee/employee.component';
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
  {
    path:"",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"booking-form",
    component: BookingCustomerComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"booking-management",
    component: BookingFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"employee",
    component: EmployeeComponent,
    canActivate: [AuthGuard]
  },
  {
    path:"customer",
    component: CustomerComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingManagementRoutingModule { }
