import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  currentUser: any;
  isResponder = false;
  responderType = '';

  constructor(private userService: UserService) {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.isResponder = this.currentUser.responderType !== undefined;
      this.responderType = this.currentUser.responderType || '';
    }
  }

  logout() {
    this.userService.logout();
  }

  getWelcomeMessage(): string {
    if (!this.currentUser) return 'Welcome';
    
    if (this.isResponder) {
      return `Officer ${this.currentUser.name.split(' ')[0]}`;
    }
    return `Welcome back, ${this.currentUser.name.split(' ')[0]}`;
  }

  getDashboardTitle(): string {
    switch(this.responderType) {
      case 'Police':
        return 'POLICE Dispatch';
      case 'Firefighter':
        return 'FIRE DEPARTMENT Dashboard';
      case 'Paramedic':
        return 'EMS Dispatch';
      case 'Traffic Control (CITOM)':
        return 'TRAFFIC CONTROL Console';
      case 'Dispatcher':
        return 'DISPATCH Control Center';
      default:
        return 'DISPATCH Dashboard';
    }
  }
}