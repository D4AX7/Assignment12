import { Component, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  error = signal('');
  success = signal('');

  constructor(private service: ProductService, private router: Router) {}

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.registerForm.value;
    this.error.set('');
    this.success.set('');

    const passwordError = this.validatePassword(password ?? '');
    if (passwordError) {
      this.error.set(passwordError);
      return;
    }

    this.service.register(email!, password!).subscribe({
      next: (res) => {
        this.error.set('');
        this.success.set('Registration successful! Redirecting to login...');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {

        if (err.status >= 200 && err.status < 300) {

          this.error.set('');
          this.success.set('Registration successful! Redirecting to login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {

          this.success.set('');
          this.error.set('Registration failed');
        }
      }
    });
  }

  validatePassword(password: string): string | null {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('at least 6 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('at least one special character (!@#$%^&* etc.)');
    }
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(', ')}`;
    }
    
    return null;
  }
}
