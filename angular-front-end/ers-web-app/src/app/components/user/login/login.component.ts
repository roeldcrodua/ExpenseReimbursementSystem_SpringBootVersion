import { isFormattedError } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  _userName: string = "";
  _password: string = "";
  _email: string = "";
  _userId: number = 0;
  _invaliduserNameMessage: string = "";
  _invalidPasswordMessage: string = "";
  _isFound: boolean = false;
  _isForgotPassword: boolean = false;

  constructor(private userService: UserService, private router:Router) { }

  ngOnInit(): void {    
    this.userService.checkSession().subscribe(data => {
      console.log(data)
      if (data.success){
        this.router.navigate([`/dashboard`]);
      } else {
        this.router.navigate([`/login/`]);
      }
    })
  }

  userLogin(){
    this.checkuserName();
    this.checkPassword();
    this.userService.userLogin(this._userName, this._password).subscribe(data => {
      console.log(data)
      if (data.success){
        this._userId = data.object.userId;
        this.router.navigate([`/dashboard/`]);
      } else {
        this._invalidPasswordMessage = "Invalid password";
      }
    })
  }

  removeuserName(){
    this._invaliduserNameMessage = "";
    this._userName = "";
  }

  removePassword(){
    this._invalidPasswordMessage = "";
    this._password = "";
  }

  checkPassword(){
    if (this._password == ""){
      this._invalidPasswordMessage = "Password is empty";
    }
  }

  checkuserName(){
    this._isFound = false;
    this._invaliduserNameMessage = "";
    if (this._userName.match("\@")){
      this.userService.getUserByEmail(this._userName).subscribe(data => {
        if (data.object.email == this._userName){
          this._isFound = true;
          this._invaliduserNameMessage = "";
          this._email = data.object.email;
        }
      })
    } else if (this._userName != ""){
      this.userService.getUserByuserName(this._userName).subscribe(data => {
        if (data.object.userName == this._userName){
          this._isFound = true;
          this._invaliduserNameMessage = "";
          this._email = data.object.email;
        }

      })
    }

    if (this._userName == ""){
      this._invaliduserNameMessage = "Username is EMPTY!";
    } else if (!this._isFound) {
      this._invaliduserNameMessage = "Username not found!";
    }
  }

  forgotPassword(){
    this._isFound=false;
    this._isForgotPassword = true;
  }

  backToLogin(){
    this._isForgotPassword = false;
  }

  resetPassword(){
  this.checkuserName();
  console.log(this._email);
  if (this._email.match("\@")){
    this.userService.forgotPassword(this._email).subscribe(data => {
      if (data.success){
        alert(data.message);
      }
    })
  }

  }
}
