import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SocketService } from '../shared/socket.service';
import { NgForm } from '@angular/forms';
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-mini-sidebar',
  templateUrl: './mini-sidebar.component.html',
  styleUrls: ['./mini-sidebar.component.scss']
})
export class MiniSidebarComponent implements OnInit {

  username;
  notificationBadge = false;
  notifications;
  constructor(private authService: AuthService,
              private socketService: SocketService,
              private utilService: UtilService) { }

  ngOnInit() {
    this.username = this.authService.getUsername();

    this.authService.getAuthStatusListener().subscribe(
      result => this.username = this.authService.getUsername()
    );

    this.socketService.notificationAlert().subscribe(
      data => this.notificationBadge = true
    );
  }
  onListCreated(form: NgForm) {
    if (form.invalid) {return; }
    this.utilService.createList(form.value);
    form.resetForm();
  }

  onLogout() {
    this.authService.logout();
  }

  onCloseModal() {
    this.utilService.hideModal('.item-creation-container');
  }
}
