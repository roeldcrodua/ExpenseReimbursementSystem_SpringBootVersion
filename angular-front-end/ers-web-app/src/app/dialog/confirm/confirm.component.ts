import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ReimbursementListComponent } from 'src/app/components/reimbursement/reimbursement-list/reimbursement-list.component';
import { ViewModalComponent } from 'src/app/components/reimbursement/view-reimbursement/view-reimbursement.component';
import { Reimbursement } from 'src/app/model/reimbursement';
import { User } from 'src/app/model/user';
import { ReimbursementService } from 'src/app/services/reimbursement.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmDialogComponent {

  @Input()
  _reimbursementInput: Reimbursement = {
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
  _type: any;
  @Input()
  _description: any;
  @Input()
  _amount: any;

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
_specifiedUser:  User = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  userId: 0,
  role: ""
}

  //_dateSubmitted: any = Date.now().toLocaleString();
  _action: any;

  constructor(private reimbursementService: ReimbursementService,
              private modalService: NgbModal,
              private userService: UserService,
              private viewModalComponent: ViewModalComponent,
              private router: Router,
              private reimbursementList: ReimbursementListComponent) { 
  }
  
  ngOnInit(): void {
    this.userService.checkSession().subscribe(user => {
      if (user.success) {
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
      } 
    }) 
  }


  addNewReimbursement(reimbursement: any){
    this._action = "add";
    this.modalService.open(reimbursement);
  }

  deleteReimbursement(reimbursement: any){
    this._action = "delete";
    this.modalService.open(reimbursement);
  }

  editReimbursement(reimbursement: any){
    this._action = "edit";
    this.modalService.open(reimbursement);
  }


  updateChanges(){
      if (this._action == "add"){
        this._reimbursement.type = this._type;
        this._reimbursement.description = this._description;
        this._reimbursement.amount = this._amount;
        this._reimbursement.author = this._user.userId;
        this._reimbursement.status = 0;
        this.viewModalComponent.getAuthorName(this._user.userId);
        this.reimbursementService.createReimbursement(this._reimbursement).subscribe(data => {
          if (data.success){
            this.modalService.dismissAll();
            this.reimbursementList.hasChanges=true; 
            this.reimbursementList.ngOnChanges();   
          }
        })
      } else if (this._action  == "delete"){
        this._reimbursement = this._reimbursementInput;
        this.reimbursementService.deleteReimbursement(this._reimbursement.reimbId).subscribe(data => {
          if (data.success){
            this.modalService.dismissAll();   
            this.reimbursementList.hasChanges=true; 
            this.reimbursementList.ngOnChanges();     
          }
        })
      } else if (this._action  == "edit"){
        this._reimbursement = this._reimbursementInput;
        this._reimbursement.type = this._type;
        this._reimbursement.description = this._description;
        this._reimbursement.amount = this._amount;
        console.log(this._reimbursement);
        this.reimbursementService.editReimbursement(this._reimbursement).subscribe(data => {
          if (data.success){
            console.log(data);
            this.modalService.dismissAll();

          }
        })
      } 
  }
}
