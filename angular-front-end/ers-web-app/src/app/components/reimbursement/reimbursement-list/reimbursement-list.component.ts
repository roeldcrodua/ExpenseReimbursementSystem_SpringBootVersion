import { Component, Input, OnInit } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { Reimbursement } from 'src/app/model/reimbursement';
import { User } from 'src/app/model/user';
import { ReimbursementService } from 'src/app/services/reimbursement.service';
import { UserService } from 'src/app/services/user.service';
import { OrderbyPipe } from 'src/app/pipe/orderby.pipe'

@Component({
  selector: 'app-reimbursement-list',
  templateUrl: './reimbursement-list.component.html',
  styleUrls: ['./reimbursement-list.component.css'],
  
})
export class ReimbursementListComponent implements OnInit {
  // USER
  _user: User = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: ""
  };
  // REIMBURSEMENT
  _reimbursements: Reimbursement[] = [];
  _reimbursement: Reimbursement = {
    reimbId: 0,
    amount: 0,
    dateSubmitted: "",
    dateResolved: "",
    description: "",
    receipt: "",
    author: 0,
    resolver: 0,
    status: "",
    type: ""
  }

  @Input()
  _specifiedUser:  User = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: ""
  }

  constructor(private userService: UserService, private reimbursementService: ReimbursementService, private router: Router) { }

  ngOnInit(): void {
    this.userService.checkSession().subscribe(user => {
      if (user.success) {
        console.log("SUCCESS")
        if (user.object.role == "EMPLOYEE"){
          this._user = {
            userId: user.object.userId,
            username: user.object.username,
            password: user.object.password,
            firstName: user.object.firstName,
            lastName: user.object.lastName,
            email: user.object.email,
            role: user.object.role
          }
          console.log(this._user)
        } else { // FOR MANAGER
          this._user = {
            userId: this._specifiedUser.userId,
            username: this._specifiedUser.username,
            password: this._specifiedUser.password,
            firstName: this._specifiedUser.firstName,
            lastName: this._specifiedUser.lastName,
            email: this._specifiedUser.email,
            role: this._specifiedUser.role
          }
        }

        // Get the reimbursements
        console.log("USERID")
        console.log(this._user.userId)
        this.reimbursementService.getAllOwnReimbursement(this._user.userId).subscribe(reimb => {
          if (reimb.success){
            this._reimbursements = reimb.object;
            console.log(this._reimbursements)
          }
        })
      } else {
        this.router.navigate([``]);
      }
    }) 
  }


  reimbursements(): Array<Reimbursement> {
    return this._reimbursements;
  }
}
