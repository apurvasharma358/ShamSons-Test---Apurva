import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  backendData: any;

  constructor(public auth: AuthService, private http: HttpClient, private router: Router) {
    this.auth.user$.subscribe(user => {
      if (user) {
        // Strips the query parameters out of the address bar cleanly without reloading the page
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });
  }

  ngOnInit() {
    // Wait until the user object is definitely available before calling your backend API
    this.auth.user$.pipe(
      filter(user => user !== null && user !== undefined)
    ).subscribe(user => {
      console.log('User confirmed by Clerk. Triggering backend API call...', user);
      this.fetchProtectedData();
    });
  }

  fetchProtectedData() {
    this.http.get('http://localhost:3000/protected').subscribe({
      next: (res) => {
        console.log('Received response from backend:', res);
        this.backendData = res;
      },
      error: (err) => {
        console.error('Failed to communicate with Node backend:', err);
      }
    });
  }
}
