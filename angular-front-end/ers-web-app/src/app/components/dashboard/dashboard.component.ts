import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  _user: any;
  _specifiedUser: any;

  constructor(private userService: UserService, private router:Router) { }

  ngOnInit(): void {
    this.userService.checkSession().subscribe(data => {
      if (data.success){
        this.router.navigate([`/dashboard`]);
        this._user = data.object;
        console.log(data.object)
      } else {
        this.router.navigate([`/login/`]);
      }
    })
  }

}
