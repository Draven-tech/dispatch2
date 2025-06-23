import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private firestore: Firestore,
    private router: Router
  ) {}

  showAlert(header: string, message: string) {
    console.warn(`${header}: ${message}`);
  }


  // Citizen Registration
  async registerCitizen(name: string, phone: string, password: string) {
    try {
      const usersRef = collection(this.firestore, 'user-citizen');
      await addDoc(usersRef, {
        name,
        phone,
        password, // Remember to hash in production
        emergencyContacts: [],
        address: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.showAlert('Registration Failed', 'Please try again later.');
      console.error(error);
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
      const usersRef = collection(this.firestore, 'user-responder');
      await addDoc(usersRef, {
        name,
        phone,
        password,
        responderType,
        badgeId: badgeId || '',
        organization: organization || '',
        isOnDuty: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        available: true
      });
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.showAlert('Registration Failed', 'Please try again later.');
      console.error(error);
    }
  }

  // Login
  async login(phone: string, password: string, isResponder: boolean = false) {
    try {
      const collectionName = isResponder ? 'user-responder' : 'user-citizen';
      const usersRef = collection(this.firestore, collectionName);
      const q = query(usersRef, 
        where('phone', '==', phone),
        where('password', '==', password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        this.showAlert('Login Failed', 'Invalid credentials');
        return false;
      }

      // Store user data in localStorage
      const userData = querySnapshot.docs[0].data();
      localStorage.setItem('currentUser', JSON.stringify({
        id: querySnapshot.docs[0].id,
        ...userData
      }));

      this.router.navigate(['/dashboard']);
      return true;
    } catch (error) {
      this.showAlert('Login Failed', 'An error occurred');
      console.error(error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login-responder']);
  }
}