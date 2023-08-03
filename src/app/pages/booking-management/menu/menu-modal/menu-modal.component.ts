import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/module/auth.service';
import { MenuService } from 'src/app/services/module/menu.service';
import { PermissionService } from 'src/app/services/module/permission.service';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.css']
})
export class MenuModalComponent implements OnInit {

  @Input() item: any;
  @Input() type: any;
  @Input() listParentMenu: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  form: any;
  isSubmit = false;
  currentUser: any;

  listRole = [
    {
      id: "ADMIN",
      name: "Adminstration"
    },
    {
      id: "EMPLOYEE",
      name: "Employee"
    }
  ]

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private menuService: MenuService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.currentUser = this.authService.currentUser();
  }


  initForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      path: [null, [Validators.required]],
      parentId: [null, [Validators.required]],
      roleCode: [null],
    })

    if (this.item) {
      this.form.patchValue(this.item);
    }
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.isSubmit = true;
    if (this.form.status === 'INVALID') {
      return;
    } else {
      if (this.item) {
        this.update();
      } else {
        this.create();
      }
    }
    this.isSubmit = false;
  }

  create() {
    const json = {
      creator: this.currentUser.userId,
      ...this.form.value
    }

    this.menuService.createMenu(json).subscribe(res => {
      if (res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this.passEntry.emit(res);

      } else {
        this.toastService.error(res.errorDesc);
      }
    })
  }


  update() {
    this.menuService.updateMenu(this.form.value).subscribe(res => {
      if (res.errorCode === '0') {
        this.toastService.success(res.errorDesc);
        this.passEntry.emit(res);
      } else {
        this.toastService.error(res.errorDesc);
      }
    })
  }

  close() {
    this.activeModal.dismiss();
  }

}
