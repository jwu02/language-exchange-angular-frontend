import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  registrationSuccess: boolean = false;

  email: string = "";
  password: string = "";

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    // https://stackoverflow.com/questions/58556569/angular-7-router-navigate-with-message-after-redirecting
    const navigation = this.router.getCurrentNavigation();
    if (navigation) {
      const state = navigation.extras.state as {registrationSuccess: boolean};
      if (state) {
        this.registrationSuccess = state.registrationSuccess;
      }
    }
  }

  loginUser(): void {
    if (!this.email || !this.password) { return; }

    let loginDetailsBody = {
      email: this.email,
      password: this.password
    }

    this.userService.loginUser(loginDetailsBody)
      .subscribe(res => {
        console.log(res);
        if (res.status) {
          sessionStorage.setItem('loggedInUser', JSON.stringify(res.user));   // if it's object
          this.router.navigate(['posts']).then(() =>
            window.location.reload()
          );
        }
      });
  }
}
