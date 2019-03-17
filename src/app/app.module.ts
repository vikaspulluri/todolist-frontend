import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { MiniSidebarComponent } from './mini-sidebar/mini-sidebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';
import { IssuesComponent } from './issues/issues.component';
import { IntroBoardComponent } from './issues/intro-board/intro-board.component';
import { ProjectsComponent } from './projects/projects.component';
import { CreateIssueComponent } from './issues/create-issue/create-issue.component';
import { FilterPanelComponent } from './projects/filter-panel/filter-panel.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { IssueComponent } from './issues/issue/issue.component';


@NgModule({
  declarations: [
    AppComponent,
    MiniSidebarComponent,
    SidebarComponent,
    UsersComponent,
    UserComponent,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    PageNotFoundComponent,
    WelcomeMessageComponent,
    IssuesComponent,
    IntroBoardComponent,
    ProjectsComponent,
    CreateIssueComponent,
    FilterPanelComponent,
    StatisticsComponent,
    IssueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
