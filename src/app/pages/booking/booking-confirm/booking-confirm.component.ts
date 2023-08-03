import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/module/booking.service';
import { CalendarWorkingService } from 'src/app/services/module/calendar-working.service';
import { EmployeeService } from 'src/app/services/module/employee.service';
import { NotificationService } from 'src/app/services/module/notification.service';

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
  styleUrls: ['./booking-confirm.component.css']
})
export class BookingConfirmComponent implements OnInit {

  @Input() item: any;
  @Input() listEmployeeFilter: Array<any> = [];
  @Input() listProduct: any;

  listEmployee: Array<any> = [];

  @Output() passEntry: EventEmitter<any> = new EventEmitter;

  isSubmit = false;
  form: any;

  today = new Date().toISOString().split('T')[0];
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private bookingService: BookingService,
    private calendarWorkingService: CalendarWorkingService,
    private toastService: ToastrService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getEmployee();
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      phone: [null, [Validators.required, Validators.maxLength(11)]],
      productType: [null, [Validators.required]],
      date: [null],
      time:[null],
      employeeId: [null, [Validators.required]]
    });
    
    if(this.item) {
      this.form.patchValue(this.item);
    } 
  }

  get f() {
    return this.form.controls;
  }

  getEmployee() {
    this.employeeService.getEmployee({}).subscribe(res =>{
      if(res.errorCode === '0') {
        this.listEmployee = res.data;
      }
    })
  }

  submit() {
    if(this.form.status === 'INVALID'){
      this.toastService.error("Something was wrong");
      return;
    }else {
      this.create();
      this.passEntry.emit(this.form.value);
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
          this.listEmployeeFilter = this.listEmployeeFilter.filter(e => e.id !== item?.employeeId || 
              (e.maxCustomer > item.countService && e.id === item.employeeId));
        }
        
        // auto choose teller mapping your role
        let randomTeller = Math.floor(Math.random() * this.listEmployeeFilter.length);
        this.f.employeeId.patchValue(this.listEmployeeFilter[randomTeller]?.id);
      }
    })
  }

  create() {
    this.loading = true;
    this.calendarWorkingService.createCalendar(this.form.value).subscribe(res => {
      if(res.errorCode !== '0'){
        this.toastService.error("Something was wrong");
      }
    })
    this.bookingService.createBooking(this.form.value).subscribe(res => {
      if(res.errorCode !== '0') {
        this.toastService.error("Something was wrong");
      }
    }, err => {
      console.log(err);  
    });

    // this.notificationService.sendNotification(this.form.value).subscribe(res => {
    //   console.log(res);
    // })
    this.loading = false;
  }

  close() {
    this.activeModal.dismiss();
  }

}
