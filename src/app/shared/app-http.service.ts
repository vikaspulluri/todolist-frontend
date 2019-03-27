import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsersResponse, ProjectResponse } from './response.interface';
import { Project } from './models';

@Injectable({providedIn: 'root'})
export class AppHttpService {
    public config = environment;
    constructor(private http: HttpClient) {}

    public getAllUsers() {
        return this.http.get<UsersResponse>(`${this.config.apiUrl}/api/user/all-users`);
    }

    public createProject(project: Project) {
        return this.http.post<ProjectResponse>(`${this.config.apiUrl}/api/project/create`, project);
    }
}
