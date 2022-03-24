import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { Reimbursement } from 'src/app/model/reimbursement';
import {NgbModal, ModalDismissReasons}
      from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { ReimbursementService } from 'src/app/services/reimbursement.service';
import { User } from 'src/app/model/user';


@Component({
    selector: 'view-reimbursement-app',
    templateUrl: './view-reimbursement.component.html'
})
export class ViewModalComponent {

    @Input()
    _isNewReimbursement = false;

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

    
    closeResult = '';
    _userId = 0;
    _firstName = "";
    _lastName = "";
    _fullName = "";

    _reimbId = 0;
    _type: any;;
    _description: String = "";
    _amount: number = 0;
    date: Date = new Date(); 
    _dateSubmitted: any = this.date.getMonth() + "-" + this.date.getDate() + "-" + this.date.getFullYear();

    constructor(private modalService: NgbModal,
                private userService: UserService,
                private reimbursementService: ReimbursementService){
        
    }

    ngOnInit(): void {
        this.userService.checkSession().subscribe(user => {
            if (user.success) {
              this._loggedInUser = {
                userId: user.object.userId,
                username: user.object.username,
                password: user.object.password,
                firstName: user.object.firstName,
                lastName: user.object.lastName,
                email: user.object.email,
                role: user.object.role
              }
              this.getAuthorName(this._loggedInUser.userId);
            } 
          }) 
        }

    viewReimbursement(reimbursement: any){
        this._reimbursement = this._reimbursementInput;
        this._reimbId = this._reimbursementInput.reimbId;
        this._type = this._reimbursementInput.type;
        this._description = this._reimbursementInput.description;
        this._amount = this._reimbursementInput.amount;
        this.getAuthorName(this._reimbursementInput.author);
        this.modalService.open(reimbursement);
    }

    addNewReimbursement(reimbursement: any){
        this._reimbursement.type = this._type;
        this._reimbursement.description = this._description;
        this._reimbursement.amount = this._amount;
        console.log(this._reimbursement);
        this.modalService.open(reimbursement);
    }

    getAuthorName(id: number){
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
            this._fullName = "(ID: " + this._userId + ") - " + this._firstName + " " + this._lastName;
        })
    }



}    