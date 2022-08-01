import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UsersService } from "src/app/services/users.service";
import { AppState } from "src/app/store/app.state";
import * as UserAction from "src/app/store/users/users.actions";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: string = "";

  constructor(private formBuilder: FormBuilder, private userService: UsersService, private cookieService: CookieService, private store:Store<AppState>, private router: Router)  { 
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  login() {
    let val = this.loginForm.value;
    this.userService.login(val.email, val.password).subscribe(res => {
      this.message = res.error
      this.store.dispatch(UserAction.loadUser({name: this.cookieService.get('name'),userId: +this.cookieService.get('user'), isLoggedIn: true}))
      if(res.message === 'User logged in') {
        this.router.navigate(['/todos'])
      }
    });
  }

}
