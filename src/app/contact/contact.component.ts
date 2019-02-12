import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AppHttpService } from '../shared/http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  experience = ['worst', 'ok', 'good', 'excellent'];
  feedback;
  rating = 'good';
  constructor(private authService: AuthService, private appHttpService: AppHttpService,
              private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  onContactFormSubmit(contactForm: NgForm) {
    if (contactForm.invalid) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    let data = {
      experience: this.rating,
      feedback: this.feedback,
      userName: this.authService.getUsername()
    };
    this.appHttpService.sendFeedback(data).subscribe(
      (result) => {
        this.toastrService.success(result.message);
        this.router.navigate(['/dashboard']);
      }
    );
  }
}
