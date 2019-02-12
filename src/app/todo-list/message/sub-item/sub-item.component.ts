import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { SocketService } from 'src/app/shared/socket.service';
import { UtilService } from 'src/app/shared/util.service';
import { MessageModel } from 'src/app/shared/models/message.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppHttpService } from 'src/app/shared/http.service';
import { ItemHistoryModel } from 'src/app/shared/models/item-history.model';

@Component({
  selector: 'app-sub-item',
  templateUrl: './sub-item.component.html',
  styleUrls: ['./sub-item.component.scss']
})
export class SubItemComponent implements OnInit {

  @Input() items;
  @Input() selectedList;
  @Input() itemType;
  private currentUserName = this.authService.getUsername();
  private currentUserId = this.authService.getUserId();
  private isSubitemActive = false;
  private subitemOperation = '';
  private subitemPlaceholder = '';
  private math1;
  private math2;
  private correctAnswer;
  private roboCheckAnswer;
  private activeItem;
  private msgid;
  private isKeyPressed = false;

  constructor(private authService: AuthService,
              private socketService: SocketService,
              private utilService: UtilService,
              private toastrService: ToastrService,
              private appHttpService: AppHttpService) { }

  ngOnInit() {
  }
  /*###################### Listening for ctrl+z or cmd+z events #################### */
  @HostListener('document:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
      if (($event.ctrlKey && $event.ctrlKey === true && $event.key === 'z') ||
          ($event.metaKey && $event.metaKey === true && $event.key === 'z')) {
            if (!this.isKeyPressed) {
              this.isKeyPressed = true;
              this.appHttpService.getLastOperationOnList(this.selectedList.id).subscribe(response => {
                console.log(response);
                this.undoLastAction(response.data);
              });
            }
      }
  }
  /*###################### CREATE OPERATIONS ##################### */

  /**
   * function that handles add click of item/message
   * @param msg: MessageModel
   */
  onAddMessage(msg) {
    this.subitemPlaceholder = '';
    this.updateSubitemActiveData('add', msg);
  }

  // function that handles send clicks of items(edit/add subitem)
  onItemSend() {
    if (!this.subitemPlaceholder) {
      this.toastrService.error('Item cannot be empty!!!');
      return;
    }
    const postObj: MessageModel = {
      title: this.subitemPlaceholder,
      listId: this.selectedList.id,
      parent: this.msgid,
      creator: this.currentUserId,
      creatorName: this.currentUserName,
      addedOn: new Date().toISOString(),
      status: 'open'
    };
    if (this.subitemOperation === 'edit') {
      postObj.editedOn = new Date().toISOString();
      postObj.editedBy = this.currentUserId;
      postObj.editorName = this.currentUserName;
      postObj.creator = this.activeItem.creator;
      postObj.creatorName = this.activeItem.creatorName;
      postObj.addedOn = this.activeItem.addedOn;
      postObj.id = this.activeItem.id;
      postObj.parent = this.activeItem.parent;
      this.updateItem(postObj);
      const oldObj = {
        title: this.activeItem.title,
        status: this.activeItem.status,
        completionDate: this.activeItem.completionDate,
        completedBy: this.activeItem.completedBy
      };
      // tslint:disable-next-line:prefer-const
      let itemType = this.selectedList.id === this.activeItem.parent ? 'main' : 'sub';
      this.trackItemHistory(postObj, 'edit', itemType, oldObj);
    } else if (this.subitemOperation === 'add') {
      postObj.parent = this.msgid;
      postObj.addedOn = new Date().toISOString();
      this.createItem(postObj, true);
    }
  }

  createItem(postObj: MessageModel, shouldBeTracked: Boolean = false) {
    if (shouldBeTracked === false) {
      if (postObj.parent === postObj.listId) {
        this.msgid = postObj._id;
      } else {
        this.msgid = postObj.parent;
      }
    }
    this.appHttpService.createItem(postObj).subscribe(response => {
      postObj.addedOn = this.utilService.getTimeFromDateString(postObj.addedOn);
      postObj.id = response.data.id;
      if (shouldBeTracked === false && postObj.parent === postObj.listId) {
        // undo action for main item. Since its not present in this.items, we can add this
        this.items.unshift(postObj);
      } else {
        const index = this.items.findIndex(item => this.msgid === item.id);
        if (this.items[index].children && this.items[index].children.length > 0) {
          this.items[index].children.unshift(postObj);
        } else {
          this.items[index].children = [];
          this.items[index].children.unshift(postObj);
        }
        this.socketService.addItem(this.currentUserId, postObj);
        if (shouldBeTracked === true) {
          this.trackItemHistory(postObj, 'add', 'sub');
        }
        this.cleanupSubitemActiveData();
      }
    });
  }

