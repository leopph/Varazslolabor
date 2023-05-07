import { Component } from '@angular/core';
import { UserManagerService } from '../services/user-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private userManager: UserManagerService, private router: Router) {}

  username = "";
  password = "";
  email = "";

  submitRegister() {
    this.userManager.register(this.username, this.password, this.email).subscribe({
      next: (_) => {
        this.router.navigate(['/home']);
      },
      error: error => console.log(error)
    });
  }
}
