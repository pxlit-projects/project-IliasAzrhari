import  { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './component/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
