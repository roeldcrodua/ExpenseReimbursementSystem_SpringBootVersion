import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private genericService: GenericService) {

   }

  createUser(username:string, password:string, firstName:string, lastName: string, email:string, birthday:any, profilePic?:string){
    return this.httpClient.post<any>(this.genericService._localServerDomain + "/user", {
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      email: email,
      birthday: birthday,
      profilePic: profilePic
    }, {withCredentials: true});
  }

  editProfile(firstName: string, lastName: string, birthday: any, aboutMe: string, profilePic?: any){
    return this.httpClient.patch<any>(this.genericService._localServerDomain  + "/user",{
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      profilePic: profilePic
    }, {withCredentials: true});
  }

  deleteUser(userInput: string){
    return this.httpClient.delete<any>(this.genericService._localServerDomain  + `/user/${userInput}`), {withCredentials: true};
  }

  getListOfUser(){
    return this.httpClient.get<any>(this.genericService._localServerDomain + "/user", {withCredentials: true});
  }

  getUserByEmail(email: string){
    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/email/${email}`, {withCredentials: true});
  }

  getUserByUsername(username: string) {

    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/user/username/${username}`, {withCredentials: true});
  }

  checkSession(){
    return this.httpClient.get<any>(this.genericService._localServerDomain  + "/check-session", {withCredentials: true});
  }

  userLogin(username: string, password: string){
    return this.httpClient.post<any>(this.genericService._localServerDomain  + "/login",{
      userName: username,
      password: password
    }, {withCredentials: true});
  }

  logout(){
    return this.httpClient.get<any>(this.genericService._localServerDomain  + "/logout", {withCredentials: true});
  }

  resetPassword(email: string, password: string){
    return this.httpClient.patch<any>(this.genericService._localServerDomain  + "/user",{
      email: email,
      password: password
    }, {withCredentials: true});
  }

  forgotPassword(email: string){
    return this.httpClient.get<any>(this.genericService._localServerDomain  + `/forgot-password/${email}`, {withCredentials: true});
  }


}
