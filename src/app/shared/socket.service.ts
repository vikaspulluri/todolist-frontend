import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as config } from '../../environments/environment';

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

  public disconnectSocket = (data) => {
    this.socket.emit('disconnect', data);
  }

}
