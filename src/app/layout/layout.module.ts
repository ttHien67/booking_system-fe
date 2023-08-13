import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";

@NgModule({
    declarations: [
        LayoutComponent,
        SidebarComponent,
        NavbarComponent,
        FooterComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
    ],
    exports:[
    ]
  })
  export class LayoutsModule { }