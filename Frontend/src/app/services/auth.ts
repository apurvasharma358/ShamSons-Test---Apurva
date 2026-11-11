import { Injectable } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clerkInstance!: Clerk;
  public isLoaded$ = new BehaviorSubject<boolean>(false);
  public user$ = new BehaviorSubject<any>(null);

  constructor() {
    this.initClerk();
  }

  private async initClerk() {
    this.clerkInstance = new Clerk((environment as any).clerkPublishableKey);
    try {
      await this.clerkInstance.load();
      
      // 1. Instantly push the current user session state right after loading completes
      this.user$.next(this.clerkInstance.user || null);
      this.isLoaded$.next(true);

      // 2. Watch for future login/logout state changes while the app is running
      this.clerkInstance.addListener((state) => {
        this.user$.next(state.user || null);
      });
    } catch (err) {
      console.error('Clerk failed to load:', err);
    }
  }

  // Native redirection to Google Login flow
  loginWithGoogle() {
    if (!this.clerkInstance) return;
    this.clerkInstance.redirectToSignIn({
      signInForceRedirectUrl: '/dashboard',
      signUpForceRedirectUrl: '/dashboard'
    });
  }

  logout() {
    this.clerkInstance?.signOut();
  }

  // Fetch the raw JWT token to append to HTTP Requests heading to Node.js
  async getToken(): Promise<string | null> {
    return this.clerkInstance?.session ? await this.clerkInstance.session.getToken() : null;
  }
}
