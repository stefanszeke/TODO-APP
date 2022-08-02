import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UsersService } from "src/app/services/users.service";
import { AppState } from "src/app/store/app.state";
import { faEnvelope, faUser} from "@fortawesome/free-regular-svg-icons"
import { faKey } from "@fortawesome/free-solid-svg-icons"
import { Observable } from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message: string = "";
  isLoggedIn:Observable<boolean>

  faEnvelope = faEnvelope
  faKey = faKey
  faUser = faUser

  constructor(private formBuilder: FormBuilder, private userService: UsersService, private cookieService: CookieService, private store:Store<AppState>, private router: Router) { 
    this.isLoggedIn = this.store.select('users', 'isLoggedIn')
    this.registerForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.isLoggedIn.subscribe(res => {
      if(res) {
        this.router.navigate(['/todos'])
      }
    }).unsubscribe()
  }

  register() {
    let val = this.registerForm.value;
    this.userService.register(val.name, val.email, val.password, val.confirm).subscribe(res => {
      this.message = res.error
      if(res.message === 'User created') {
        this.registerForm.reset()
        this.message = 'User registered, you can now log in'
      }
    })
  }

}
