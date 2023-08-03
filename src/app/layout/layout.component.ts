import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/module/auth.service';
import { MenuService } from '../services/module/menu.service';
import { PermissionService } from '../services/module/permission.service';
import { NotificationService } from '../services/module/notification.service';

@Component({
  selector: 'app-layouts',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isCondensed = false;
  currentUser: any;
  name: any;
  listMenu: any;
  listPermission: any;
  listParentMenu: any;

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private permissionService: PermissionService,
    private notificatiionService: NotificationService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    this.getFullName();
    this.getMenu();
    // this.getParentMenu();
  }

  logout() {
    this.authService.logout();
  }

  getFullName() {
    this.name = this.currentUser.name;
  }

  getMenu() {
    const roleCode = this.currentUser.roleCode;

    this.permissionService.getPermission({ roleCode: [roleCode] }).subscribe(res => {
      if (res.errorCode === '0') {
        this.listPermission = res.data;
        this.menuService.getMenuForCategory(this.listPermission).subscribe(res => {
          if (res.errorCode === '0') {
            this.listMenu = res.data;

          }
        })
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

  getMenuChild(id: any) {
    const json = {
      parentId: id,
      // roleCode: this.currentUser.roleCode
    }
    this.menuService.findAllMenu({ parentId: id }).subscribe(res => {
      if (res.errorCode === '0') {
        this.listMenu = res.data;
      }
    })
  }

}