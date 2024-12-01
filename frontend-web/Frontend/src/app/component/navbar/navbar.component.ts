import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  role = localStorage.getItem('role');

  constructor(private readonly router: Router, private readonly authService: AuthService) {}
  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
