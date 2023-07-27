import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RegistrationComponent } from "./registration/registration.component";

@NgModule({
    declarations: [
        LoginComponent, 
        RegistrationComponent
    ],
    imports: [
      CommonModule,
      AuthRoutingModule,
      ReactiveFormsModule,
    ]
})
export class AuthModule { }