  // function that gets called in onItemSend(), undoAction()
  updateItem(postObj: MessageModel, isUndoOperation: boolean = false) {
    this.appHttpService.updateItem(postObj).subscribe(response => {
      this.toastrService.success(response.message);
      this.socketService.editItem(this.currentUserId, postObj);
      this.cleanupSubitemActiveData();
      this.updateItemsList(postObj, 'edit', isUndoOperation);
    });
  }

  // Subitems operations
  // function that handles edit click of item/message
  onEditMessage(msg) {
    this.subitemPlaceholder = msg.title;
    this.updateSubitemActiveData('edit', msg);
  }

  // function that handles delete click of item/message
  onDeleteMessage(msg) {
    this.subitemPlaceholder = msg.title;
    this.updateSubitemActiveData('delete', msg);
    this.math1 = this.utilService.getRandomInteger();
    this.math2 = this.utilService.getRandomInteger();
    this.correctAnswer = this.math1 + this.math2;
  }

  onUpdateStatus(msg) {
    const postObj: MessageModel = {
      title: msg.title,
      parent: msg.parent,
      listId: msg.listId,
      id: msg.id,
      status: 'done',
      completedBy: this.currentUserName,
      editedBy: this.currentUserId,
      editorName: this.currentUserName,
      editedOn: new Date().toISOString(),
      creator: msg.creator,
      creatorName: msg.creatorName,
      addedOn: msg.addedOn
    };
    this.updateItemStatus(postObj);
    // tslint:disable-next-line:prefer-const
    let itemType = this.selectedList.id === postObj.parent ? 'main' : 'sub';
    this.trackItemHistory(postObj, 'edit-status', itemType);
  }

  updateItemStatus(postObj: MessageModel) {
    this.appHttpService.updateItemStatus(postObj).subscribe(response => {
      postObj.status = response.data.status;
      this.socketService.updateItemStatus(this.currentUserId, postObj);
      this.updateItemsList(postObj, 'status');
    });
  }

  onCancelDelete() {
    this.cleanupSubitemActiveData();
  }

  /**
   * Component Util Service
   * @param action: string - 'add'/'delete'/'edit'
   * @param msg : MessageModel
   */
  updateSubitemActiveData(action, msg) {
    this.isSubitemActive = true;
    this.subitemOperation = action;
    this.msgid = msg.id;
    this.activeItem = msg;
  }

  cleanupSubitemActiveData() {
    this.isSubitemActive = false;
    this.subitemOperation = null;
    this.subitemPlaceholder = '';
    this.msgid = '';
    this.activeItem = null;
  }

  updateItemsList(updatedObject, operationName?: string, isUndoOperation: boolean = false) {
    let isSubItem;
    if (isUndoOperation === true) {
      isSubItem = updatedObject.parent === updatedObject.listId ? false : true;
    } else {
      isSubItem = updatedObject.parent  === this.msgid ? true : false;
    }
    if (isSubItem) {
      const parentIndex = this.items.findIndex(item => item.id === updatedObject.parent);
      const children = this.items[parentIndex].children;
      const childIndex = children.findIndex(child => child.id === updatedObject.id);
      if (operationName === 'delete') {
        children.splice(childIndex, 1);
        return;
      } else if (operationName === 'status') {
        children[childIndex].status = updatedObject.status || 'open';
        children[childIndex].completedBy = updatedObject.completedBy;
        children[childIndex].completionDate = updatedObject.editedOn;
      } else {
        children[childIndex].title = updatedObject.title;
      }
    } else {
      const index = this.items.findIndex(item => item.id === updatedObject.id);
      if (operationName === 'delete') {
        this.items.splice(index, 1);
        return;
      } else if (operationName === 'status') {
        this.items[index].status = updatedObject.status || 'open';
        this.items[index].completedBy = updatedObject.completedBy;
        this.items[index].completionDate = updatedObject.editedOn;
      } else {
        this.items[index].title = updatedObject.title;
      }
    }
  }

