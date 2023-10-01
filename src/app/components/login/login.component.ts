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
    // store registration success status for redirected page for 
    // conditionally displaying registration success status on login page
    // https://stackoverflow.com/questions/58556569/angular-7-router-navigate-with-message-after-redirecting
    const navigation = this.router.getCurrentNavigation();
    if (navigation) {
      const state = navigation.extras.state as {registrationSuccess: boolean};
      if (state) {
        this.registrationSuccess = state.registrationSuccess;
      }
    }

    // redirect to home page if user try to access login page while logged in
    if (sessionStorage.getItem("loggedInUser")) {
      this.router.navigate(['/posts']).then(() =>
        window.location.reload()
      );
    }
  }

  loginUser(): void {
    if (this.loginForm.valid) {
      let loginDetails = this.loginForm.value;

      this.userService.loginUser(loginDetails).subscribe(res => {
        console.log(res);

        if (res.status) { // login success
          // store the logged in user in session storage and redirect to home page
          sessionStorage.setItem('loggedInUser', JSON.stringify(res.user));
          this.router.navigate(['posts']).then(() => window.location.reload());
        } else { // login failure
          // display failure message on login page
          const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
          if (alertPlaceholder) {
            alertPlaceholder.innerHTML = [
              `<div class="alert alert-danger alert-dismissible" role="alert">`,
              `   <div>${res.message}</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              '</div>'
            ].join('');
          }
        }
      });
    }
  }
}
