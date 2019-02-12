import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
    const data = {
      verificationCode: form.value.verificationCode,
      newPassword: form.value.password
    };
    this.authService.resetPassword(data).subscribe(response => {
      if (response.error === false) {
        form.reset();
        this.router.navigate(['/login']).then(() => this.toastrService.success(response.message));
      }
    });
  }

}
