import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsersResponse, ProjectResponse, UserStatsResponse } from './response.interface';
import { Project } from './models';

@Injectable({providedIn: 'root'})
export class AppHttpService {
    public config = environment;
    constructor(private http: HttpClient) {}

    public getAllUsers() {
        return this.http.get<UsersResponse>(`${this.config.apiUrl}/api/user/all-users`);
    }

    public getUserStats(userId: string) {
        return this.http.post<UserStatsResponse>(`${this.config.apiUrl}/api/user/stats`, {userId: userId});
    }

    public createProject(project: Project) {
        return this.http.post<ProjectResponse>(`${this.config.apiUrl}/api/project/create`, project);
    }

    public getProject(projectId: string) {
        return this.http.post<ProjectResponse>(`${this.config.apiUrl}/api/project/id`, {projectId: projectId});
    }
}
