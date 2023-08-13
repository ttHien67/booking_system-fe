import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgModel, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/module/booking.service';
import { CalendarWorkingService } from 'src/app/services/module/calendar-working.service';
import { EmployeeService } from 'src/app/services/module/employee.service';
import { BookingConfirmComponent } from './booking-confirm/booking-confirm.component';
import { QrcodeGenerationComponent } from './qrcode-generation/qrcode-generation.component';
import { ProductService } from 'src/app/services/module/product.service';
import { NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { NotificationService } from 'src/app/services/module/notification.service';
import { WebSocketService } from 'src/app/services/module/websocket.service';

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
  listProduct: any;
  loading = false;

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];


  today = new Date().toISOString().split('T')[0];

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private calendarWorkingService: CalendarWorkingService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private toastService: ToastrService,
    private productService: ProductService,
    private qrcode: NgxScannerQrcodeService

  ) {}

  ngOnInit() {
    document.body.style.backgroundImage = 'url(\'assets/img/nature.jpg\')';
    this.initForm();
    this.getEmployee();
    this.getProduct();

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

  getProduct() {
    this.productService.getProduct({}).subscribe(res => {
      if(res.errorCode === '0'){
        this.listProduct = res.data;
      }
    })
  }

  submit() {
    this.loading = true;
    this.isSubmit = true;
    if (this.form.status === 'INVALID') {
      this.loading = false;
      return;
    } else {
      this.confirmBooking();
      this.loading = false;
    }
    this.isSubmit = false;
  }

  confirmBooking() {
    const modalRef = this.modalService.open(BookingConfirmComponent, { centered: true, size: 'lg', backdrop: 'static' });

    this.f.date.patchValue(this.getDate());
    this.f.time.patchValue(this.getTime());

    modalRef.componentInstance.item = this.form.value;
    modalRef.componentInstance.listEmployeeFilter = this.listEmployeeFilter;
    modalRef.componentInstance.listProduct = this.listProduct;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();

      const modalQrCode = this.modalService.open(QrcodeGenerationComponent, { centered: true, size: 'lg', backdrop: 'static' });
      modalQrCode.componentInstance.data = receivedEntry;
      modalQrCode.componentInstance.passEntry.subscribe((receivedEntry: any) => {
        this.modalService.dismissAll();
        this.initForm();
      })
    })

  }

  getDate() {
    const d = new Date();
    return (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());

  }

  getTime() {
    const d = new Date();
    return (d.getHours() + ':' + (d.getMinutes()) + ':' + d.getSeconds());
  }

  changeProductType(event: any) {
    const json = {
      date: this.getDate(),
      productType: this.f.productType?.value
    }

    this.listEmployeeFilter = this.listEmployee.filter(e => (e.role === event?.code));

    this.calendarWorkingService.countService(json).subscribe(res => {
      if (res.errorCode === '0') {
        for (let item of res.data) {
          this.listEmployeeFilter = this.listEmployeeFilter.filter(e => e.id !== item.employeeId ||
            (e.maxCustomer > item.countService && e.id === item.employeeId));
        }

        // auto choose teller mapping your role
        let randomTeller = Math.floor(Math.random() * this.listEmployeeFilter.length);
        this.f.employeeId.patchValue(this.listEmployeeFilter[randomTeller]?.id);

        if(this.listEmployeeFilter.length === 0){
          this.listEmployeeFilter = this.listEmployee.filter(e => (e.role === event?.code));  
        }
      }
    })
  }

  public onSelects(files: any) {
    this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }

  show(event: any) {

    this.bookingService.getBooking(JSON.parse(event[0].value)).subscribe(res => {
      if (res.errorCode === '0') {
        if (res.data[0].status === 2) {
          const modalRef = this.modalService.open(CommentModalComponent, { centered: true, size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.item = res.data[0];
          modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
            this.modalService.dismissAll();
          })
        } else {
          this.toastService.error("Your transaction's status hasn't been done");
        }
      }
    })
  }

}
