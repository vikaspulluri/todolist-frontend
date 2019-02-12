import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AppHttpService } from '../shared/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private authService: AuthService,
              private appHttpService: AppHttpService,
              private toastrService: ToastrService) { }
  email;
  firstName;
  lastName;
  ngOnInit() {
    if (!this.authService.getIsAuth()) {
      return;
    }
    this.appHttpService.getUser().subscribe(
      (response) => {
        if (!response.error && response.data) {
          this.firstName = response.data.firstName;
          this.lastName = response.data.lastName;
          this.email = response.data.email;
        }
      }
    );
  }

  onUpdateUserInfo() {
    if (!(typeof this.firstName || this.lastName)) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    let postData = {
      firstName: this.firstName,
      lastName: this.lastName
    };
    this.appHttpService.updateUserPersonalInfo(postData).subscribe(
      (result) => {
        this.toastrService.success(result.message);
        this.authService.updateAuthData(`${result.data.firstName} ${result.data.lastName}`);
      }
    );
  }

}
