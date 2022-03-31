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
    this.userService.checkSession().subscribe(user => {
      if (user.success) {
        this._user = {
          userId: user.object.userId,
          userName: user.object.userName,
          password: user.object.password,
          firstName: user.object.firstName,
          lastName: user.object.lastName,
          email: user.object.email,
          role: user.object.role,
          picUrl: user.object.picUrl
        }
      } else {
        this.router.navigate([``]);
      }
    })  
  }




  logout(){
    this.userService.logout().subscribe( data => {
      if (data.success){
        console.log("LOGOUT SESSION")
        this.router.navigate([``]);
      }
    })
  }
}
