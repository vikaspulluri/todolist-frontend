import { SimpleUser } from './response.interface';

export interface Project {
    title: string;
    ownerId: string;
    ownerName: string;
    keyCode: string;
    type: string;
    projectId?: string;
    createdDate?: string;
    members?: {
        userId: string,
        firstName: string,
        lastName: string,
        readOnly?: boolean
    }[];
}

export interface Issue {
    issueId?: string;
    title: string;
    description: string;
    priority: string;
    issueType: string;
    attachment?: File;
    status?: string;
    createdDate?: string;
    lastModifiedOn?: string;
    imageUrl?: string; // will come from server response
    project: {
        projectId: string,
        title: string
    };
    assignee: SimpleUser;
    reporter: SimpleUser;
    watchers?: SimpleUser[];
    labels?: string[];
    activity?: {
        summary: string,
        dateLog: string
    }[];
}
