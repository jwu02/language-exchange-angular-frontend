import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  registrationSuccess: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl<string|null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string|null>(null, [Validators.required])
  });

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
    if (this.loginForm.valid) {
      let loginDetails = this.loginForm.value;

      this.userService.loginUser(loginDetails)
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
}
