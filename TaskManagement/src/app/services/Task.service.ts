import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/Task.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  baseUrl = "http://localhost:7187/api/Task/";

  constructor(private http: HttpClient) {
    
   }

   addTask(data : any):Observable<any>
   {
    return this.http.post(this.baseUrl+'AddTask',data);
   }

   getAllTasks(): Observable<Task[]>
   {
    return this.http.get<Task[]>(this.baseUrl+'GetAllTasks');
   }

   updateTaskDetails(Task:any): Observable<any>
   {
    return this.http.put<Task>(this.baseUrl+'UpdateTaskDetails',Task);
   }

   deleteTaskDetailsById(id : number): Observable<any>
   {
    return this.http.delete(this.baseUrl+'DeleteTaskDetailsById?taskId='+id, { responseType: 'text' });
   }
 
  
}
