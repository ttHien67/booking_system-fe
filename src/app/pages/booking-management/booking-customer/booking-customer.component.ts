import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgModel, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/module/auth.service';
import { BookingService } from 'src/app/services/module/booking.service';
import { CustomerService } from 'src/app/services/module/customer.service';
import { EmployeeService } from 'src/app/services/module/employee.service';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { CalendarWorkingService } from 'src/app/services/module/calendar-working.service';

@Component({
  selector: 'app-booking-customer',
  templateUrl: './booking-customer.component.html',
  styleUrls: ['./booking-customer.component.css']
})
export class BookingCustomerComponent implements OnInit {

  form: any;
  isSubmit = false;
  listEmployee: Array<any> = [];
  listEmployeeFilter: Array<any> = [];

  listBooking: Array<any> = [];
  listBookingFilter: Array<any> = [];
  listNameEmployee: Array<any> = [];

  listWorking: Array<any> = [];

  totalSize = 0;
  pageNumber = 1;
  pageSize = 5;

  currentUser: any;

  listProduct = [
    {
      name: "a"
    },
    { 
      name: "b"
    },
    { 
      name: "c"
    }
  ]

  today = new Date().toISOString().split('T')[0];

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private bookingService: BookingService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private modalService: NgbModal,
    private calendarWorkingService: CalendarWorkingService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    this.initForm();
    this.getEmployee();
    this.getBooking();    
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      age: [null, [Validators.required, Validators.maxLength(3)]],
      address: [null,  [Validators.required]],
      phone: [null, [Validators.required, Validators.maxLength(11)]],
      email: [null],
      productType: [null, [Validators.required]],
      date: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      customerId: [null],
      employeeId: [null, [Validators.required]]

    }) 
  }

  getEmployee() {
    this.employeeService.getEmployee({}).subscribe(res =>{
      if(res.errorCode === '0') {
        this.listEmployee = res.data;
        this.listEmployeeFilter = this.listEmployee;
      }
    })
  }

  getBooking() {
    this.listNameEmployee = [];
    const json = {
      customerId: this.currentUser?.userId,
      limit: this.pageSize,
      page: this.pageNumber
    }
    this.bookingService.getBooking(json).subscribe(res => {
      if(res.errorCode === '0') {
        this.listBooking = res.data;
        this.totalSize = res.totalRecord;
      }
    })
  }

  submit() {
    this.isSubmit = true;
    if(this.form.status === 'INVALID') {
      return;
    }else {
      this.create();
    }
    this.isSubmit = false;
  }

  create() {
    const userId = this.currentUser.userId;
    if(userId) {
      this.f.customerId.patchValue(userId);
    }

    this.calendarWorkingService.createCalendar(this.form.value).subscribe(res => {
      if(res.errorCode === '0'){
        console.log("success");
        
      }
    })

    this.bookingService.createBooking(this.form.value).subscribe(res => {
      if(res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this.getBooking();
      }else {
        this.toastService.error(res.errorDesc);
      }
    }, err => {
      console.log(err);
      
    });
    this.initForm();
  }

  changeDate() {
    
  }

  changeProductType(event: any) {
    const json = {
      date: this.f.date?.value,
      productType: this.f.productType?.value
    }

    this.listEmployeeFilter = this.listEmployee.filter(e => (e.role === event?.name));

    this.calendarWorkingService.getCalendar(json).subscribe(res => {
      if(res.errorCode === '0'){
        this.listWorking = res.data; 

        for(let item of this.listWorking) {
          if((this.f.startTime?.value >= item.startTime && this.f.startTime?.value <= item.endTime) || 
            (this.f.endTime?.value >= item.startTime && this.f.endTime?.value <= item.endTime)){
              this.listEmployeeFilter = this.listEmployeeFilter.filter(e => e.id !== item.employeeId);
            }
        }
      }
    })

    this.calendarWorkingService.countService(json).subscribe(res => {
      if(res.errorCode === '0'){
        for(let item of res.data){
          this.listEmployeeFilter = this.listEmployeeFilter.filter(e => e.id != item.employeeId || 
            (e.maxCustomer > item?.counService && e.id === item.employeeId)
          );
        }
      }
    })
    
    // if(this.f.productType.value === null) {
    //   this.listEmployeeFilter = this.listEmployee;
    // }

    // auto choose teller mapping your role
    let randomTeller = Math.floor(Math.random() * this.listEmployeeFilter.length);
    this.f.employeeId.patchValue(this.listEmployeeFilter[randomTeller]?.id);
    
  }


  changePageSize(event: any){
    this.pageSize = event;
    this.getBooking();
  }

  changePage(event: any) {
    this.pageNumber = event;
    this.getBooking();
  }


  openCommentModal(item: any) {
    const modalRef = this.modalService.open(CommentModalComponent, {centered: true, size: 'lg', backdrop: 'static'});
    if(item) {
      modalRef.componentInstance.item = item;
    }
    // modalRef.componentInstance.title = item ? "Edit" : "Create";
    // modalRef.componentInstance.type = type;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();
      this.getBooking();
    })
  }

}
