import { Response } from './interface';
import { Project } from './models';

export interface UsersResponse extends Response {
    data: {
        userId: string,
        firstName: string,
        lastName: string
    }[];
}

export interface ProjectResponse extends Response {
    data: Project;
}
