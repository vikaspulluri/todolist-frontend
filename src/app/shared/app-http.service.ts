import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsersResponse, ProjectResponse, UserStatsResponse, ProjectsResponse, IssueDetailsResponse } from './response.interface';
import { Project, Issue } from './models';
import { Response } from './interface';

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

    public getProjects(filters: {title: string, users: string[]}) {
        return this.http.post<ProjectsResponse>(`${this.config.apiUrl}/api/project/all`, filters);
    }

    public createIssue(issue: Issue) {
        let postData = new FormData();
        postData.append('title', issue.title);
        postData.append('description', issue.description);
        postData.append('priority', issue.priority);
        postData.append('project', JSON.stringify(issue.project));
        postData.append('assignee', JSON.stringify(issue.assignee));
        postData.append('reporter', JSON.stringify(issue.reporter));
        if (issue.attachment) {
            postData.append('attachment', issue.attachment, issue.title);
        }
        if (issue.watchers) {
            postData.append('watchers', JSON.stringify(issue.watchers));
        }
        if (issue.labels) {
            postData.append('labels', JSON.stringify(issue.labels));
        }
        return this.http.post<IssueDetailsResponse>(`${this.config.apiUrl}/api/issue/create`, postData);
    }

    public getIssueById(issueId: string) {
        return this.http.post<IssueDetailsResponse>(`${this.config.apiUrl}/api/issue/id`, {issueId: issueId});
    }

    public getIssues(filters) {
        return this.http.post(`${this.config.apiUrl}/api/issue/all`, filters);
    }
}
