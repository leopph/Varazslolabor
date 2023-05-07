import { Component } from '@angular/core';
import { UserManagerService } from './services/user-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userManager: UserManagerService) {}

  isUserLoggedIn = false;

  ngOnInit() {
    this.userManager.isUserLoggedIn().subscribe(value => {
      this.isUserLoggedIn = Boolean(value);
    });
  }

  logOut() {
    this.userManager.logOut().subscribe({
      error: (error) => console.log(error)
    });
  }
}
