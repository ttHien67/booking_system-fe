import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/module/booking.service';
import { CustomerService } from 'src/app/services/module/customer.service';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements OnInit {

  @Input() item: any;
  @Input() type: any;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  form: any;
  isSubmit = false;

  listProduct = [
    {
      code: 1, 
      name: "a"
    },
    {
      code: 2, 
      name: "a"
    },
    {
      code: 3, 
      name: "a"
    }
  ]

  today = new Date().toISOString().split('T')[0];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastService: ToastrService
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
      code: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      age: [null, [Validators.required, Validators.maxLength(3)]],
      address: [null,  [Validators.required]],
      phone: [null, [Validators.required, Validators.maxLength(11)]],
      email: [null]
    }) 

    if(this.item) {
      this.f.code.disable();
      this.form.patchValue(this.item);
    }
  }

  submit() {
    this.isSubmit = true;
    if(this.form.status === 'INVALID') {
      return;
    }else {
      this.customerService.updateCustomer(this.form.value).subscribe(res => {
        if(res.errorCode === '0') {
          this.toastService.success(res.errorDesc);
          this.passEntry.emit(res);
        }else {
          this.toastService.error(res.errorDesc);
        }
      })
    }
    this.isSubmit = false;
    
  }

  close() {
    this.activeModal.dismiss();
  }

}
