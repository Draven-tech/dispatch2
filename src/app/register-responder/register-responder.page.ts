import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  standalone: false,
  selector: 'app-register-responder',
  templateUrl: './register-responder.page.html',
  styleUrls: ['./register-responder.page.scss'],
})
export class RegisterResponderPage {
  name: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  responderType: string = 'Police';
  badgeId: string = '';
  organization: string = '';

  constructor(private userService: UserService) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      await this.userService.showAlert('Error', 'Passwords do not match');
      return;
    }

    if (!this.name || !this.phone || !this.password || !this.responderType) {
      await this.userService.showAlert('Error', 'Please fill all required fields');
      return;
    }

    await this.userService.registerResponder(
      this.name,
      this.phone,
      this.password,
      this.responderType,
      this.badgeId,
      this.organization
    );
  }
}