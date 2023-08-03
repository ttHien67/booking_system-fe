import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from 'src/app/services/module/menu.service';
import { MenuModalComponent } from './menu-modal/menu-modal.component';
import { MenuPermissionComponent } from './menu-permission/menu-permission.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  form: any;

  listParentMenu: any;
  listMenu: any;

  totalSize = 0;
  pageNumber = 1;
  pageSize = 5;


  constructor(
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.initForm();
    this.getMenu();
    this.getParentMenu();
  }

  getMenu() {
    const json = {
      name: this.f.name.value,
      parentId: this.f.parentId.value,
      limit: this.pageSize,
      page: this.pageNumber
    }

    this.menuService.findAllMenu(json).subscribe(res => {
      if (res.errorCode === '0') {
        this.listMenu = res.data;
        this.totalSize = res.totalRecord;

      }
    })
  }

  getParentMenu() {
    this.menuService.getParentMenu({}).subscribe(res => {
      if (res.errorCode === '0') {
        this.listParentMenu = res.data;
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: null,
      name: null,
      path: null,
      parentId: null
    })
  }

  get f() {
    return this.form.controls;
  }

  search() {
    this.getMenu();
  }

  openModal(item: any, type: any) {
    const modalRef = this.modalService.open(MenuModalComponent, { centered: true, size: 'lg' });
    if (item) {
      modalRef.componentInstance.item = item
    }
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.listParentMenu = this.listParentMenu;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();
      this.getMenu();
    })

  }

  openPermissionModal(item: any) {
    const modalRef = this.modalService.open(MenuPermissionComponent, { centered: true, size: 'lg' });
    if (item) {
      modalRef.componentInstance.item = item
    }
    modalRef.componentInstance.listParentMenu = this.listParentMenu;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
      this.modalService.dismissAll();
    })
  }

  refresh() {
    this.initForm();
    this.getMenu();
  }

  deleteMenu(item: any) {

  }

  changePageSize(event: any) {
    this.pageSize = event;
    this.getMenu();
  }

  changePage(event: any) {
    this.pageNumber = event;
    this.getMenu();
  }

}
