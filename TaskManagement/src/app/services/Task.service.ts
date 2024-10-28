import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Task } from '../models/Task.model';
import jwt_decode from 'jwt-decode'; // Alternative way



@Injectable({
  providedIn: 'root'
})
export class HomeService {

  baseUrl = "http://localhost:7187/api/Task/";

  constructor(private http: HttpClient) {
    
   }


   addTask(data: any): Observable<any> {
    // Retrieve the token from local storage or your auth service
    const token = localStorage.getItem('token'); // Change this to your token retrieval method

    // Set the authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Ensure the content type is set if you're sending JSON
    });

    return this.http.post(this.baseUrl + 'AddTask', data, { headers });
  }

   getAllTasks(p0?: { headers: HttpHeaders; }): Observable<Task[]>
   {
    return this.http.get<Task[]>(this.baseUrl+'GetAllTasks');
   }

   updateTaskDetails(task: any): Observable<any> {
    const token = localStorage.getItem('token'); // Adjust this based on how you retrieve the token
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(this.baseUrl+'UpdateTaskDetails',task, { headers });
  }                          
  
   deleteTaskDetailsById(id : number): Observable<any>
   {
    return this.http.delete(this.baseUrl+'DeleteTaskDetailsById?taskId='+id, { responseType: 'text' });
   }
  


deleteTaskByUserIdAndTaskId(userId: string, taskId: string): Observable<any> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token not found');
    return throwError('Token not found');
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Correct URL format with both userId and taskId as query parameters
  return this.http.delete<any>(`${this.baseUrl}DeleteTaskByUserIdAndTaskId?userId=${userId}&taskId=${taskId}`, { headers });
}



getUserTasks(token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(this.baseUrl + 'GetUserTasks', { headers });
}

}
