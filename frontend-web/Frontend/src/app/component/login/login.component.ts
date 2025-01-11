import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isUser!: boolean;
  isEditor: boolean = true;
  username!: string;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  logIn(){
    this.authService.logIn(this.username, this.isEditor);
    this.router.navigate(['/posts']);
  }

}
