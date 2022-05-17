import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Reimbursement } from 'src/app/model/reimbursement';
import {NgbModal, ModalDismissReasons}
      from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { ReimbursementService } from 'src/app/services/reimbursement.service';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';



@Component({
    selector: 'view-reimbursement-app',
    templateUrl: './view-reimbursement.component.html'
})
export class ViewModalComponent {

    @Input()
    _isNewReimbursement = false;

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

    _isUser: boolean = false;
    closeResult = '';
    _userId = -1;
    _firstName = "";
    _lastName = "";
    _fullName = "";
    _reimbId = 0;
    _type: any;
    _status: any;
    _author = "";
    _resolver = "";
    _description: String = "";
    _amount:  any;
    date: Date = new Date(); 
    _dateSubmitted: any = ((this.date.getMonth() + 1) < 10 ? '0'+ (this.date.getMonth() + 1) : this.date.getMonth()) +
                         "-" + ((this.date.getDate() + 1) < 10 ? '0'+ (this.date.getDate() + 1) : this.date.getDate()) +
                         "-" + this.date.getFullYear() +
                         " " + (parseInt(this.date.getHours().toString().substring(0,2)) < 10 ? '0'+ this.date.getHours().toString().substring(0,2) : this.date.getHours().toString().substring(0,2)) + 
                         ":" + (parseInt(this.date.getMinutes().toString().substring(0,2)) < 10 ? '0'+ this.date.getMinutes().toString().substring(0,2) : this.date.getMinutes().toString().substring(0,2)) + 
                         ":" + (parseInt(this.date.getSeconds().toString().substring(0,2)) < 10 ? '0'+ this.date.getSeconds().toString().substring(0,2) : this.date.getSeconds().toString().substring(0,2));
    _dateResolved: any = ((this.date.getMonth() + 1) < 10 ? '0'+ (this.date.getMonth() + 1) : this.date.getMonth()) +
                         "-" + ((this.date.getDate() + 1) < 10 ? '0'+ (this.date.getDate() + 1) : this.date.getDate()) +
                         "-" + this.date.getFullYear() +
                         " " + (parseInt(this.date.getHours().toString().substring(0,2)) < 10 ? '0'+ this.date.getHours().toString().substring(0,2) : this.date.getHours().toString().substring(0,2)) + 
                         ":" + (parseInt(this.date.getMinutes().toString().substring(0,2)) < 10 ? '0'+ this.date.getMinutes().toString().substring(0,2) : this.date.getMinutes().toString().substring(0,2)) + 
                         ":" + (parseInt(this.date.getSeconds().toString().substring(0,2)) < 10 ? '0'+ this.date.getSeconds().toString().substring(0,2) : this.date.getSeconds().toString().substring(0,2));
    _isAddingReimbursement: boolean = false;
    _isDeletingReimbursment: boolean = false;
    _isEditingReimbursment: boolean = false;
    _isManager = false;
    _isProcessed = false;

    constructor(private modalService: NgbModal,
                private userService: UserService,
                private router: Router){
        
    }

    ngOnInit(): void {
        this._loggedInUser = JSON.parse(sessionStorage.getItem('userObj')!); 
        if(this._loggedInUser == null){
          this.router.navigateByUrl('')
        }
    
        if (this._loggedInUser.role == "MANAGER"){
          this._isManager = true;
        }    
    }

    viewReimbursement(reimbursement: any){
        this._isAddingReimbursement = false;
        this._isEditingReimbursment = true;
        this._isDeletingReimbursment = true;
        this._reimbursement = this._reimbursementInput;
        this._reimbId = this._reimbursementInput.reimbId;
        this._type = this._reimbursementInput.type;
        this._description = this._reimbursementInput.description;
        this._amount = this._reimbursementInput.amount;
        this.getAuthorName(this._reimbursementInput.author);
        if (this._reimbursementInput.resolver < 1){
            this.getResolverName(this._loggedInUser.userId)
        } else {
            this.getResolverName(this._reimbursementInput.resolver)
        }
        this._status = this._reimbursementInput.status;
        console.log("STATUS")
        console.log(this._status)

        if (this._reimbursementInput.status != "PENDING"){
            this._isProcessed = true;            
        }
        this.modalService.open(reimbursement);
        console.log("REIMBURSEMENT")
        console.log(this._reimbursement)
    }

    addNewReimbursement(reimbursement: any){
        this._isAddingReimbursement = true;
        this._isEditingReimbursment = false;
        this._isDeletingReimbursment = false;
        this._reimbursement.type = this._type;
        this._reimbursement.description = this._description;
        this._reimbursement.amount = this._amount;
        this._reimbursement.reimbId = this._loggedInUser.userId
        this._dateResolved = "";
        this.getAuthorName(this._loggedInUser.userId);
        console.log("ADDING REIMBURSEMENT")
        console.log(this._reimbursement);
        this.modalService.open(reimbursement);
    }

    getAuthorName(id: number) {
        this.userService.getUserById(id).subscribe(data => {
            if (data.success){
                this._userId = data.object.userId;
                this._firstName = data.object.firstName;
                this._lastName = data.object.lastName;
            } else {
                this._userId = -1;
                this._firstName = "UNKNOWN";
                this._lastName = "UNKNOWN";
            }
            this._author = "(ID: " + this._userId + ") - " + this._firstName + " " + this._lastName;
        })
    }

    getResolverName(id: number){
        this.userService.getUserById(id).subscribe(data => {
            if (data.success){
                this._userId = data.object.userId;
                this._firstName = data.object.firstName;
                this._lastName = data.object.lastName;
            } else {
                this._userId = -1;
                this._firstName = "UNKNOWN";
                this._lastName = "UNKNOWN";
            }
            this._resolver = "(ID: " + this._userId + ") - " + this._firstName + " " + this._lastName;
        })
    }


}    