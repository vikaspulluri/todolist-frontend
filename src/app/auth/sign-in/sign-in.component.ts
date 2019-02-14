import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm, EmailValidator } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/shared/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocketService } from 'src/app/shared/socket.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {

  greeting = this.utilService.getGreeting();
  loading = false;
  private authStatusSubs: Subscription;
  constructor(private authService: AuthService, private utilService: UtilService,
    private spinnerService: NgxSpinnerService, private socketService: SocketService,
    private toastrService: ToastrService, private router: Router) { }
  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(data => {
      this.loading = false;
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.showSpinner();
    this.authService.login(form.value.email, form.value.password).subscribe(response => {
      this.hideSpinner();
      if (response && response.data) {
        this.toastrService.success(response.message);
        this.authService.setAuthInfo(response);
        const userData = {
          authToken: this.authService.getToken(),
          friendsList: []
        };
        this.socketService.setUser(userData);
        this.router.navigate(['/dashboard']);
      }
    }, error => this.hideSpinner());
  }

  showSpinner() {
    this.spinnerService.show();
  }

  hideSpinner() {
    this.spinnerService.hide();
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
