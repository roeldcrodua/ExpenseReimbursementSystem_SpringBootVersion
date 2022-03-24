import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router, UrlSerializer } from '@angular/router';
import { Subscription } from 'rxjs';
import { Reimbursement } from 'src/app/model/reimbursement';
import { User } from 'src/app/model/user';
import { ReimbursementService } from 'src/app/services/reimbursement.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reimbursement-list',
  templateUrl: './reimbursement-list.component.html',
  styleUrls: ['./reimbursement-list.component.css'],
  
})
export class ReimbursementListComponent implements OnInit, OnChanges {
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

  hasChanges: boolean = false;
  navigationSubscription: any;
  observer: Subscription = new Subscription;
  
  constructor(private userService: UserService, 
              private reimbursementService: ReimbursementService, 
              private router: Router) {  
                this.populateTable();
                  }

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
      } else {
        this.router.navigate([``]);
      }
    }) 
  }


  viewReimbursement(reimbId: number){
    this.reimbursementService.getReimbursementById(reimbId).subscribe(reimb => {
      if (reimb.success){
        console.log(reimb)
      }
    })
  }

  ngOnChanges(): void {
    if (this.hasChanges){
      this.populateTable();
    }
  }

  ngOnDestroy(): void {
    this.observer.unsubscribe();
  }

  ngAfterViewInit(){   
    this.populateTable(); 
    this.hasChanges=true;
  }

  populateTable(){
    this.observer = this.reimbursementService.getAllOwnReimbursement(this._user.userId).subscribe(reimb => {
        if (reimb.success){
          this._reimbursements = reimb.object;  
        }
    })
  }
}
