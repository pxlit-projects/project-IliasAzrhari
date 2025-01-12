import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor() { }

  logIn(username: string, isEditor: boolean) {
    localStorage.setItem('username', username);
    localStorage.setItem('role', isEditor ? 'editor' : 'user');
  }

  logOut(){
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  isLoggedIn(): boolean {
    const username = localStorage.getItem('username');
    return username !== 'undefined';
  }
}
