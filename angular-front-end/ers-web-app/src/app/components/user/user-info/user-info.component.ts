import { isFormattedError } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  @Input()
  _specifiedUser:  User = {
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: "",
    picUrl: ""
  }

  _userAccount:  User = {
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: "",
    picUrl: ""
  }

  _type: any;
  _isUser: boolean = true;
  _userId: number = 0;
  _invaliduserNameMessage: string = "Choose something unique";
  _invalidPasswordMessage: string = "";
  _invalidConfirmPasswordMessage: string = "";
  _isFound: boolean = false;
  _isManager: boolean = false;
  _invalidConformPasswordMessage: any;
  _confirmPassword: any;
  _isMatched: boolean = true;
  _isSearchActivated: boolean = false;
  _found = "";
  _isRegisteringUser: boolean = false;
  _isRemovingUser: boolean = false;
  _isUpdatingUser: boolean = false;
  _isResetPassword: boolean = false;
  
  constructor(private userService: UserService, 
              private router: Router,
              private modalService: NgbModal ){ }

  ngOnInit(): void {
    this.userService.checkSession().subscribe(user => {
      if (user.success) {
        this._specifiedUser = {
          userId: user.object.userId,
          userName: user.object.userName,
          password: user.object.password,
          firstName: user.object.firstName,
          lastName: user.object.lastName,
          email: user.object.email,
          role: user.object.role,
          picUrl: user.object.picUrl
        }
        if (this._specifiedUser.role == "MANAGER"){
          this._isManager = true;
        }
       } 
    }) 
  }

  // Triggger at nav level button
  searchUser(user:any){
    this._isResetPassword = false;
    this._isSearchActivated = true;
    this._isRemovingUser = false;
    this._isUpdatingUser = false;
    this._isRegisteringUser = false;
    this._userAccount.userName = "";
    this._userAccount.email = "";  
    this._found = "";  
    this._isFound= false;
    this.modalService.open(user);
  }
  
  searchAUser(){
    // SEARCH Purpose
    console.log("SEARCH_ACTIVATED")
    if (this._isSearchActivated){
      if (this._userAccount.userName != ""){
        this.userService.getUserByuserName(this._userAccount.userName).subscribe(data => {
          if (data.success){
            if (data.object.userName == this._userAccount.userName){
              this._userAccount.email = data.object.email;
              this._found = "USER: [" + data.object.firstName + " " + data.object.lastName + "] was found in the system!";
              this._isFound = true;
            } else {
              this._isFound = false;
            }
          } else {
            this._isFound = false;
            this._found = "userName was NOT found in the system!";
          }

        })      
      } else {
        if (this._userAccount.email != ""){
          this.userService.getUserByEmail(this._userAccount.email).subscribe(data => {
            if (data.success){
              if (data.object.email == this._userAccount.email){
                this._userAccount.userName = data.object.userName;
                this._found = "USER: [" + data.object.firstName + " " + data.object.lastName + "] was found in the system!";
              }
              this._isFound = true;
            } else {
              this._isFound = false;
              this._found = "Email was NOT found in the system!";
            }
          })      
        } else {
          this._isFound = false;
          this._found = "At least one entry needed for search!";
        }
      }
    }
  }
  registerUser(user: any){
    this._isResetPassword = false;
    this._isRemovingUser = false;
    this._isUpdatingUser = false;
    this._isRegisteringUser = true;
    this._isSearchActivated = false;
    console.log("REGISTER: " + this._userAccount)
    this._userAccount = {
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      userId: 0,
      role: "",
      picUrl: ""
    }
    console.log("ROLE:" + this._userAccount.role)
    this._userAccount.role = this._type;

    console.log(this._userAccount)
    this.modalService.open(user);
  }

  editProfile(user: any){
    console.log("FOUND: " + this._isFound)
    if (this._isSearchActivated){
      if (this._userAccount.userName == "" || this._userAccount.email == ""){
        this._isFound = false;
        this._found = "User is UNKNOWN / NOT FOUND!";
      }
      if (this._isFound){
        this._isResetPassword = false;
        this._isRemovingUser = false;
        this._isUpdatingUser = true;
        this._isRegisteringUser = false;
        this._isSearchActivated = false;
        console.log("SEARCH_ACTIVATED")
        console.log(this._userAccount)
        if (this._userAccount.userName != ""){
          this.userService.getUserByuserName(this._userAccount.userName).subscribe( user => {
            if (user.success){
              this._specifiedUser = {
                userId: user.object.userId,
                userName: user.object.userName,
                password: user.object.password,
                firstName: user.object.firstName,
                lastName: user.object.lastName,
                email: user.object.email,
                role: user.object.role,
                picUrl: user.object.picUrl              
              }
              // Changing now the values from the input field
              this._userAccount = this._specifiedUser;
              console.log("BEFORE:");
              console.log(this._specifiedUser)
              this._specifiedUser.firstName = this._userAccount.firstName ;
              this._specifiedUser.lastName = this._userAccount.lastName ;
              this._specifiedUser.role = this._userAccount.role ;
              this._specifiedUser.picUrl = this._userAccount.picUrl ;
              console.log("AFTER:");
              console.log(this._specifiedUser)            
            } 
            console.log("getUserByuserName:");
          })
        } else {
          if (this._userAccount.email != ""){
            this.userService.getUserByEmail(this._userAccount.email).subscribe( user => {
              if (user.success){
                this._specifiedUser = {
                  userId: user.object.userId,
                  userName: user.object.userName,
                  password: user.object.password,
                  firstName: user.object.firstName,
                  lastName: user.object.lastName,
                  email: user.object.email,
                  role: user.object.role,
                  picUrl: user.object.picUrl              
                }
                // Changing now the values from the input field
                this._userAccount = this._specifiedUser;
                console.log("BEFORE:");
                console.log(this._specifiedUser)
                this._specifiedUser.firstName = this._userAccount.firstName ;
                this._specifiedUser.lastName = this._userAccount.lastName ;
                this._specifiedUser.role = this._userAccount.role ;
                this._specifiedUser.picUrl = this._userAccount.picUrl ;
                console.log("AFTER:");
                console.log(this._specifiedUser)
              } 
              console.log("getUserByEmail:");
            })
          }
        }
        console.log("AFTER GET:");
        console.log(this._specifiedUser)
      } else {
        this._found = "User is UNKNOWN / NOT FOUND!";
      }
    } else {
      console.log("SEARCH_DEACTIVATED")
      this._isResetPassword = false;
      this._isRemovingUser = false;
      this._isUpdatingUser = true;
      this._isRegisteringUser = false;
      this._isSearchActivated = false;
      this.userService.checkSession().subscribe(user => {
        if (user.success) {
          this._specifiedUser = {
            userId: user.object.userId,
            userName: user.object.userName,
            password: user.object.password,
            firstName: user.object.firstName,
            lastName: user.object.lastName,
            email: user.object.email,
            role: user.object.role,
            picUrl: user.object.picUrl
          }  
          console.log("CHECK-SESSION")
          // Changing now the values from the input field
          this._userAccount = this._specifiedUser;
          console.log("BEFORE:");
          console.log(this._specifiedUser)
          this._specifiedUser.firstName = this._userAccount.firstName ;
          this._specifiedUser.lastName = this._userAccount.lastName ;
          this._specifiedUser.role = this._userAccount.role ;
          this._specifiedUser.picUrl = this._userAccount.picUrl ;
          console.log("AFTER:");
          console.log(this._specifiedUser)
        } 
      }) 
    }    
    this.modalService.open(user);
  }

  checkuserName(){
    console.log(this._isRegisteringUser)
    if (this._isRegisteringUser){
      this._invaliduserNameMessage = "";
      if (this._userAccount.userName.match("\@")){
        this._invaliduserNameMessage = "Invalid entry. Cannot be an email";
      }else if (this._userAccount.userName != ""){
        this.userService.getUserByuserName(this._userAccount.userName).subscribe(data => {
          console.log(data.object.userName)
          if (data.object.userName == this._userAccount.userName){
            this._isFound = true;
            this._invaliduserNameMessage = "Already exist in the system";
          }
        })
      }else if (this._userAccount.userName == ""){
        this._invaliduserNameMessage = "userName cannot be empty";
      }
    }
  }

  checkPassword(){
      this._invalidPasswordMessage = "";
      if (this._userAccount.password == ""){
        this._invalidPasswordMessage = "Password cannot be empty";
      }
  }

  checkConfirmPassword(){
    this._invalidPasswordMessage = "";
    if (this._userAccount.password == ""){
      this._invalidPasswordMessage = "Password cannot be empty";
    }else if (this._confirmPassword != this._userAccount.password){
      this._isMatched = false;
      this._invalidConfirmPasswordMessage = "Password not matched!";
    }else if (this._confirmPassword == this._userAccount.password){
      this._isMatched = true;
      this._invalidConfirmPasswordMessage = "Password matched!";
    }
  }

  removeuserName(){
    if (this._isRegisteringUser){
      this._invaliduserNameMessage = "";
      this._userAccount.userName = "";
      }
  }

  removePassword(){
    this._invalidPasswordMessage = "";
    this._userAccount.password = "";
  }

  removeConfirmPassword(){
    this._invalidConformPasswordMessage = "";
    this._confirmPassword = "";
  }

  changePassword(user:any){
    this._isResetPassword = true;
    this._isRemovingUser = false;
    this._isUpdatingUser = false;
    this._isRegisteringUser = false;
    this._isSearchActivated = false;
    this.userService.checkSession().subscribe(user => {
      if (user.success) {
        this._specifiedUser = {
          userId: user.object.userId,
          userName: user.object.userName,
          password: user.object.password,
          firstName: user.object.firstName,
          lastName: user.object.lastName,
          email: user.object.email,
          role: user.object.role,
          picUrl: user.object.picUrl
        }  
        console.log("CHECK-SESSION")
        // Changing now the values from the input field
        this._userAccount = this._specifiedUser;
        console.log("BEFORE:");
        console.log(this._specifiedUser)
        this._specifiedUser.password = this._userAccount.password ;
        console.log("AFTER:");
        console.log(this._specifiedUser)
      } 
    })  
  this.modalService.open(user);
  }
}
