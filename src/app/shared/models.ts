export interface Project {
    title: string;
    ownerId: string;
    ownerName: string;
    keyCode: string;
    type: string;
    projectId?: string;
    createdDate?: string;
    members: {
        userId: string,
        firstName: string,
        lastName: string,
        readOnly?: boolean
    }[];
}
