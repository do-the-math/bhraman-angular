

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { GlobalVariable } from '../services/general.js';
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
// import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isDev: boolean;

  constructor(private http: Http) {
      this.isDev = true;  // Change to false before deployment
      }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(GlobalVariable.BASE_API_URL+'/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user) {
    console.log(GlobalVariable.BASE_API_URL);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(GlobalVariable.BASE_API_URL+'/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(GlobalVariable.BASE_API_URL+'/users/profile', {headers: headers})
      .map(res => res.json());
  }

  
  // login
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  loggedIn() {
    return tokenNotExpired('id_token');
  }
  getUser(){
    return localStorage.getItem('user');
  }
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }



  resetPassword(userId, user){
    console.log("password reset from service "+userId);
    console.log(user);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let obj = {
      password: user.password
    }
    return this.http.patch(GlobalVariable.BASE_API_URL+'/users/resetpassword/'+userId, obj, {headers: headers})
      .map(res => res.json());
  }

  forgotPassword(username1: string){
    console.log("Forgot Password UserName submitted from service "+username1);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let obj = {
      username: username1
    }
    return this.http.post(GlobalVariable.BASE_API_URL+'/users/fp', obj, {headers: headers})
      .map(res => res.json());
  }

}