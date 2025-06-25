import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  standalone: false,
  selector: 'app-login-responder',
  templateUrl: './login-responder.page.html',
  styleUrls: ['./login-responder.page.scss'],
})
export class LoginResponderPage {
  phone: string = '';
  password: string = '';

  constructor(private userService: UserService) {}

  async login(): Promise<void> {
    if (!this.phone || !this.password) {
      await this.userService.showAlert('Error', 'Please enter phone and password');
      return;
    }
    await this.userService.login(this.phone, this.password, true);
  }
}