  // function to make server call once user confirms deletion of item
  onConfirmDelete() {
    // tslint:disable-next-line:triple-equals
    if (this.roboCheckAnswer != this.correctAnswer) {
      this.toastrService.info('Please answer correctly to delete!!!');
      return;
    }
    const data: MessageModel = {
      title: this.activeItem.title,
      listId: this.selectedList.id,
      parent: this.activeItem.parent,
      editedBy: this.currentUserId,
      editorName: this.currentUserName,
      id: this.activeItem.id,
      editedOn: new Date().toISOString(),
      creator: this.activeItem.creator,
      creatorName: this.activeItem.creatorName,
      addedOn: this.activeItem.addedOn,
      status: this.activeItem.status
    };
    const itemType = data.parent === this.selectedList.id ? 'main' : 'sub';
    if (itemType === 'main') {
      data.children = this.activeItem.children;
    }
    this.trackItemHistory(data, 'delete', itemType);
    this.deleteItem(data);
  }

  public deleteItem(data: MessageModel, isUndoDelete: boolean = false) {
    this.appHttpService.deleteItem(data.id).subscribe(response => {
      this.toastrService.success(response.message);
      this.socketService.deleteItem(this.currentUserId, data);
      this.updateItemsList(data, 'delete', isUndoDelete);
      this.cleanupSubitemActiveData();
      this.math1 = '';
      this.math2 = '';
      this.correctAnswer = '';
      this.roboCheckAnswer = '';
    });
  }

  // tslint:disable-next-line:max-line-length
  trackItemHistory(data, operation: string, itemType: string, oldObject?: {title: string, status: string, completedBy?: string, completionDate?: string}) {
    const friends = this.utilService.getFriends();
    let friendsIds;
    if (friends && Array.isArray(friends) && friends.length > 0) {
      friendsIds =   friends.map(friend => friend._id);
      friendsIds.push(this.currentUserId);
    }
    const itemHistory: ItemHistoryModel = {
      title: data.title,
      itemId: data.id,
      parent: data.parent,
      operatedById: this.currentUserId,
      operatedByName: this.currentUserName,
      listId: data.listId,
      itemType: itemType,
      operationName: operation,
      previliegedUsers: friendsIds || [this.currentUserId],
      creator: data.creator,
      createdOn: data.addedOn,
      creatorName: data.creatorName
    };
    if (oldObject) {
      itemHistory.oldObject = oldObject;
    }
    if (data.children) {
      itemHistory.children = data.children;
    }
    console.log(itemHistory);
    this.socketService.trackItemHistory(this.currentUserId, itemHistory);
  }

  undoLastAction(data: ItemHistoryModel) {
    if (data.operationName === 'add') {
      const postObj: MessageModel = {
        title: data.title,
        listId: data.listId,
        parent: data.parent,
        editedBy: data.operatedById,
        editorName: data.operatedByName,
        id: data.itemId,
        editedOn: new Date(data.createdOn).toISOString(),
        creator: data.creator,
        creatorName: data.creatorName,
        addedOn: data.createdOn,
        status: data.status
      };
      this.deleteItem(postObj, true);
    } else if (data.operationName === 'edit') {
      const postObj: MessageModel = {
        title: data.oldObject.title,
        listId: data.listId,
        parent: data.parent,
        status: data.status || 'open',
        editedOn: data.createdOn,
        editedBy: data.operatedById,
        editorName: data.operatedByName,
        creator: data.creator,
        creatorName: data.creatorName,
        addedOn: data.createdOn,
        id: data.itemId,
      };
      this.updateItem(postObj, true);
    } else if (data.operationName === 'edit-status') {
      const postObj: MessageModel = {
        title: data.title,
        parent: data.parent,
        listId: data.listId,
        id: data.itemId,
        status: 'open',
        completedBy: data.operatedByName,
        editedBy: data.operatedById,
        editorName: data.operatedByName,
        editedOn: data.createdOn,
        creator: data.creator,
        creatorName: data.creatorName,
        addedOn: data.createdOn
      };
      this.updateItemStatus(postObj);
    } else if (data.operationName === 'delete') {
      const postObj: MessageModel = {
        _id: data.itemId,
        title: data.title,
        listId: data.listId,
        parent: data.parent,
        creator: data.creator,
        creatorName: data.creatorName,
        addedOn: data.createdOn,
        status: data.status || 'open'
      };
      this.createItem(postObj, false);
    }
    this.socketService.undoLastAction(this.currentUserId, data._id);
    this.isKeyPressed = false;
  }
}
