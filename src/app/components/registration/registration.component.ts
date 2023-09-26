import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  email: string = "";
  username: string = "";
  password: string = "";

  constructor(
    // inject dependencies
    private userService: UserService,
    private router: Router
  ) {}

  registerUser(): void {
    this.email = this.email.trim();
    this.username = this.username.trim();
    this.password = this.password.trim();
    if (!this.email || !this.username|| !this.password) { return; }

    let userBodyData = {
      email: this.email,
      username: this.username,
      password: this.password
    }

    this.userService.registerUser(userBodyData as User)
      .subscribe(user => {
        console.log(user);
        // https://stackoverflow.com/questions/58556569/angular-7-router-navigate-with-message-after-redirecting
        const navigationExtras: NavigationExtras = {state: {registrationSuccess: true}};
        this.router.navigateByUrl('/', navigationExtras);
      });
  }
}
