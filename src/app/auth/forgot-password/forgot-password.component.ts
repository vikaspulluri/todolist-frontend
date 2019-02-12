import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  private email;
  constructor(private authService: AuthService, private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService, private router: Router) { }
  ngOnInit() {
  }

  onFormSubmit() {
    if (typeof this.email === 'undefined' || this.email === '') {
      return;
    }
    this.spinnerService.show();
    this.authService.requestPassword(this.email).subscribe(response => {
      this.spinnerService.hide();
      this.router.navigate(['/reset-password']).then(() => this.toastrService.success(response.message));
    });
  }

}
