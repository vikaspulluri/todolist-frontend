import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProjectComponent } from './projects/project/project.component';
import { IssuesComponent } from './issues/issues.component';
import { IssueComponent } from './issues/issue/issue.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { IssueFormComponent } from './issues/issue-form/issue-form.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'project/:id', component: ProjectComponent},
  {path: 'issues', component: IssuesComponent},
  {path: 'issue/:id', component: IssueComponent},
  {path: 'issue-form', component: IssueFormComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'statistics/:user', component: StatisticsComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
