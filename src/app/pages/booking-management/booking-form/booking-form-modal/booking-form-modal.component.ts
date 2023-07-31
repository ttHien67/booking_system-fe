import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/module/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from 'src/app/services/module/booking.service';
import { EmployeeService } from 'src/app/services/module/employee.service';
import { CalendarWorkingService } from 'src/app/services/module/calendar-working.service';

@Component({
  selector: 'app-booking-form-modal',
  templateUrl: './booking-form-modal.component.html',
  styleUrls: ['./booking-form-modal.component.scss']
})
export class BookingFormModalComponent implements OnInit {

  @Input() item: any;
  @Input() type: any;
  @Input() listEmployee: Array<any> = [];
  @Input() listProduct: Array<any> = [];

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  form: any;
  isSubmit = false;

  listEmployeeFilter: Array<any> = [];

  listBooking: Array<any> = [];
  listBookingFilter: Array<any> = [];
  listWorking: Array<any> = [];

  listStatus = [
    {
      id: 0,
      name: "No-start"
    },
    {
      id: 1,
      name: "In progress"
    },
    {
      id: 2,
      name: "Done"
    }
  ]

  today = new Date().toISOString().split('T')[0];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private bookingService: BookingService,
    private employeeService: EmployeeService,
    private calendarWorkingService: CalendarWorkingService
  ) { }

  ngOnInit() {
    this.initForm();  
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      phone: [null, [Validators.required, Validators.maxLength(11)]],
      productType: [null, [Validators.required]],
      date: [null, [Validators.required]],
      status: [null, [Validators.required]],
      employeeId: [null, [Validators.required]]

    }) 

    if(this.item) {
      this.form.patchValue(this.item);
      this.listEmployeeFilter = this.listEmployee;
    }
  }

  getBooking() {
    const json = {
      date: this.f.date.value,
      productType: this.f.productType.value,
      employeeId: this.f.employeeId.value
    }
    this.bookingService.getBooking(json).subscribe(res => {
      if(res.errorCode === '0') {
        this.listBooking = res.data;
      }
    })
  }

  submit() {
    this.isSubmit = true;
    if(this.form.status === 'INVALID') {
      return;
    }else {
      if(this.type === 'edit') {
        this.update();
      }else {
        this.create();
      }
    }
    this.isSubmit = false;
  }

  update(){
    this.bookingService.updateBooking(this.form.value).subscribe(res => {
      if(res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this.passEntry.emit(res);
      }else {
        this.toastService.error(res.errorDesc);
      }
    });
  }

  create() {
    if(this.f.id.value) {
      this.f.customerId.patchValue(this.f.id.value);
      this.f.id.patchValue(null);
    }
    this.bookingService.createBooking(this.form.value).subscribe(res => {
      if(res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this.passEntry.emit(res);
      }else {
        this.toastService.error(res.errorDesc);
      }
    });
  }

  search() {
    if(this.f.date?.value === null || this.f.productType?.value === null || this.f.employeeId?.value == null){
      this.getBooking();
    }else {
      return;
    }
  }

  getDate() {
    const d = new Date();
    return (d.getFullYear() + '-' +  (d.getMonth() + 1) + '-' + d.getDate());
    
  }

  changeProductType(event: any) {
    const json = {
      date: this.getDate(),
      productType: this.f.productType?.value
    }
    
    this.listEmployeeFilter = this.listEmployee.filter(e => (e.role === event?.code));

    this.calendarWorkingService.countService(json).subscribe(res => {
      if(res.errorCode === '0'){
        for(let item of res.data){
          this.listEmployeeFilter = this.listEmployeeFilter.filter(e => e.id !== item.employeeId || 
              (e.maxCustomer > item.countService && e.id === item.employeeId));
        }

        // auto choose teller mapping your role
        let randomTeller = Math.floor(Math.random() * this.listEmployeeFilter.length);
        this.f.employeeId.patchValue(this.listEmployeeFilter[randomTeller]?.id);
      }
    })

    
    
  }
}
