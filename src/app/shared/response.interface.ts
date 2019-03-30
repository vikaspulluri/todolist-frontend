import { Response } from './interface';
import { Project } from './models';

export interface SimpleUser {
    userId: string;
    firstName: string;
    lastName: string;
}
export interface UsersResponse extends Response {
    data: SimpleUser[];
}

export interface ProjectResponse extends Response {
    data: Project;
}

export interface ProjectsResponse extends Response {
    data: Project[];
}

export interface UserStatsResponse extends Response {
    data: {
        userId: string,
        firstName: string,
        lastName: string,
        projectDetails: {
            title: string,
            projectId: string
        }[]
    };
}
