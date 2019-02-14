import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public isInvalidConfirmPassword = false;
  constructor(private authService: AuthService, private toastrService: ToastrService,
    private router: Router, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.spinnerService.show();
    const data = {
      verificationCode: form.value.verificationCode,
      newPassword: form.value.password
    };
    this.authService.resetPassword(data).subscribe(response => {
      this.spinnerService.hide();
      form.reset();
      if (response.error === false) {
        this.router.navigate(['/login']).then(() => this.toastrService.success(response.message));
      }
    }, err => this.spinnerService.hide());
  }

  onConfirmPasswordEntry(password, cpassword) {
    if (password !== cpassword) {
      this.isInvalidConfirmPassword = true;
      return;
    } else {
      this.isInvalidConfirmPassword = false;
    }
  }

}
