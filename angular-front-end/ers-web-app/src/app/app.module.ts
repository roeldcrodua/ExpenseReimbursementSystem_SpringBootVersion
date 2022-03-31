import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/user/login/login.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReimbursementListComponent } from './components/reimbursement/reimbursement-list/reimbursement-list.component';
import { OrderbyPipe } from './pipe/orderby.pipe';
import { ViewModalComponent } from './components/reimbursement/view-reimbursement/view-reimbursement.component';
import { ConfirmDialogComponent } from './dialog/confirm/confirm.component';
import { UserInfoComponent } from './components/user/user-info/user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UserProfileComponent,
    DashboardComponent,
    NavbarComponent,
    ReimbursementListComponent,
    OrderbyPipe,
    ViewModalComponent,
    ConfirmDialogComponent,
    UserInfoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ReimbursementListComponent, ViewModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
