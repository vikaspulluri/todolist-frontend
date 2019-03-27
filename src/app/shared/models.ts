export interface Project {
    title: string;
    ownerId: string;
    ownerName: string;
    keyCode: string;
    type: string;
    projectId?: string;
    members: {
        userId: string,
        userName: string,
        readOnly?: boolean
    }[];
}
