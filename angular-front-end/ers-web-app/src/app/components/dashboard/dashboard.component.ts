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
    console.log("DASHBOARD")
    this._user = JSON.parse(sessionStorage.getItem('userObj')!); 
    if(this._user == null){
      this.router.navigateByUrl('')
    } else {
      console.log(this._user);
      this.router.navigate([`/dashboard`]);
    }
  }

}
