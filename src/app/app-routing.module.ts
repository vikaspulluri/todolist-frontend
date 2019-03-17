import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { ProjectsComponent } from './projects/projects.component';
import { IssuesComponent } from './issues/issues.component';
import { CreateIssueComponent } from './issues/create-issue/create-issue.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UserComponent } from './users/user/user.component';
import { IssueComponent } from './issues/issue/issue.component';
const appRoutes: Routes = [
  {path: 'register', component: SignUpComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'login', component: SignInComponent},
  {path: 'issues', component: IssuesComponent},
  {path: 'issues/:id', component: IssueComponent},
  {path: 'create', component: CreateIssueComponent},
  {path: 'stats', component: StatisticsComponent},
  {path: 'profile', component: UserComponent},
  {path: '', component: SignInComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
