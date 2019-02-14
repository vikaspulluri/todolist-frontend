import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/shared/socket.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { UtilService } from 'src/app/shared/util.service';
import { AppHttpService } from 'src/app/shared/http.service';
import { MessageModel } from 'src/app/shared/models/message.model';
import { ItemHistoryModel } from 'src/app/shared/models/item-history.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {

  selectedList;
  @Input() isListSelected;
  @Input() listSelectEvent: Observable<void>;
  @Output() incomingMessageAlert = new EventEmitter();
  @Output() backBtnClick = new EventEmitter(); // for mobile screens back button in chat window
  undoClickEvent: Subject<any> = new Subject();
  message = '';
  msgid = '';
  activeItem = null;
  isSubitemActive = false;
  subitemOperation = null;
  subitemPlaceholder = '';
  items = new Array();
  private currentUserId = this.authService.getUserId();
  private currentUserName = this.authService.getUsername();
  private itemAddedSubscription: Subscription;
  private getItemsSubcription: Subscription;
  private eventSubscription: Subscription;
  private itemEditedSubscription: Subscription;
  private itemDeletedSubscription: Subscription;
  private itemDoneSubscription: Subscription;
  private math1;
  private math2;
  private correctAnswer;
  private roboCheckAnswer;

  constructor(private toastrService: ToastrService,
    private socketService: SocketService,
    private authService: AuthService,
    private utilService: UtilService,
    private appHttpService: AppHttpService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.onItemAddedSubscription();
    this.onItemEditedSubscription();
    this.onItemDeletedSubscription();
    this.onItemDoneSubscription();
    // subscribe to event from parent component, when user clicks on list, messages will be fetched for that list
    this.eventSubscription = this.listSelectEvent.subscribe((data) => {
      this.showSpinner();
      this.selectedList = data;
      this.items = [];
      this.getItemsForSelectedList(0);
    });
  }

  /*########################### SUBSCRIPTIONS ########################### */
  /**
   * Item added subscription
   */
  onItemAddedSubscription() {
    this.itemAddedSubscription = this.socketService.onItemAdded().subscribe(data => {
      this.incomingMessageAlert.emit(data);
      this.toastrService.info(`${data.creatorName} has added an item <strong>${data.title}</strong>`, '', {enableHtml: true});
      if (this.selectedList && this.selectedList.id === data.listId) {
        const item = {
          title: data.title,
          creatorName: data.creatorName,
          listId: data.listId,
          creator: data.creator,
          addedOn: this.utilService.getTimeFromDateString(data.addedOn),
          parent: data.parent,
          id: data.id
        };
        if (data.listId === data.parent) {
          this.items.unshift(item);
        } else {
          const index = this.items.findIndex(i => i.id === data.parent);
          if (index > -1) {
            if (this.items[index].children && this.items[index].children.length > 0) {
              this.items[index].children.unshift(item);
            } else {
              this.items[index].children = [];
              this.items[index].children.unshift(item);
            }
          }
        }
      }
    });
  }

  onItemEditedSubscription() {
    this.itemEditedSubscription = this.socketService.onItemEdited().subscribe(data => {
      this.incomingMessageAlert.emit(data);
      if (this.selectedList && this.selectedList.id === data.listId) {
        const item = {
          title: data.title,
          creatorName: data.creatorName,
          listId: data.listId,
          creator: data.creator,
          id: data.id,
          addedOn: this.utilService.getTimeFromDateString(data.addedOn),
          parent: data.parent,
          status: data.staus
        };
        this.updateItemsList(item, 'edit');
        this.toastrService.info(`<strong>${data.editorName}</strong>
          has updated an item in <strong>${this.selectedList.title}</strong>!!!`, '', {enableHtml: true});
      }
    });
  }

  onItemDeletedSubscription() {
    this.itemDeletedSubscription = this.socketService.onItemDeleted().subscribe(data => {
      this.incomingMessageAlert.emit(data);
      if (this.selectedList && this.selectedList.id === data.listId) {
        this.updateItemsList(data, 'delete');
        this.toastrService.info(`<strong>${data.editorName}</strong>
          has deleted an item in <strong>${this.selectedList.title}</strong>!!!`, '', {enableHtml: true});
      }
    });
  }

  onItemDoneSubscription() {
    this.itemDoneSubscription = this.socketService.onItemStatusUpdated().subscribe(data => {
      this.incomingMessageAlert.emit(data);
      if (this.selectedList && this.selectedList.id === data.listId) {
        this.updateItemsList(data, 'status');
        this.toastrService.info(`<strong>${data.editorName}</strong>
          has completed an item in <strong>${this.selectedList.title}</strong>!!!`, '', {enableHtml: true});
      }
    });
  }

  /*############################ CRUD OPERATIONS ########################## */

  /**
   * Get items functionality goes below
   * READ OPERATION
   * @param skip: number
   */
  getItemsForSelectedList(skip) {
    this.getItemsSubcription = this.appHttpService.getItemsByListId(this.selectedList.id, skip).subscribe(response => {
      this.hideSpinner();
      if (!response || !response.data || response.data.items.length <= 0) {
        this.toastrService.info('No items to display!!!');
        return;
      }
      const items = response.data.items;
      const subItems = response.data.subItems;
      subItems.forEach((subItem, i) => {
        // tslint:disable-next-line:prefer-const
        let parent = subItem.parent;
        // tslint:disable-next-line:prefer-const
        let index = items.findIndex(item => item._id === parent);
        if (index > -1) {
          if (items[index].children && items[index].children.length > 0) {
            items[index].children.push(subItem);
          } else {
            items[index].children = [];
            items[index].children.push(subItem);
          }
        }
      });
      // tslint:disable-next-line:prefer-const
      for (let item of items) {
        // tslint:disable-next-line:prefer-const
        let incomingDate = this.utilService.getShortReadableDate(item.addedOn);
        // tslint:disable-next-line:prefer-const
        let obj: MessageModel = {
          title: item.title,
          creator: item.creator,
          creatorName: item.creatorName,
          addedOn: this.utilService.getTimeFromDateString(item.addedOn),
          listId: item.listId,
          id: item._id,
          parent: item.parent,
          status: item.status,
          completedBy: item.completedBy,
          completionDate: item.completionDate
        };
        if (item.children && item.children.length > 0) {
          obj.children = item.children;
          obj.children.map(child => {
            child.addedOn = this.utilService.getTimeFromDateString(child.addedOn);
            child.id = child._id;
            return child;
          });
        }
        /* tried to map data in such a way that showcase items in whatsapp lookalike, but failing in template
        if (typeof this.items === 'undefined' || (typeof this.items[incomingDate] === 'undefined')) {
          this.items[incomingDate] = [obj];
        } else {
          this.items[incomingDate].push(obj);
        }*/
        this.items.unshift(obj);
      }
    });
  }

  /**
   * function that handles creating new items to the list
   * CREATE OPERATION
   */
  onSendMessage() {
    if (!this.message) {
      this.toastrService.error('Message can not be empty!!!');
      return;
    }
    const data: MessageModel = {
      title: this.message,
      creator: this.currentUserId,
      creatorName: this.currentUserName,
      listId: this.selectedList.id,
      addedOn: new Date().toISOString(),
      parent: this.selectedList.id,
      status: 'open'
    };
    this.appHttpService.createItem(data).subscribe(response => {
      data.id = response.data.id;
      this.socketService.addItem(this.currentUserId, data);
      this.trackItemHistory(data, 'add', 'main');
      this.message = '';
      data.addedOn = this.utilService.getTimeFromDateString(data.addedOn);
      data.creator = this.currentUserId;
      this.items.unshift(data);
    });
  }

  // function to decide whether to show or hide chat room by default
  showChatRoom() {
    if (this.isListSelected === true) {
      return true;
    } else {
      return false;
    }
  }

  updateItemsList(updatedObject, operationName?: string) {
    const isSubItem = updatedObject.parent  === this.selectedList.id ? false : true;
    if (isSubItem) {
      const parentIndex = this.items.findIndex(item => item.id === updatedObject.parent);
      const children = this.items[parentIndex].children;
      const childIndex = children.findIndex(child => child.id === updatedObject.id);
      if (operationName === 'delete') {
        children.splice(childIndex, 1);
        return;
      } else if (operationName === 'status') {
        children[childIndex].status = 'done';
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
        this.items[index].status = 'done';
        this.items[index].completedBy = updatedObject.completedBy;
        this.items[index].completionDate = updatedObject.editedOn;
      } else {
        this.items[index].title = updatedObject.title;
      }
    }
  }

  deleteItemFromItems(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (typeof index === 'number') {
      this.items.splice(index);
    }
  }

  cleanupSubitemActiveData() {
    this.isSubitemActive = false;
    this.subitemOperation = null;
    this.subitemPlaceholder = '';
    this.msgid = '';
    this.activeItem = null;
  }

  trackItemHistory(data, operation: string, itemType: string,
    oldObject?: {title: string, status: string, completedBy?: string, completionDate?: string}) {
      const friends = this.utilService.getFriends();
      let friendsIds;
      if (friends && Array.isArray(friends) && friends.length > 0) {
        friendsIds =   friends.map(friend => friend._id);
        friendsIds.push(this.currentUserId);
      }
      const itemHistory: ItemHistoryModel = {
        title: data.title,
        status: data.status || 'open',
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
      this.socketService.trackItemHistory(this.currentUserId, itemHistory);
  }

  showSpinner() {
    this.spinnerService.show();
  }

  hideSpinner() {
    this.spinnerService.hide();
  }

  onUndoClick() {
    this.undoClickEvent.next(true);
  }

  onBackButtonClick() {
    this.backBtnClick.emit(true);
  }
  ngOnDestroy() {
    this.itemAddedSubscription.unsubscribe();
    this.itemEditedSubscription.unsubscribe();
    this.itemDeletedSubscription.unsubscribe();
    this.itemDoneSubscription.unsubscribe();
    if (this.getItemsSubcription) {
      this.getItemsSubcription.unsubscribe();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

}
