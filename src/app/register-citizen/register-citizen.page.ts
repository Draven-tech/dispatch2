import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

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

  constructor(private userService: UserService) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.userService.showAlert('Error', 'Passwords do not match');
      return;
    }
    this.userService.registerCitizen(this.name, this.phone, this.password);
  }
}