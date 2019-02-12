import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SocketService } from '../shared/socket.service';
import { AppHttpService } from '../shared/http.service';
import { DOCUMENT } from '@angular/platform-browser';
import { UtilService } from '../shared/util.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-online-friends',
  templateUrl: './online-friends.component.html',
  styleUrls: ['./online-friends.component.scss']
})
export class OnlineFriendsComponent implements OnInit, OnDestroy {

  onlineUsers;
  onlineFriends;
  public onlineUserSubscription: Subscription;
  constructor(private socketService: SocketService,
              private appHttpService: AppHttpService,
              private utilService: UtilService
              ) { }

  ngOnInit() {
    this.socketService.getOnlineUserlist();
    this.onlineUserSubscription = this.socketService.onlineUserList().subscribe(
      (list) => {
        this.onlineUsers = list;
        this.updateOnlineFriends();
      }
    );
  }

  updateOnlineFriends() {
    this.appHttpService.getUserFriends().subscribe(
      result => {
        const friends = result.data;
        this.utilService.setFriends(friends);
        const onlineUserIds = this.onlineUsers.map(user => user.userId);
        this.onlineFriends = friends.map(friend => {
          // tslint:disable-next-line:prefer-const
          let obj: {name: string, status: string} = {name: '', status: ''};
          obj.name = friend.firstName + ' ' + friend.lastName;
          obj.status = onlineUserIds.includes(friend._id) ? 'online' : 'offline';
          return obj;
        });
        console.log(this.onlineFriends);
      }
    );
  }

  ngOnDestroy() {
    this.onlineUserSubscription.unsubscribe();
  }

}
