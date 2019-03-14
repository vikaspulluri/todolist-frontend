import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProjectComponent } from './projects/project/project.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'project/:id',
    component: ProjectComponent
  },
  {
    path: 'stats',
    component: StatisticsComponent
  },
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
