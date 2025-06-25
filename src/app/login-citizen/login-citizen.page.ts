import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  standalone: false,
  selector: 'app-login-citizen',
  templateUrl: './login-citizen.page.html',
  styleUrls: ['./login-citizen.page.scss'],
})
export class LoginCitizenPage {
  phone: string = '';
  password: string = '';

  constructor(private userService: UserService) {}

  async login(): Promise<void> {
    if (!this.phone || !this.password) {
      await this.userService.showAlert('Error', 'Please enter phone and password');
      return;
    }
    await this.userService.login(this.phone, this.password);
  }
}