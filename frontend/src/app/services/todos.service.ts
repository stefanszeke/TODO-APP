import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Todo } from "../models/Todo";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = 'http://localhost:7000';
  options: any = {
    headers: new HttpHeaders({
      'content-type': 'application/json'
    })
  }

  constructor(private http:HttpClient) {}

  getTodos(id:number):Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.url}/api/todos/${id}`);
  }

  addTodo(user_id:number,text:string) {
    return this.http.post(`${this.url}/api/todos`, {user_id,text}, this.options);
  }

  checkTodo(id:number) {
    return this.http.patch(`${this.url}/api/todos/${id}`, {});
  }

  editTodo(id:number, text:string) {
    return this.http.patch(`${this.url}/api/todos/${id}`, {text}, this.options);
  }

  deleteTodo(id:number) {
    return this.http.delete(`${this.url}/api/todos/${id}`, {});
  }
}
