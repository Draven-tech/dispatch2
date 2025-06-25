import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any = {};
  isResponder: boolean = false;
  userId: string = '';

  constructor(
    private userService: UserService,
    private auth: Auth,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      this.userId = user.uid;
      this.isResponder = await this.checkIfResponder();
      await this.loadProfile();
    } else {
      this.router.navigate(['/login-citizen']);
    }
  }

  async loadProfile(): Promise<void> {
    try {
      this.profile = await this.userService.getUserProfile(
        this.userId,
        this.isResponder
      ) || {};
    } catch (error) {
      console.error('Failed to load profile:', error);
      await this.userService.showAlert('Error', 'Failed to load profile data');
    }
  }

  async saveProfile(): Promise<void> {
    try {
      const success = await this.userService.updateProfile(
        this.userId,
        this.profile,
        this.isResponder
      );
      
      if (success) {
        await this.userService.showAlert('Success', 'Profile updated successfully');
        await this.loadProfile(); // Refresh profile data
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      await this.userService.showAlert('Error', 'Failed to update profile');
    }
  }

  async deleteAccount(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Account Deletion',
      message: 'This action cannot be undone. Enter your password to confirm:',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password',
          attributes: {
            required: true
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete Account',
          handler: async (data: { password: string }) => {
            if (!data.password) {
              await this.userService.showAlert('Error', 'Password is required');
              return false;
            }
            
            const success = await this.userService.deleteAccount(
              data.password,
              this.isResponder
            );
            
            if (success) {
              this.router.navigate(['/welcome']);
            }
            return success;
          }
        }
      ]
    });
    
    await alert.present();
  }

  private async checkIfResponder(): Promise<boolean> {
    try {
      const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return !!userData.isResponder;
    } catch (error) {
      console.error('Error checking responder status:', error);
      return false;
    }
  }
}