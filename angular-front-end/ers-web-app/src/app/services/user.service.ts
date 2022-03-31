import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private genericService: GenericService) {

   }

  createUser(newUser: User) : Observable<any>{
    return this.httpClient.post<any>(this.genericService._localServerDomain + "/user", newUser, {withCredentials: true});
  }

  editProfile(existingUser: User): Observable<any>{
    return this.httpClient.patch<any>(this.genericService._localServerDomain  + "/user", existingUser, {withCredentials: true});
  }

  deleteUser(userInput: String): Observable<any>{
    return this.httpClient.delete<any>(this.genericService._localServerDomain  + `/user/${userInput}`, {withCredentials: true});
  }

  getListOfUser(): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain + "/user", {withCredentials: true});
  }

  getUserByEmail(email: String): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/email/${email}`, {withCredentials: true});
  }

  getUserByuserName(userName: String): Observable<any> {

    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/username/${userName}`, {withCredentials: true});
  }

  getUserById(id: any): Observable<any> {

    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/${id}`, {withCredentials: true});
  }

  checkSession(): Observable<any>{
    return this.httpClient.get<any>(this.genericService._localServerDomain  + "/check-session", {withCredentials: true});
  }

  userLogin(userName: string, password: string): Observable<any>{
    return this.httpClient.post<any>(this.genericService._localServerDomain  + "/login",{
      userName: userName,
      password: password
    }, {withCredentials: true});
  }

  logout(){
    return this.httpClient.get<any>(this.genericService._localServerDomain  + "/logout", {withCredentials: true});
  }

  forgotPassword(email: string): Observable<any>{
    return this.httpClient.patch<any>(this.genericService._localServerDomain  + `/forgot-password/${email}`, {withCredentials: true});
  }


}
