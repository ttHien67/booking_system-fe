import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { BookingComponent } from './booking/booking.component';
import { CommentModalComponent } from './booking/comment-modal/comment-modal.component';

const routes: Routes = [
  {
    path: 'management', component: LayoutComponent, loadChildren: () => import('./booking-management/booking-management.module').then(m => m.BookingManagementModule)
  },
  {
    path: '', component: BookingComponent
  },
  {
    path: 'comment', component: CommentModalComponent
  }


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
