import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  _user: User = {
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: "",
    picUrl: ""
  };
  _role: any;

  _isNewReimbursement = true;
  _isSeachActivated = true;

  @Input()
  _loggedInUser:  User = {
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: "",
    picUrl: ""
  }

  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this._user = JSON.parse(sessionStorage.getItem('userObj')!); 
    if(this._user == null){
      this.router.navigateByUrl('')
    } 
  }




  logout(){
    this.userService.logout()
    console.log("LOGOUT SESSION")
    this.router.navigate([``]);
  }
}
