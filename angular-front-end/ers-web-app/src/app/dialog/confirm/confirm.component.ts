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
  _isUser: boolean = false;
  @Input()
  _type: any;
  @Input()
  _description: any;
  @Input()
  _amount: any;
  _action: any;
  @Input()
  _status: any;
  @Input()
  _isManager: boolean = false;
  @Input()
  _isSearchActivated: boolean = false;
  @Input()
  _isAddingReimbursement: boolean = false;
  @Input()
  _isDeletingReimbursment: boolean = false;
  @Input()
  _isEditingReimbursment: boolean = false;
  @Input()
  _isRegisteringUser: boolean = false;
  @Input()
  _isRemovingUser: boolean = false;
  @Input()
  _isUpdatingUser: boolean = false;
  @Input()
  _isResetPassword: boolean = false;
  @Input()
  _isProcessed: boolean = false;
  
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
  userName: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  userId: 0,
  role: "",
  picUrl: ""
};

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

date: Date = new Date(); 
_dateResolved: any = this.date.getMonth() + "-" + this.date.getDate() + "-" + this.date.getFullYear();

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

  resolveReimbursement(reimbursement: any){
    this._action = "resolve";
    this.modalService.open(reimbursement);
  }

  addNewUser(user: any){
    this._action = "register";
    this.modalService.open(user);
  }

  deleteUser(user: any){
    this._action = "remove";
    this.modalService.open(user);
  }

  editUser(user: any){
    this._action = "update";
    this.modalService.open(user);
  }


  updateChanges(){
      ////////////////////////////////////
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
            alert(data.message);
          }
        })
      } 
      ////////////////////////////////////
      else if (this._action  == "delete"){
        this._reimbursement = this._reimbursementInput;
        this.reimbursementService.deleteReimbursement(this._reimbursement.reimbId).subscribe(data => {
          if (data.success){
            this.modalService.dismissAll();   
            this.reimbursementList.hasChanges=true; 
            this.reimbursementList.ngOnChanges();    
            alert(data.message); 
          }
        })
      } 
      ////////////////////////////////////
      else if (this._action  == "edit"){
        this._reimbursement = this._reimbursementInput;
        this._reimbursement.type = this._type;
        this._reimbursement.description = this._description;
        this._reimbursement.amount = this._amount;
        console.log(this._reimbursement);
        this.reimbursementService.editReimbursement(this._reimbursement).subscribe(data => {
          if (data.success){
            console.log(data);
            this.modalService.dismissAll();
            this.reimbursementList.hasChanges=true; 
            this.reimbursementList.ngOnChanges();  
            alert(data.message);
          }
        })
      } 
      ////////////////////////////////////
      else if (this._action == "resolve"){
        console.log("INPUT REIMBURSEMENT:")
        console.log(this._reimbursementInput)
        this._reimbursement = this._reimbursementInput;
        this._reimbursement.status = this._status;
        this._reimbursement.dateResolved = this._dateResolved;
        this._reimbursement.resolver = this._user.userId;
        console.log("OUTPUT REIMBURSEMENT:")
        console.log(this._reimbursement)
        this.reimbursementService.editReimbursement(this._reimbursement).subscribe(data => {
          if (data.success){
            console.log(data);
            this.modalService.dismissAll();
            this.reimbursementList.hasChanges=true; 
            this.reimbursementList.ngOnChanges();  
            alert(data.message);
          }
        })
      } 
      ////////////////////////////////////
      else if (this._action  == "register"){
        console.log("REGISTER");
        console.log(this._specifiedUser);
        this.userService.createUser(this._specifiedUser).subscribe( data => {
          if (data.success){
            console.log(data.object)
            this.modalService.dismissAll();
            alert(data.message);
          }
        })
      } 
      ////////////////////////////////////
      else if (this._action  == "remove"){
        console.log("REMOVE");
        console.log(this._specifiedUser);
        alert("This is not yet implemented!");
        // this.userService.deleteUser(this._specifiedUser.userName).subscribe( data => {
        //   if (data.success){
        //     console.log(data.object)
        //     this.modalService.dismissAll();
        //   }
        //})
      } 
      ////////////////////////////////////
      else if (this._action  == "update"){
        console.log("UPDATE");
        console.log(this._specifiedUser);
        this.userService.editProfile(this._specifiedUser).subscribe( data => {
          if (data.success){
            console.log("OBJECT");
            console.log(data.object)
            this.modalService.dismissAll();
            alert(data.message);
          }
        })
      }
  }
}
