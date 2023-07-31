import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/module/employee.service';
import { UserService } from 'src/app/services/module/user.service';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.css']
})
export class EmployeeModalComponent implements OnInit {

  @Input() item: any;
  @Input() type: any;
  @Input() listProduct: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  form: any;
  isSubmit = false;

  listQuantity = [
    {
      code: 5  
    },
    {
      code: 10  
    },
    {
      code: 15 
    },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private toastService: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initForm();
  }


  initForm() {
    this.form = this.formBuilder.group({
      id: [null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      age: [null, [Validators.required, Validators.maxLength(3)]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.maxLength(11)]],
      email: [null, [Validators.required, Validators.maxLength(255)]],
      role: [null, [Validators.required]],
      maxCustomer: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      roleCode: [null]
    }) 

    if(this.item) {
      this.f.code.disable();
      this.form.patchValue(this.item);
    }
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.isSubmit = true;
    if(this.form.status === 'INVALID') {
      return;
    }else {
      if(this.item) {
        this.update();
      }else{
        this.create();
      }
    }
    this.isSubmit = false;
  }

  create() {
    this.f.roleCode.patchValue("EMPLOYEE");
    
    this.employeeService.createEmployee(this.form.value).subscribe(res => {
      if(res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this.passEntry.emit(res);
        
      }else {
        this.toastService.error(res.errorDesc);
      }
    })
  }


  update() {
    this.employeeService.updateEmployee(this.form.value).subscribe(res => {
      if(res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this.passEntry.emit(res);
      }else {
        this.toastService.error(res.errorDesc);
      }
    })
  }

  close() {
    this.activeModal.dismiss();
  }


}
