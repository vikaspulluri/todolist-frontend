import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsersResponse,
        ProjectResponse,
        ContribProjects,
        ProjectsResponse, IssueDetailsResponse,
        FilteredIssuesResponse,
        IssueStatsResponse,
        SimpleUser} from './response.interface';
import { Project, Issue, Notification } from './models';

@Injectable({providedIn: 'root'})
export class AppHttpService {
    public config = environment;
    constructor(private http: HttpClient) {}

    public getAllUsers() {
        return this.http.get<UsersResponse>(`${this.config.apiUrl}/api/user/all-users`);
    }

    public getUserContibProjects(userId: string) {
        return this.http.post<ContribProjects>(`${this.config.apiUrl}/api/user/stats`, {userId: userId});
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
        return this.http.post<FilteredIssuesResponse>(`${this.config.apiUrl}/api/issue/all`, filters);
    }

    public getAllLabels() {
        return this.http.get<{message: string, error: boolean, data: string[]}>(`${this.config.apiUrl}/api/issue/labels`);
    }

    // function to get statistics either for project or user
    public getIssueStats(data: {userId: string} | {projectId: string}) {
        return this.http.post<IssueStatsResponse>(`${this.config.apiUrl}/api/issue/stats`, data);
    }

    public updateIssueAssignee(user: SimpleUser, issueId: string) {
        let obj = {
            updateField: 'assignee',
            content: user,
            issueId: issueId
        };
        return this.http.post<{error: boolean, message: string, data: any[]}>(`${this.config.apiUrl}/api/issue/update`, obj);
    }

    public getWatchingIssueIds() {
        return this.http.get(`${this.config.apiUrl}/api/issue/watching`);
    }

    public updateIssueActivity(issueId: string, summary: string) {
        let activity = {issueId: issueId, summary: summary};
        return this.http.post(`${this.config.apiUrl}/api/issue/update-activity`, activity);
    }

    public addNotifications(data: Notification) {
        return this.http.post(`${this.config.apiUrl}/api/notification/add`, data);
    }
}
