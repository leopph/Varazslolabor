import { Component } from '@angular/core';
import { UserManagerService } from '../services/user-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userManager: UserManagerService, private router: Router) { }

  username = "";
  password = "";

  submitLogin() {
    this.userManager.login(this.username, this.password).subscribe({
      next: (_) => {
        this.router.navigate(['/home']);
      },
      error: error => console.log(error)
    });
  }
}
