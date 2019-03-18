import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AuthModule } from './auth/auth.module';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProjectComponent } from './projects/project/project.component';
import { IssuesComponent } from './issues/issues.component';
import { IssueComponent } from './issues/issue/issue.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { IssueFormComponent } from './issues/issue-form/issue-form.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    ProjectsComponent,
    StatisticsComponent,
    ProjectComponent,
    IssuesComponent,
    IssueComponent,
    ContactUsComponent,
    NotificationsComponent,
    IssueFormComponent,
    OverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    AngularFontAwesomeModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
