import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../shared/socket.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private socketService: SocketService) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
