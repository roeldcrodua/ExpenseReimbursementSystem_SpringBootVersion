import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  _user: User = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: ""
  };

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
          username: user.object.userName,
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
