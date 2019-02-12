import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../app.config';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { MessageModel } from './models/message.model';
import { ListModel } from './models/list.model';
import { ItemHistoryModel } from './models/item-history.model';

@Injectable({
  providedIn: 'root'
})
export class AppHttpService {
  private url = config.apiUrl;
  someDataObservable: Observable<any>;
  constructor(private httpService: HttpClient) {
  }

  public getUser() {
    return this.httpService.get<{error: boolean, data: {[key: string]: any}, message: string}>(`${this.url}/api/user/@self`);
  }

  public getAllUsers() {
    return this.httpService.get<{error: boolean, data: [{[key: string]: any}], message: string}>(`${this.url}/api/user/all-users`);
  }

  public getUserNotifications() {
    return this.httpService.get<{error: boolean, data: [{[key: string]: any}], message: string}>(`${this.url}/api/user/notifications`);
  }

  public getUserFriends() {
    return this.httpService.get<{error: boolean, data: [{[key: string]: any}], message: string}>(`${this.url}/api/user/friends`);
  }

  public sendFeedback(data) {
    return this.httpService.post<{error: boolean, data: [{[key: string]: any}], message: string}>(`${this.url}/api/user/feedback`, data);
  }

  public updateUserPersonalInfo(data) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.post<{error: boolean, data: {firstName: string, lastName: string}, message: string}>(`${this.url}/api/user/update`, data);
  }

  // data should be a object {title: String, description: String, id: String}
  public createTodoList(data: ListModel) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.post<{error: boolean, data: {title: string, description: string, owner: string, isEditing: boolean, createdDate: string, creatorName?: string}, message: string}>(`${this.url}/api/list/create`, data);
  }

  // should get todoLists of current user
  public getOwnTodoLists() {
    // tslint:disable-next-line:max-line-length
    return this.httpService.get<{error: boolean, data: [{id: string, title: string, creatorName: string, completedByName: string, description: string, isEditing: boolean, owner: string, status: string, createdDate: string, completionDate?: string}], message: string}>(`${this.url}/api/list/all`);
  }

  public getFriendsTodoLists(friends) {
    const obj = {
      friends: friends
    };
    // tslint:disable-next-line:max-line-length
    this.someDataObservable = this.httpService.post<{error: boolean, data: [{id: string, title: string, creatorName: string, description: string, owner: string, status: string, createdDate: string, completionDate?: string}], message: string}>(`${this.url}/api/list/friends-lists`, obj).pipe(share());
    return this.someDataObservable;
  }

  public updateTodoList(list: ListModel) {
   // tslint:disable-next-line:max-line-length
   return this.httpService.post<{error: boolean, data: {id: string, title: string, description: string, owner: string, status: string, createdDate: string, creatorName?: string, lastModifiedByName?: string, completionDate?: string}, message: string}>(`${this.url}/api/list/update/${list.id}`, list);
  }

  public updateTodoListStatus(list: {id: string, status: string, completedByName: string, owner: string}) {
   // tslint:disable-next-line:max-line-length
   return this.httpService.post<{error: boolean, data: {id: string, title: string, description: string, completionDate?: string, owner: string, status: string, createdDate: string}, message: string}>(`${this.url}/api/list/update-status/${list.id}`, list);
  }

  public deleteTodoList(id) {
    return this.httpService.post<{error: boolean, message: string}>(`${this.url}/api/list/delete`, {id: id});
  }

  // Item functionalities
  public getItemsByListId(listId, skip) {
    const data = {
      listId: listId,
      itemsToSkip: skip
    };
    // tslint:disable-next-line:max-line-length
    return this.httpService.post<{error: boolean, message: string, data: {items: [MessageModel], subItems: [MessageModel]}}>(`${this.url}/api/item/all`, data);
  }

  public createItem(data) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.post<{error: boolean, message: string, data: {id: string, title: string, creator: string}}>(`${this.url}/api/item/create`, data);
  }

  public updateItem(data) {
    return this.httpService.post<{error: boolean, message: string, data: [{[key: string]: any}]}>(`${this.url}/api/item/update`, data);
  }

  public deleteItem(id) {
    return this.httpService.post<{error: boolean, message: string}>(`${this.url}/api/item/delete`, {id: id});
  }

  public updateItemStatus(data: MessageModel) {
    return this.httpService.post<{error: boolean, message: string, data: {status: string}}>(`${this.url}/api/item/update-status`, data);
  }

  public getLastOperationOnList(listId: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpService.post<{error: boolean, message: string, data: ItemHistoryModel}>(`${this.url}/api/item-history/last-activity`, {listId: listId});
  }

}
