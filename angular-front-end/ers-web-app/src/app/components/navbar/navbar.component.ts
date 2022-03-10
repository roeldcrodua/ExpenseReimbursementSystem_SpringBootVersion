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
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: ""
  };
  _role: any;

  @Input()
  _loggedInUser:  User = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: ""
  }

  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.checkSession().subscribe(user => {
      if (user.success) {
        this._user = {
          userId: user.object.userId,
          username: user.object.username,
          password: user.object.password,
          firstName: user.object.firstName,
          lastName: user.object.lastName,
          email: user.object.email,
          role: user.object.role
        }
      } else {
        this.router.navigate([``]);
      }
    })  
  }

}
