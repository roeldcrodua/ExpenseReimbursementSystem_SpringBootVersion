import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  jwtToken = (sessionStorage.getItem('JWT')!);

  headers = new HttpHeaders().set('content-type', 'application/json')
                            .set('Access-Control-Allow-Origin', '*')
                            .set('authorization', this.jwtToken);

  setHeaders(): void {
    this.jwtToken = (sessionStorage.getItem('JWT')!);
    this.headers = new HttpHeaders().set('content-type', 'application/json')
                             .set('Access-Control-Allow-Origin', '*')
                             .set('authorization', this.jwtToken);

  }

  getDecodedAccessToken(token: string): void {
    try {
      const user = jwtDecode<any>(token);
      sessionStorage.setItem('userObj', JSON.stringify(user));
      sessionStorage.setItem('JWT', token);
    } catch(Error) {
    }
  }

  isValidToken(token: any): boolean {
    try {
      if (Date.now().toString().substring(0,10) < token){
        return true;
      }
      return false;
    } catch(Error) {
        return false;
    }
  }

  constructor(private httpClient: HttpClient, private genericService: GenericService, private router: Router) {

  }

  createUser(newUser: User) : Observable<any>{
    this.setHeaders();
    return this.httpClient.post<any>(this.genericService._localServerDomain + "/user", newUser, {'headers': this.headers});
  }

  editProfile(existingUser: User): Observable<any>{
    this.setHeaders();
    return this.httpClient.patch<any>(this.genericService._localServerDomain  + "/user", existingUser, {'headers': this.headers});
  }

  deleteUser(userInput: String): Observable<any>{
    this.setHeaders();
    return this.httpClient.delete<any>(this.genericService._localServerDomain  + `/user/${userInput}`, {'headers': this.headers});
  }

  verifyUser(userInput: any): Observable<any>{
    return this.httpClient.post<any>(this.genericService._localServerDomain + "/user/verify", userInput);
  }

  getUserByEmail(email: String): Observable<any>{
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/email/${email}`, {'headers': this.headers});
  }

  getUserByuserName(userName: String): Observable<any> {
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/username/${userName}`, {'headers': this.headers});
  }

  getUserById(id: any): Observable<any> {
    this.setHeaders();
    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/${id}`, {'headers': this.headers});
  }

  userLogin(userName: string, password: string): Observable<any>{
    return this.httpClient.post<any>(this.genericService._localServerDomain  + "/login",{
      userName: userName,
      password: password
    });
  }

  logout(){
    sessionStorage.clear();
    localStorage.clear();
    this.headers = new HttpHeaders();
    this.router.navigateByUrl('');
  }

  forgotPassword(email: string): Observable<any>{
    this.setHeaders();
    console.log("FORGOT PASSWORD")
    return this.httpClient.patch<any>(this.genericService._localServerDomain  + `/forgot-password/${email}`, {'headers': this.headers});
  }

}
