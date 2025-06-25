import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register-citizen',
  templateUrl: './register-citizen.page.html',
  styleUrls: ['./register-citizen.page.scss'],
})
export class RegisterCitizenPage {
  name: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  async register(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      await this.userService.showAlert('Error', 'Passwords do not match');
      return;
    }

    const success = await this.userService.registerCitizen(
      this.name,
      this.phone,
      this.password
    );

    if (success) {
      this.router.navigate(['/login-citizen']);
    } else {
      await this.userService.showAlert('Error', 'Registration failed. Please try again.');
    }
  }
}