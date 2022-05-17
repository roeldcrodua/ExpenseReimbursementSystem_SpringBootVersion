import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reimbursement } from '../model/reimbursement';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {

  jwtToken = (sessionStorage.getItem('JWT')!);

  headers = new HttpHeaders().set('content-type', 'application/json')
                             .set('Access-Control-Allow-Origin', '*')
                             .set('Authorization', this.jwtToken);

  setHeaders(): void {
    this.headers = new HttpHeaders().set('content-type', 'application/json')
                             .set('Access-Control-Allow-Origin', '*')
                             .set('Authorization', this.jwtToken);
  }
  constructor(private httpClient: HttpClient, private genericService: GenericService) { }

  getAllReimbursement(): Observable<any>{
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement`, {'headers': this.headers});
  }

  getAllReimbursementByStatus(statusId: number): Observable<any>{
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/status/${statusId}`, {'headers': this.headers});
  }

  getAllOwnReimbursement(_loggedInUser: number): Observable<any>{
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/userId/${_loggedInUser}`, {'headers': this.headers});
  }

  getAllReimbursementByResolver(): Observable<any>{
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/resolved`, {'headers': this.headers});
  }

  getReimbursementById(_reimbId: number): Observable<any>{
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain + `/reimbursement/${_reimbId}`, {'headers': this.headers});
  }

  createReimbursement(reimbursement: Reimbursement): Observable<any>{
    this.setHeaders();
    return this.httpClient.post<any>(this.genericService._localServerDomain + `/reimbursement`, reimbursement, {'headers': this.headers});
  }

  editReimbursement(reimbursement: Reimbursement): Observable<any>{
    this.setHeaders();
    return this.httpClient.patch<any>(this.genericService._localServerDomain + `/reimbursement`, reimbursement, {'headers': this.headers});
  }

  deleteReimbursement(_reimbId: number): Observable<any>{
    this.setHeaders();
    return this.httpClient.delete<any>(this.genericService._localServerDomain + `/reimbursement/${_reimbId}`, {'headers': this.headers});
  }
}
