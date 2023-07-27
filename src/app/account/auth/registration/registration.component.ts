import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/module/user.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form: any;
  isSubmit = false;

  constructor(
    private formBuider: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    document.body.style.backgroundImage = 'url(\'assets/img/city.jpg\')';
    this.initForm();
  }

  initForm() {
    this.form = this.formBuider.group({
      fullName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      address: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8)]]
    })
  }

  checkConfirmPassword() {
    return this.f?.password?.value === this.f?.confirmPassword?.value;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.isSubmit = true;

    if(this.form.status === "VALID"){
      this.createUser();
    }
  }

  createUser() {
    const json = this.form?.value;
    this.userService.createUser(json).subscribe(res => {
      if(res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this,this.initForm();
      }else {
        this.toastService.error(res.errorDesc);
      }
    });

    this.isSubmit = false;
  }

}
