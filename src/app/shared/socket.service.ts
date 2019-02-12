import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { config } from '../app.config';
import { MessageModel } from './models/message.model';
import { ItemHistoryModel } from './models/item-history.model';
@Injectable()
export class SocketService {
  private url = config.apiUrl;
  private socket;
  public isDisconnected = false;
  constructor(private http: HttpClient) {
    this.socket = io.connect(this.url, {'forceNew': false, transports: ['websocket'], upgrade: false});
  }

  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', data => {
        observer.next(data);
      }); // end socket
    }); // end observable.create
  } // end verifyUser

  public setUser = (data) => {
    this.socket.emit('setUser', data);
  } // end setUser

  public setFriends = (data) => {
    this.socket.emit('setFriends', data);
  } // end setFriends

  public getOnlineUserlist = () => {
    this.socket.emit('getOnlineUsers', '');
  }
  public onlineUserList = () => {
    return Observable.create(observer => {
      this.socket.on('onlineUserList', userList => {
        observer.next(userList);
      });
    });
  } // end onlineUserList

  public createList = (roomId, data) => {
    this.socket.emit('addList', roomId, data);
  } // on creating a list trigger this event

  public onListCreated = () => {
    return Observable.create(observer => {
      this.socket.on('listCreated', data => {
        observer.next(data);
      });
    });
  } // end OnListCreated

  public EditList = (roomId, data) => {
    this.socket.emit('editList', roomId, data);
  } // on editing a list trigger this event

  public onListEdited = () => {
    return Observable.create(observer => {
      this.socket.on('listEdited', data => {
        observer.next(data);
      });
    });
  } // end OnListEdited

  public deleteList = (roomId, data) => {
    this.socket.emit('deleteList', roomId, data);
  } // on deleting a list trigger this event

  public onListDeleted = () => {
    return Observable.create(observer => {
      this.socket.on('listDeleted', data => {
        observer.next(data);
      });
    });
  } // end OnListDeleted

  public sendFreindRequest = (reqData) => {
    this.socket.emit('sendFriendRequest', reqData);
  } // end sendFriendRequest

  public receiveFriendRequest = () => {
    return Observable.create(observer => {
      this.socket.on('receivedFriendRequest', data => {
        observer.next(data);
      });
    });
  }

  public notificationAlert = () => {
    return Observable.create(observer => {
      this.socket.on('notificationAlert', data => {
        observer.next(data);
      });
    });
  }

  public acceptFriendRequest = (reqData) => {
    this.socket.emit('acceptFriendRequest', reqData);
  } // end acceptFriendRequest

  public acceptedFriendRequest = () => {
    return Observable.create(observer => {
      this.socket.on('acceptedFriendRequest', data => {
        observer.next(data);
      });
    });
  }

  /** Items related interactions */
  public addItem(roomId, data: MessageModel) {
    this.socket.emit('addItem', roomId, data);
  }

  // Subscribe to itemadded event in respective component, when your friend adds one, will get notified
  public onItemAdded() {
    return Observable.create(observer => {
      // tslint:disable-next-line:no-shadowed-variable
      this.socket.on('itemAdded', (data: MessageModel) => {
        observer.next(data);
      });
    });
  }

  public editItem(roomId, data: MessageModel) {
      this.socket.emit('editItem', roomId, data);
  }

  public onItemEdited() {
    return Observable.create(observer => {
      this.socket.on('itemEdited', (data: MessageModel) => {
        observer.next(data);
      });
    });
  }

  public deleteItem(roomId, data: MessageModel) {
    this.socket.emit('deleteItem', roomId, data);
  }

  public onItemDeleted() {
    return Observable.create(observer => {
      this.socket.on('itemDeleted', (data: MessageModel) => {
          observer.next(data);
        });
    });
  }

  public updateItemStatus(roomId, data: MessageModel) {
    this.socket.emit('updateItemStatus', roomId, data);
  }

  public onItemStatusUpdated() {
    return Observable.create(observer => {
      this.socket.on('itemStatusUpdated', (data: MessageModel) => {
        observer.next(data);
      });
    });
  }

  public trackItemHistory(roomId, data: ItemHistoryModel) {
    this.socket.emit('trackItemHistory', roomId, data);
  }

  // triggers when user clicks on undo/ctrl + z
  public undoLastAction(roomId, itemId) {
    this.socket.emit('undoLastAction', roomId, itemId);
  }

  public undoneItem() {
    return Observable.create(observer => {
      this.socket.on('undoneItem', ((data: ItemHistoryModel) => {
        observer.next(data);
      }));
    });
  }


  public disconnectSocket = (data) => {
    this.socket.emit('disconnect', data);
  }

}
