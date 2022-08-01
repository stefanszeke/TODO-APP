import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/app.state";
import * as UserAction from "src/app/store/users/users.actions";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userName:Observable<string>
  isLoggedIn:Observable<boolean>



  constructor(private cookieService: CookieService, private store:Store<AppState>, private router: Router) {
    this.userName = this.store.select('users', 'name')
    this.isLoggedIn = this.store.select('users', 'isLoggedIn')

  }

  ngOnInit(): void {
    if(this.cookieService.check('name')){
      this.store.dispatch(UserAction.loadUser({name: this.cookieService.get('name'),userId: +this.cookieService.get('user'), isLoggedIn: true}))
    }
  }

  logOut() {
    this.cookieService.delete('name')
    this.cookieService.delete('user')


    this.router.navigate(['/login']).then( () =>window.location.reload())
  }
}
