import { Component, signal, PLATFORM_ID, inject } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private platformId = inject(PLATFORM_ID);
  
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  error = signal('');
  success = signal('');

  constructor(private service: ProductService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    const loggedOut = this.route.snapshot.queryParamMap.get('loggedOut');
    if (loggedOut) {
      this.error.set('');
      this.snackBar.open('Logged out successfully', 'Close', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    
    this.service.login(username!, password!).subscribe({
      next: (res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
        }
        this.error.set('');
        this.success.set('Login successful! Redirecting to products...');
        setTimeout(() => {
          this.router.navigate(['/components/products'], { replaceUrl: true });
        }, 2000);
      },
      error: (err) => {
        this.success.set('');
        this.error.set('Invalid credentials');
      }
    });
  }
}