import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/module/customer.service';
import Swal from 'sweetalert2';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { BookingFormModalComponent } from '../booking-form/booking-form-modal/booking-form-modal.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  form: any;
  listCustomer: any;
  pageSize = 5;
  pageNumber = 1;
  totalSize: any;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private modalService: NgbModal,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getCustomerList();
  }

  initForm () {
    this.form = this.formBuilder.group({
      code: [null],
      name: [null],
      age: [null],
      phone: [null],
      address: [null]
    })
  }

  get f () {
    return this.form.controls;
  }

  getCustomerList() {
    const json = {
      code: this.f.code.value,
      name: this.f.name.value,
      age: this.f.age.value,
      phone: this.f.phone.value,
      address: this.f.address.value,
      limit: this.pageSize,
      page: this.pageNumber
    }
    this.customerService.getCustomer(json).subscribe(res => {
      if(res.errorCode === '0') {
        this.listCustomer = res.data;
        this.totalSize = res.totalRecord;
      }
    })
  }

  openCustomerModal(item: any, type: any) {
    const modalRef = this.modalService.open(CustomerModalComponent, {centered: true, size: 'lg'});
    if(item) {
      modalRef.componentInstance.item = item;
    }
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();
      this.getCustomerList();
    })
  }

  openModal(item: any, type: any) {
    const modalRef = this.modalService.open(BookingFormModalComponent, {centered: true, size: 'lg'});
    if(item) {
      modalRef.componentInstance.item = item;
    }
    modalRef.componentInstance.title = item ? "Edit" : "Create";
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();
    })
  }

  search() {
    this.getCustomerList();
  }

  refresh() {
    this.pageNumber = 1;
    this.pageSize = 5;
    this.initForm();
    this.getCustomerList();
  }

  changePageSize(event: any) {
    this.pageSize = event;
    this.getCustomerList();
  }

  changePage(event: any) {
    this.pageNumber = event;
    this.getCustomerList();
  }


  deleteCustomer(item: any) {
    if (item) {
      Swal.fire({
        title: 'Warning!',
        text: 'Data is not restore after deleting',
        icon: 'error',
        confirmButtonText: 'OK',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Cancel',
      }).then((res) => {
        if (res.value) {
          const json = {
            // userId: this.authService.currentUser().userId,
            id: item.id,
          }
          this.customerService.deleteCustomer(json).subscribe(res => {
            if (res.errorCode === '0') {
              this.toastService.success(res.errorDesc);
              this.getCustomerList();
            } else {
              this.toastService.error(res.errorDesc);
            }
          }, err => {
            this.toastService.error(err, 'Thông báo');
          });
        }
      })
      return;
    }

    this.refresh();
  }

}
