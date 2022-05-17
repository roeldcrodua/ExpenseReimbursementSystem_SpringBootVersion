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
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: "",
    picUrl: ""
  };
  // REIMBURSEMENT  
  _resolvedReimbursements: Reimbursement[] = [];
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
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    role: "",
    picUrl: ""
  }

  hasChanges: boolean = false;
  navigationSubscription: any;
  observer: Subscription = new Subscription;
  _status: number = 0; // PENDING Reimbursement set to 0

  constructor(private userService: UserService, 
              private reimbursementService: ReimbursementService,
              private router: Router) {  
                this.populateTable();
                  }

  ngOnInit(): void {

  }


  viewReimbursement(reimbId: number){
    this.reimbursementService.getReimbursementById(reimbId).subscribe(reimb => {
      if (reimb.success){
        console.log("VIEW REIMB")
        console.log(reimb.object)
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
    this._user = JSON.parse(sessionStorage.getItem('userObj')!); 
    if(this._user == null){
      this.router.navigateByUrl('')
    }

    if (this._user.role == "EMPLOYEE"){
      this.observer = this.reimbursementService.getAllOwnReimbursement(this._user.userId).subscribe(reimb => {
        if (reimb.success){
          console.log("IN POPULATE TABLE")
          console.log(reimb.object)
          this._reimbursements = reimb.object;  
        }
      })
    } else {
      this.observer = this.reimbursementService.getAllReimbursementByResolver().subscribe(reimb => {
        if (reimb.success){
          this._resolvedReimbursements = reimb.object;     
          console.log("IN GET ALL REIMBURSEMENT BY RESOLVER")      
          console.log(this._resolvedReimbursements)
        }
      })
      this.observer = this.reimbursementService.getAllReimbursementByStatus(this._status).subscribe(reimb => {
        if (reimb.success){
          this._reimbursements = reimb.object; 
          console.log("IN GET ALL REIMBURSEMENT BY STATUS")      
          console.log(this._resolvedReimbursements)
        }
      })     
      
    }
  }
}
