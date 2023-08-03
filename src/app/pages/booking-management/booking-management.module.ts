import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';;

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingFormModalComponent } from './booking-form/booking-form-modal/booking-form-modal.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeModalComponent } from './employee/employee-modal/employee-modal.component';
import { CustomerModalComponent } from './customer/customer-modal/customer-modal.component';
import { CustomerComponent } from './customer/customer.component';
import { BookingCustomerComponent } from './booking-customer/booking-customer.component';
import { CommentModalComponent } from './booking-customer/comment-modal/comment-modal.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BookingManagementRoutingModule } from './booking-management-routing.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { MenuComponent } from './menu/menu.component';
import { MenuModalComponent } from './menu/menu-modal/menu-modal.component';
import { MenuPermissionComponent } from './menu/menu-permission/menu-permission.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BookingManagementRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgxScannerQrcodeModule


  ],
  declarations: [
    BookingFormComponent,
    BookingFormModalComponent,
    EmployeeComponent,
    EmployeeModalComponent,
    CustomerModalComponent,
    CustomerComponent,
    BookingCustomerComponent,
    CommentModalComponent,
    DashboardComponent,
    MenuComponent,
    MenuModalComponent,
    MenuPermissionComponent
  ]
})
export class BookingManagementModule { }
