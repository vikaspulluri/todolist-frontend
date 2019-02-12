export interface ListModel {
    title: String;
    description: String;
    owner: String;
    creatorName: String;
    id?: String; // since it will not be present while creating  list
    createdDate?: String;
    completionDate?: String;
    completedByName?: String;
    status?: String; // open or done
    type?: String; // list type - own or friend
    lastModifiedBy?: String;
    lastModifiedOn?: String;
    lastModifiedByName?: String;
}
