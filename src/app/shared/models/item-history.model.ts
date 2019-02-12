export interface ItemHistoryModel {
    _id?: string;
    itemId: string;
    listId: string;
    parent: string;
    itemType: string;
    operatedById: string;
    operatedByName: string;
    operationName: string; // add, edit, delete, edit-status
    previliegedUsers: [string];
    creator: string;
    creatorName: string;
    createdOn: string;
    title: string;
    status?: string;
    children?: [object];
    oldObject?: {
        title: string;
        status: string;
        completionDate?: string;
        completedBy?: string;
    };
}
