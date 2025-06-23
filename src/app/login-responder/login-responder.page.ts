import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-login-responder',
  templateUrl: './login-responder.page.html',
  styleUrls: ['./login-responder.page.scss'],
})
export class LoginResponderPage {
  private userService = inject(UserService);
  phone: string = '';
  password: string = '';

  login() {
    if (!this.phone || !this.password) {
      return;
    }
    this.userService.login(this.phone, this.password, true);
  }
}