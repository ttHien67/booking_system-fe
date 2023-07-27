import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgModel, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/module/booking.service';
import { CalendarWorkingService } from 'src/app/services/module/calendar-working.service';
import { EmployeeService } from 'src/app/services/module/employee.service';
import { BookingConfirmComponent } from './booking-confirm/booking-confirm.component';
import { QrcodeGenerationComponent } from './qrcode-generation/qrcode-generation.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  form: any;
  isSubmit = false;
  listEmployee: Array<any> = [];
  listEmployeeFilter: Array<any> = [];

  listWorking: any;

  today = new Date().toISOString().split('T')[0];

  listProduct = [
    {
      id: 'a',
      name: "Create new account bank"
    },
    { 
      id: 'b',
      name: "Restore account bank"
    },
    { 
      id: 'c',
      name: "Money transfer"
    },
    { 
      id: 'd',
      name: "Block account bank"
    }
  ]
  
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private calendarWorkingService: CalendarWorkingService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(\'assets/img/nature.jpg\')';
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
      time: [null],
      employeeId: [null, [Validators.required]]

    }) 
  }

  get f() {
    return this.form.controls;
  }

  getEmployee() {
    this.employeeService.getEmployee({}).subscribe(res =>{
      if(res.errorCode === '0') {
        this.listEmployee = res.data;
        this.listEmployeeFilter = this.listEmployee;
      }
    })
  }

  submit() {
    this.isSubmit = true;
    if(this.form.status === 'INVALID') {
      return;
    }else {
      this.confirmBooking();
    }
    this.isSubmit = false;
  }

  confirmBooking() {
    const modalRef = this.modalService.open(BookingConfirmComponent, {centered: true, size: 'lg', backdrop: 'static'});

    this.f.date.patchValue(this.getDate());
    this.f.time.patchValue(this.getTime());

    modalRef.componentInstance.item = this.form.value;
    modalRef.componentInstance.listEmployeeFilter = this.listEmployeeFilter;
    modalRef.componentInstance.listProduct = this.listProduct;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();

      const modalQrCode = this.modalService.open(QrcodeGenerationComponent, {centered: true, size: 'lg', backdrop: 'static'});
      modalQrCode.componentInstance.data = receivedEntry;
      modalQrCode.componentInstance.passEntry.subscribe((receivedEntry: any) => {
        this.modalService.dismissAll();
        this.initForm();
      })


    })

  }

  getDate() {
    const d = new Date();
    return (d.getFullYear() + '-' +  (d.getMonth() + 1) + '-' + d.getDate());
    
  }

  getTime(){
    const d = new Date();
    return (d.getHours() + ':' +  (d.getMinutes()) + ':' + d.getSeconds());
  }

  changeProductType(event: any) {
    const json = {
      date: this.getDate(),
      productType: this.f.productType?.value
    }
    
    this.listEmployeeFilter = this.listEmployee.filter(e => (e.role === event?.id));

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
