import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NotificationService} from '../../services/notification.service';
import {of} from 'rxjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgClass
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  role = localStorage.getItem('role');
  notifications!: string[];
  isDropdownVisible: boolean = false;

  constructor(private readonly router: Router, private readonly authService: AuthService, private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
    console.log('Notifications:', this.notifications);
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
