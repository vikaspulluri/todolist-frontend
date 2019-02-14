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
  public countries;
  public selectedCountry: {name: string, code: string, pcode: string};
  public isInvalidConfirmPassword = false;
  constructor(private authService: AuthService, private toastrService: ToastrService,
              private router: Router, private countryService: CountryService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
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
    if (form.invalid) {
      return;
    }
    this.showSpinner();
    const user: User = {
      firstName: form.value.firstname,
      lastName: form.value.lastname,
      email: form.value.email,
      password: form.value.password,
      country: this.selectedCountry.name
    };

    if (form.value.phone) {
      user.phone = this.selectedCountry.pcode + ' ' + form.value.phone;
    }

    this.authService.createUser(user).subscribe(
      (response: SignUpResponse) => {
        this.hideSpinner();
        this.toastrService.success(response.message);
        this.router.navigate(['/login']);
      },
      (error) => {
        this.hideSpinner();
      }
    );
  }

  showSpinner() {
    this.spinnerService.show();
  }

  hideSpinner() {
    this.spinnerService.hide();
  }

  onConfirmPasswordEntry(password, cpassword) {
    if (password !== cpassword) {
      this.isInvalidConfirmPassword = true;
      return;
    } else {
      this.isInvalidConfirmPassword = false;
    }
  }

  ngOnDestroy(): void {
    this.countrySubs.unsubscribe();
  }

}
