import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppHttpService } from '../shared/http.service';
import { UtilService } from '../shared/util.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { SocketService } from '../shared/socket.service';
import { ListModel } from '../shared/models/list.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {

  lists;
  friendsLists;
  friends;
  subscription: Subscription;
  listCreateSubscription: Subscription;
  createListSubscription: Subscription;
  editListSubscription: Subscription;
  deleteListSubscription: Subscription;
  isListSelected = false;
  onListSelectEvent = new Subject();
  // tslint:disable-next-line:max-line-length
  selectedList: ListModel;
  currentUsername = this.authService.getUsername();
  currentUserId = this.authService.getUserId();
  private isListActive = false;
  private listItemOperation = ''; // possible values are edit, delete
  private listItemPlaceholder = '';
  private listItemDescriptionPlaceholder = '';
  private listItemId = '';
  private correctAnswer;
  private roboCheckAnswer;
  private math1;
  private math2;
  constructor(private appHttpService: AppHttpService,
              private utilService: UtilService,
              private toastrService: ToastrService,
              private authService: AuthService,
              private socketService: SocketService) { }

  ngOnInit() {
    // Subscribe to get todolists created by user
    this.getOwnTodoLists();

    // Wait until all friends ids gets loaded in online-friends component, then execute this
    this.subscription = this.utilService.getStatusChangeListener().subscribe(data => {
      this.getFriendsTodoLists();
    });

    if (this.utilService.isFriendsSet === true) {
      this.getFriendsTodoLists();
    }

    this.subscribeToListInteractions();

    // Listen to create todo list form submission, act with the data
    this.listCreateSubscription = this.utilService.getListCreateListener().subscribe(data => {
      // tslint:disable-next-line:prefer-const
      let obj: ListModel = {
        title: data.title,
        description: data.description,
        owner: this.currentUserId,
        creatorName: this.currentUsername
      };
      this.appHttpService.createTodoList(obj).subscribe(docs => {
        this.utilService.hideModal('.item-creation-container');
        this.toastrService.success(docs.message);
        docs.data.createdDate = this.utilService.getShortReadableDate(docs.data.createdDate);
        docs.data.creatorName = this.currentUsername;
        if (this.lists && this.lists.length && this.lists.length > 0) {
          this.lists.push(docs.data);
        } else {
          this.lists = [docs.data];
        }
        this.socketService.createList(this.currentUserId, docs.data);
      });
    });
  }

  // function to subscribe to multiple interactions made to lists by friends
  subscribeToListInteractions() {
    this.createListSubscription = this.socketService.onListCreated().subscribe(data => {
      this.lists.push(data);
      this.toastrService.info(`${data.creatorName} has created a list <strong>${data.title}</strong>`, '', {enableHtml: true});
    });
    this.editListSubscription = this.socketService.onListEdited().subscribe(data => {
      const index = this.lists.findIndex(list => list.id === data.id);
      if (index > -1) {
        this.lists[index].title = data.title;
        this.lists[index].description = data.description;
      }
      this.toastrService.info(`${data.lastModifiedByName} has updated a list <strong>${data.title}</strong>`, '', {enableHtml: true});
    });
    this.deleteListSubscription = this.socketService.onListDeleted().subscribe(data => {
      const index = this.lists.findIndex(list => list.id === data.id);
      if (index > -1) {
        this.lists.splice(index, 1);
      }
      this.toastrService.info(`${data.lastModifiedByName} has deleted a list <strong>${data.title}</strong>`, '', {enableHtml: true});
    });
  }

  // function that executes on clicking the list
  onListSelected(list) {
    this.isListSelected = true;
    this.selectedList = list;
    this.emitEventToChild(this.selectedList);
  }

  // function that emits event to message component after selecting a list. So that it will fetch messages
  emitEventToChild(selectedList) {
    this.onListSelectEvent.next(selectedList);
  }

  // function to retrieve lists created by self
  getOwnTodoLists() {
    this.appHttpService.getOwnTodoLists().subscribe(response => {
      this.lists = response.data.map(list => {
        const obj: ListModel =  {
          title: list.title,
          description: list.description,
          createdDate: this.utilService.getShortReadableDate(list.createdDate),
          owner: list.owner,
          creatorName: list.creatorName,
          id: list.id,
          status: list.status || 'open',
          type: 'own',
          completedByName: list.completedByName
        };
        if (list.completionDate) {
          obj.completionDate = this.utilService.getShortReadableDate(list.completionDate);
        }
        return obj;
      });
    });
  }

  // function to retrieve lists created by friends. Need to wait until friends ids get fetched in online-friends component
  getFriendsTodoLists() {
    this.friends = this.utilService.getFriends().map(friend => friend._id);
    this.socketService.setFriends(this.friends);
    this.appHttpService.getFriendsTodoLists(this.friends).subscribe(docs => {
      this.friendsLists = docs.data.map(list => {
        return {
          title: list.title,
          description: list.description,
          createdDate: this.utilService.getShortReadableDate(list.createdDate),
          owner: list.owner,
          creatorName: list.creatorName,
          id: list.id,
          status: list.status || 'open',
          type: 'friend',
          completedByName: list.completedByName,
          completionDate: list.completionDate ? this.utilService.getShortReadableDate(list.completionDate) : ''
        };
      });
      this.lists = [...this.lists, ...this.friendsLists];
    });
  }

  // function to show list creation modal when user clicks on "link" text. Appear on when user don't have any lists
  onListCreate() {
    this.utilService.showModal('.item-creation-container');
  }

  // on clicking the edit icon in list, it will execute
  onListEdit(event, list) {
    event.preventDefault();
    event.stopPropagation();
    this.isListActive = true;
    this.listItemOperation = 'edit';
    this.listItemPlaceholder = list.title;
    this.listItemDescriptionPlaceholder = list.description;
    this.listItemId = list.id;
  }

  // function that executes when user clicks on delete icon on list
  onListDelete(id: string, title: string) {
    this.listItemOperation = 'delete';
    this.isListActive = true;
    this.listItemPlaceholder = title;
    this.listItemId = id;
    this.math1 = this.utilService.getRandomInteger();
    this.math2 = this.utilService.getRandomInteger();
    this.correctAnswer = this.math1 + this.math2;
  }

  onConfirmDelete() {
    // tslint:disable-next-line:triple-equals
    if (this.roboCheckAnswer != this.correctAnswer) {
      this.toastrService.info('Please answer correctly to delete!!!');
      return;
    }
    this.appHttpService.deleteTodoList(this.listItemId).subscribe(data => {
      // tslint:disable-next-line:max-line-length
      this.socketService.deleteList(this.currentUserId, {title: this.listItemPlaceholder, lastModifiedByName: this.currentUsername, id: this.listItemId});
      this.toastrService.success(data.message);
      const index = this.lists.findIndex((list) => list.id === this.listItemId);
      if (index >= 0) {
        this.lists.splice(index, 1);
      }
      this.cleanupActiveList();
      this.math1 = '';
      this.math2 = '';
      this.roboCheckAnswer = '';
      this.correctAnswer = '';
    });
  }

  onCancelDelete() {
    this.cleanupActiveList();
  }

  // function that executes when user clicks on update button, will update the title and description of list
  onListSave(oldList) {
    if (this.listItemPlaceholder === '' || this.listItemDescriptionPlaceholder === '') {
      this.toastrService.warning('Field values can not be empty. Please fill them!!!');
      return;
    }
    this.selectedList = oldList;
    const obj: ListModel = {
      id: oldList.id,
      title: this.listItemPlaceholder,
      description: this.listItemDescriptionPlaceholder,
      owner: oldList.creator,
      creatorName: oldList.creatorName,
      lastModifiedBy: this.currentUserId,
      lastModifiedByName: this.currentUsername,
      lastModifiedOn: new Date().toISOString()
    };
    this.appHttpService.updateTodoList(obj).subscribe(doc => {
      this.toastrService.success(doc.message);
      this.selectedList.title = doc.data.title;
      this.selectedList.description = doc.data.description;
      this.selectedList.status = doc.data.status;
      this.selectedList.lastModifiedByName = doc.data.lastModifiedByName;
      this.selectedList.creatorName = doc.data.creatorName;
      this.socketService.EditList(this.currentUserId, this.selectedList);
      this.cleanupActiveList();
      this.selectedList = null;
    });
  }

  // function that executes when user updates the status to done
  onUpdateListStatus(list) {
    const l = {
      id: list.id,
      status: 'done',
      owner: list.owner,
      completedByName: this.currentUsername
    };
    this.selectedList = list;
    this.appHttpService.updateTodoListStatus(l).subscribe(response => {
      this.toastrService.success(response.message);
      this.selectedList.status = response.data.status;
      this.selectedList.completedByName = this.currentUsername;
      this.selectedList.creatorName = list.creatorName;
      this.selectedList.completionDate = this.utilService.getShortReadableDate(response.data.completionDate);
    });
  }

  // function to receive incoming messages
  onIncomingMessage(data) {
    console.log(data);
  }

  // function to decide whether to show empty box or not
  showEmptyChatRoom() {
    return true ? ((this.lists && this.lists.length > 0) || (this.friendsLists && this.friendsLists.length)) : false;
  }

  // function to clean active list after performing edit/delete/done operations
  cleanupActiveList() {
    this.isListActive = false;
    this.listItemOperation = '';
    this.listItemDescriptionPlaceholder = '';
    this.listItemPlaceholder = '';
  }

  // unsubscribe to all subscriptions once the component gets destroyed
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.listCreateSubscription.unsubscribe();
    this.createListSubscription.unsubscribe();
    this.editListSubscription.unsubscribe();
    this.deleteListSubscription.unsubscribe();
  }
}
