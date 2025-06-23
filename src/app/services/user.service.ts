import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
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
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Convert phone to email format for Firebase Auth
  private phoneToEmail(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    return `${cleanPhone}@emscall.app`;
  }

  // Citizen Registration
  async registerCitizen(name: string, phone: string, password: string) {
  // Add password length validation
  if (password.length < 6) {
    await this.showAlert('Error', 'Password must be at least 6 characters');
    return false;
  }

  try {
    const email = this.phoneToEmail(phone);
    console.log('Registering with:', { email, password: '***' }); // Debug log

    const userCredential = await createUserWithEmailAndPassword(
      this.auth, 
      email, 
      password
    );

    // Save to Firestore
    await setDoc(doc(this.firestore, 'citizens', userCredential.user.uid), {
      name,
      phone,
      emergencyContacts: [],
      address: "",
      createdAt: serverTimestamp()
    });

    this.router.navigate(['/dashboard']);
    return true;
  } catch (error) {
    console.error('Full error:', error); // Detailed error log
    await this.showAlert('Registration Failed', this.getErrorMessage(error));
    return false;
  }
}

  // Responder Registration
  async registerResponder(
    name: string,
    phone: string,
    password: string,
    responderType: string,
    badgeId?: string,
    organization?: string
  ) {
    try {
      const email = this.phoneToEmail(phone);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      await setDoc(doc(this.firestore, 'responders', userCredential.user.uid), {
        name,
        phone,
        responderType,
        badgeId: badgeId || '',
        organization: organization || '',
        isOnDuty: false,
        available: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error) {
      this.showAlert('Registration Failed', this.getErrorMessage(error));
      return false;
    }
  }
  

  // Login
  async login(phone: string, password: string, isResponder: boolean = false) {
    try {
      const email = this.phoneToEmail(phone);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // Get additional user data from Firestore
      const collectionName = isResponder ? 'responders' : 'citizens';
      const userDoc = doc(this.firestore, collectionName, userCredential.user.uid);
      
      // Store minimal auth info
      localStorage.setItem('currentUser', JSON.stringify({
        uid: userCredential.user.uid,
        phone,
        isResponder
      }));
      
      this.router.navigate(['/dashboard']);
      return true;
    } catch (error) {
      this.showAlert('Login Failed', this.getErrorMessage(error));
      return false;
    }
  }

  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/welcome']);
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This phone number is already registered';
      case 'auth/invalid-email':
        return 'Invalid phone number format';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}