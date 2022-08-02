import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url: string = 'http://localhost:7000';
  options: any = {
    headers: new HttpHeaders({
      'content-type': 'application/json'
    }),
    withCredentials: true
  }

  constructor(private http:HttpClient) { }

  login(email:string, password:string):Observable<any>{
    return this.http.post<any>(`${this.url}/api/users/login`,{email,password},this.options);
  }

  register(name:string, email:string, password:string, confirm:string):Observable<any>{
    return this.http.post<any>(`${this.url}/api/users/register`,{name,email,password,confirm},this.options);
  }

  logout():Observable<any>{
    return this.http.get<any>(`${this.url}/api/users/logout`,this.options);
  }
}
