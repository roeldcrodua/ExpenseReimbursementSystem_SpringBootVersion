import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reimbursement } from '../model/reimbursement';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {

  constructor(private httpClient: HttpClient, private genericService: GenericService) { }

  getAllReimbursement(): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement`, {withCredentials: true});
  }

  getAllReimbursementByStatus(statusId: number): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/status/${statusId}`, {withCredentials: true});
  }

  getAllOwnReimbursement(_loggedInUser: number): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/userId/${_loggedInUser}`, {withCredentials: true});
  }

  getAllReimbursementByResolver(): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/resolved`, {withCredentials: true});
  }

  getReimbursementById(_reimbId: number): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/${_reimbId}`, {withCredentials: true});
  }

  createReimbursement(reimbursement: Reimbursement): Observable<any>{
    return this.httpClient.post<any>(this.genericService._localServerDomain + `/reimbursement`, reimbursement, {withCredentials: true});
  }

  editReimbursement(reimbursement: Reimbursement): Observable<any>{
    return this.httpClient.patch<any>(this.genericService._localServerDomain + `/reimbursement`, reimbursement, {withCredentials: true});
  }

  deleteReimbursement(_reimbId: number): Observable<any>{
    return this.httpClient.delete<any>(this.genericService._localServerDomain + `/reimbursement/${_reimbId}`,{withCredentials: true});
  }
}
