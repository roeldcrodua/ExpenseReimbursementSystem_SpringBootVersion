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
  _token: any;
  _user: any;


  constructor(private userService: UserService, private router: Router) { 

  }
  ngOnInit(){
    this._token = sessionStorage.getItem('JWT');

    if (this._token != null){
      this._user = sessionStorage.getItem('userObj');

      if (this.userService.isValidToken(this._user.exp)){
        this.router.navigate([`/dashboard/`]);
      } 
    }
  }



  userLogin(){
    console.log("LOGIN")
    this.checkuserName();
    this.checkPassword();
    this.userService.userLogin(this._userName, this._password).subscribe(data => {
      console.log(data)
      if (data.success){
        this.userService.getDecodedAccessToken(data.message);
        this._user = sessionStorage.getItem('userObj');
        this._userId = this._user.userId;
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
      this.userService.verifyUser(this._userName).subscribe(data => {
        if (data.object.email == this._userName){
          this._isFound = true;
          this._invaliduserNameMessage = "";
          this._email = data.object.email;
        }
      })
    } else if (this._userName != ""){
      this.userService.verifyUser(this._userName).subscribe(data => {
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
  this.userService.forgotPassword(this._email).subscribe(data => {
    if (data.success){
      this.userService.getDecodedAccessToken(data.message);
    }
  })

  }
}
