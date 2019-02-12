export interface MessageModel {
    title: string;
    creator?: string;
    creatorName?: string;
    listId: string;
    msgid?: string;
    addedOn?: string;
    editedOn?: string;
    editedBy?: string;
    editorName?: string;
    parent: string;
    status?: string;
    completedBy?: string;
    id?: string;
    _id?: string;
    children?: Array<MessageModel>;
    completionDate?: string;
}
