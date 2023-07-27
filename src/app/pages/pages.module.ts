import { NgModule } from '@angular/core';


import { PagesRoutingModule } from './pages-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';;

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BookingComponent } from './booking/booking.component';
import { BookingConfirmComponent } from './booking/booking-confirm/booking-confirm.component';
import { QrcodeGenerationComponent } from './booking/qrcode-generation/qrcode-generation.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    RouterModule, 
    PagesRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    QRCodeModule
  ],
  declarations: [
    BookingComponent,
    BookingConfirmComponent,
    QrcodeGenerationComponent
  ]
})
export class PagesModule { }
