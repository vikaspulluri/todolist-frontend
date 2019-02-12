import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { NgForm } from '@angular/forms';
import { SignUpResponse } from '../response.model';
import { Router } from '@angular/router';
import { CountryService } from '../country.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [CountryService]
})
export class SignUpComponent implements OnInit, OnDestroy {
  private isLoading = false;
  private authStatusSubs: Subscription;
  private countrySubs: Subscription;
  private countries;
  private selectedCountry: {name: String, code: String, pcode: String};
  constructor(private authService: AuthService, private toastrService: ToastrService,
              private router: Router, private countryService: CountryService) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
      authStatus => this.isLoading = false
    );

    this.countrySubs = this.countryService.getCountriesLocal().subscribe(data => {
      this.countries = data;
      this.countries.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      this.selectedCountry = this.countries.filter(country => country.code === 'IN')[0];
    });
  }

  onCountryChange(event) {
    this.selectedCountry = this.countries.filter(country => country.code === event)[0];
  }

  onSignup(form: NgForm) {
    console.dir(form);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const user: User = {
      firstName: form.value.firstname,
      lastName: form.value.lastname,
      email: form.value.email,
      password: form.value.password
    };

    this.authService.createUser(user).subscribe(
      (response: SignUpResponse) => {
        this.isLoading = false;
        this.toastrService.success(response.message);
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
    this.countrySubs.unsubscribe();
  }

}
