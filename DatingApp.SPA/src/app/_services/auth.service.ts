import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;

  constructor(private http: Http) { }

  login(model: any) {


    return this.http.post(this.baseUrl + 'login', model).map((response: Response) => {
      const user = response.json();

      if (user) {
        localStorage.setItem('token', user.tokenString);
      }
    }).catch(this.handleError);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model).catch(this.handleError);
  }


  // private requestOptions(){
  //   const headers = new Headers({'Content-type': 'application/json'});
  //   return new RequestOptions({headers:headers});
  // }

  private handleError(error: any) {
    debugger;
    const applicationError = error.Headers.get('Application-Error');
    if (applicationError) {
      return Observable.throw(applicationError);
    }


    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return Observable.throw(modelStateErrors || 'Server error');
  }
}
