import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { SocketService } from './shared/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, public socketService: SocketService) {}
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
