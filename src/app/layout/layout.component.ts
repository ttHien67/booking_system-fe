import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/module/auth.service';
import { MenuService } from '../services/module/menu.service';

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

  constructor(
    private authService: AuthService,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    this.getFullName();
    this.getMenu();
  }

  logout() {
    this.authService.logout();
  }

  getFullName() {
    this.name = this.currentUser.name;
  }

  getMenu() {
    const roleCode = this.currentUser.roleCode;

    this.menuService.getMenu({roleCode}).subscribe(res => {
      if(res.errorCode === '0'){
        this.listMenu = res.data;
      }
    })  
  }

  ngAfterViewInit() {
    document.body.classList.remove('authentication-bg');
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('enlarged');
    this.isCondensed = !this.isCondensed;
  }

}