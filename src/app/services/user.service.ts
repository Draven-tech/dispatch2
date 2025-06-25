import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  private phoneToEmail(phone: string): string {
    return `${phone.replace(/\D/g, '')}@emscall.app`;
  }

  // Auth Methods
  async registerCitizen(name: string, phone: string, password: string): Promise<boolean> {
    try {
      if (password.length < 6) throw new Error('Password must be at least 6 characters');
      
      const email = this.phoneToEmail(phone);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      await setDoc(doc(this.firestore, 'citizens', userCredential.user.uid), {
        name, phone, emergencyContacts: [], address: "", createdAt: serverTimestamp()
      });

      this.storeUserData(userCredential.user.uid, phone, false);
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.showAlert('Error', error.message || 'Registration failed');
      return false;
    }
  }

  async getUserProfile(userId: string, isResponder: boolean = false): Promise<any> {
    try {
      const collectionName = isResponder ? 'responders' : 'citizens';
      const userDoc = await getDoc(doc(this.firestore, collectionName, userId));
      
      if (!userDoc.exists()) {
        console.warn('No document found for user:', userId);
        return null;
      }
      
      return userDoc.data();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to load profile data');
    }
  }

  async registerResponder(
    name: string,
    phone: string,
    password: string,
    responderType: string,
    badgeId: string = '',
    organization: string = ''
  ): Promise<boolean> {
    try {
      if (password.length < 6) throw new Error('Password must be at least 6 characters');
      
      const email = this.phoneToEmail(phone);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      await setDoc(doc(this.firestore, 'responders', userCredential.user.uid), {
        name, phone, responderType, badgeId, organization,
        isOnDuty: false, available: true,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });

      this.storeUserData(userCredential.user.uid, phone, true, { responderType });
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.showAlert('Error', error.message || 'Registration failed');
      return false;
    }
  }

  async login(phone: string, password: string, isResponder: boolean = false): Promise<boolean> {
    try {
      const email = this.phoneToEmail(phone);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      const collection = isResponder ? 'responders' : 'citizens';
      const userDoc = await getDoc(doc(this.firestore, collection, userCredential.user.uid));
      
      if (!userDoc.exists()) throw new Error('User data not found');
      
      this.storeUserData(userCredential.user.uid, phone, isResponder, userDoc.data());
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error: any) {
      this.showAlert('Login Failed', this.getAuthErrorMessage(error));
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/welcome']);
  }

  // Profile Methods
  async updateProfile(userId: string, data: any, isResponder: boolean = false): Promise<boolean> {
    try {
      const collection = isResponder ? 'responders' : 'citizens';
      await updateDoc(doc(this.firestore, collection, userId), {
        ...data, updatedAt: serverTimestamp()
      });
      return true;
    } catch (error: any) {
      this.showAlert('Error', 'Failed to update profile');
      return false;
    }
  }

  async deleteAccount(password: string, isResponder: boolean = false): Promise<boolean> {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('Not logged in');
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const email = this.phoneToEmail(currentUser.phone);
      
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(email, password));
      
      const collection = isResponder ? 'responders' : 'citizens';
      await deleteDoc(doc(this.firestore, collection, user.uid));
      await user.delete();
      
      localStorage.removeItem('currentUser');
      this.router.navigate(['/welcome']);
      return true;
    } catch (error: any) {
      this.showAlert('Error', this.getAuthErrorMessage(error));
      return false;
    }
  }

  // Helpers
  private storeUserData(uid: string, phone: string, isResponder: boolean, extraData: any = {}): void {
    localStorage.setItem('currentUser', JSON.stringify({ 
      uid, phone, isResponder, ...extraData 
    }));
  }

  private getAuthErrorMessage(error: any): string {
    const messages: Record<string, string> = {
      'auth/invalid-email': 'Invalid phone number',
      'auth/user-not-found': 'Account not found',
      'auth/wrong-password': 'Wrong password',
      'auth/too-many-requests': 'Too many attempts. Try later.',
      'auth/requires-recent-login': 'Please login again',
      'permission-denied': 'Permission denied'
    };
    return messages[error.code] || error.message || 'Operation failed';
  }
}