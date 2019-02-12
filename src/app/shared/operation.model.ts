export interface Operation {
  name: String; // create, delete, edit
  msgid: String; // msg id to be performed
  listid: String; // List id that contains the msg
  previousVal: String; // incase of undoing a deleted msg, need to store the prev val in stack
}
