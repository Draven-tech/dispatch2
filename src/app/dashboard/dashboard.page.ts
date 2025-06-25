import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

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

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.isResponder = this.currentUser.isResponder;
      this.responderType = this.currentUser.responderType || '';
    } else {
      this.router.navigate(['/login-citizen']);
    }
  }

  async logout(): Promise<void> {
    await this.userService.logout();
  }

  getWelcomeMessage(): string {
    if (!this.currentUser?.name) return 'Welcome';
    return this.isResponder 
      ? `Officer ${this.currentUser.name.split(' ')[0]}`
      : `Welcome back, ${this.currentUser.name.split(' ')[0]}`;
  }

  getDashboardTitle(): string {
    switch(this.responderType) {
      case 'Police': return 'POLICE Dispatch';
      case 'Firefighter': return 'FIRE DEPARTMENT Dashboard';
      case 'Paramedic': return 'EMS Dispatch';
      case 'Traffic Control (CITOM)': return 'TRAFFIC CONTROL Console';
      case 'Dispatcher': return 'DISPATCH Control Center';
      default: return 'DISPATCH Dashboard';
    }
  }
}