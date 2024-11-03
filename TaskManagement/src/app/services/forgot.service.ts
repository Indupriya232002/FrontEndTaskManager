import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotService {
  baseUrl = "http://localhost:7187/api/User/";

  constructor(private http: HttpClient) {

  }
  
  forgotPassword(email: string): Observable<any> {
    const payload = { email: email };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Ensure the content type is set if you're sending JSON
    });
    return this.http.post<any>(this.baseUrl + 'RequestPasswordReset',payload,{ headers } );
  }


  resetPassword(email: string, newPassword: string): Observable<any> {
    const payload = { email:email, NewPassword: newPassword };  // Ensure the property names match the backend expectation
    return this.http.post(this.baseUrl + 'ResetPassword', payload);
  }


}
