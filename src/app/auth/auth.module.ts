import { NgModule } from '@angular/core';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        SignInComponent,
        SignUpComponent,
        WelcomeComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ToastrModule.forRoot(),
        AngularFontAwesomeModule,
        RouterModule,
        NgxSpinnerModule,
        HttpClientModule,
        AuthRoutingModule
    ],
    exports: [
        SignInComponent,
        SignUpComponent,
        WelcomeComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ]
})

export class AuthModule {}
