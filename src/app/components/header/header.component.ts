import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loggedInUser? : User;

  constructor(private router: Router) {
    let jsonString = sessionStorage.getItem("loggedInUser") || "";
    if (jsonString) {
      this.loggedInUser = JSON.parse(jsonString) as User;
    }
    console.log(this.loggedInUser);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
    window.location.reload();
  }
}
