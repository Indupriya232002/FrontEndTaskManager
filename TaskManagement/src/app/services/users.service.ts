import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = 'http://localhost:7187/api/User/';

  constructor(private http:HttpClient) { 

  }

  login(logindata:any):Observable<any>
  {
    return this.http.post(this.baseUrl+'Login',logindata);
  }

  clean():void{
    window.sessionStorage.clear();
  }

  signUp(data:any): Observable<any>
  {
    return this.http.post(this.baseUrl+'SignUp',data);
  }
}
