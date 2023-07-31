import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/module/employee.service';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import Swal from 'sweetalert2';
import { ProductService } from 'src/app/services/module/product.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  form: any;
  listEmployee: Array<any> = [];
  listProduct: any;
  totalSize: any;
  pageNumber = 1;
  pageSize = 5;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private toastService: ToastrService,
    private modalService: NgbModal,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getEmployeeList();
    this.getProduct();
  }

  initForm() {
    this.form = this.formBuilder.group({
      code: [null],
      name: [null],
      role: [null],
    })
  }

  get f() {
    return this.form.controls;
  }

  getEmployeeList() {
    const json = {
      code: this.f.code.value,
      name: this.f.name.value,
      role: this.f.role.value,

      limit: this.pageSize,
      page: this.pageNumber
    }

    this.employeeService.getEmployee(json).subscribe(res => {
      if(res.errorCode === '0' ) {
        this.listEmployee = res.data;
        this.totalSize = res.totalRecord;
      }else { 
        this.toastService.error(res.errorDesc);
      }
    })
  }

  getProduct() {
    this.productService.getProduct({}).subscribe(res => {
      if(res.errorCode === '0'){
        this.listProduct = res.data;
      }
    })
  }

  search() {
    this.getEmployeeList();
  }

  refresh() {
    this.initForm();
    this.getEmployeeList();
  }

  openModal(item: any, type: any) {
    const modalRef = this.modalService.open(EmployeeModalComponent, {centered: true, size: 'lg'});
    if(item) {
      modalRef.componentInstance.item = item;
    }
    modalRef.componentInstance.title = item ? "Edit" : "Create";
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.listProduct = this.listProduct
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();
      this.getEmployeeList();
    })
  }

  

  deleteEmployee(item: any) {
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
          this.employeeService.deleteEmployee(json).subscribe(res => {
            if (res.errorCode === '0') {
              this.toastService.success(res.errorDesc);
              this.getEmployeeList();
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
  }

  changePageSize(event: any) {
    this.pageSize = event;
    this.getEmployeeList();
  }

  changePage(event: any) {
    this.pageNumber = event;
    this.getEmployeeList();
  }

}
