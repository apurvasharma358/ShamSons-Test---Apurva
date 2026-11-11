import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  // templateUrl: './login.html',
  template: `
    <div class="login-container">
      <h2>Welcome Project Application</h2>
      <button (click)="signIn()">Sign In with Google</button>
    </div>
  `,
  styleUrl: './login.css',
})
export class Login {
  constructor(private auth: AuthService, private router: Router) {}

  // ngOnInit() {
  //   // If Clerk loads and finds an active session, skip the login page entirely
  //   this.auth.user$.subscribe(user => {
  //     if (user) {
  //       this.router.navigate(['/dashboard']); // Redirect to your application dashboard path
  //     }
  //   });
  // }

  signIn() {
    this.auth.loginWithGoogle();
  }
}
