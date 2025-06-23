import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-login-citizen',
  templateUrl: './login-citizen.page.html',
  styleUrls: ['./login-citizen.page.scss'],
})
export class LoginCitizenPage {
  private userService = inject(UserService);
  phone: string = '';
  password: string = '';


  login() {
    if (!this.phone || !this.password) {
      return;
    }
    this.userService.login(this.phone, this.password);
  }
}