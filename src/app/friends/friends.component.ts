import { Component, OnInit } from '@angular/core';
import { AppHttpService } from '../shared/http.service';
import { SocketService } from '../shared/socket.service';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  constructor(private appHttpService: AppHttpService, private socketService: SocketService,
    private authService: AuthService, private toastrService: ToastrService) { }
  allUsers = [];
  currentUserId = this.authService.getUserId();
  sentRequests = [];
  receivedRequests = [];
  friends = [];
  ngOnInit() {

    this.subscribeToReceiveFriendRequest();
    this.subscribeToAcceptFriendRequest();
    this.getAllUsers();
    this.getUserProfile();
  }

  subscribeToReceiveFriendRequest() {
    this.socketService.receiveFriendRequest().subscribe(
      (data) => {
        this.toastrService.success(`You have received friend request from ${data.requesterName}`);
        const index = this.allUsers.map((item) => item._id).indexOf(data.requesterId);
        this.allUsers[index].friendStatus = 'Request Received';
        this.allUsers[index].class = 'received';
        this.receivedRequests.push(data);
        console.dir(data);
      }
    );
  }

  subscribeToAcceptFriendRequest() {
    this.socketService.acceptedFriendRequest().subscribe(
      (data) => {
        this.toastrService.success(`Your friend request accepted by ${data.receiverName}`);
        this.friends.push({name: data.receiverName, id: data.receiverId});
        // need to update request status in sent requests
        const index = this.sentRequests.map(req => req.receiverId).indexOf(data.receiverId);
        this.sentRequests[index].status = 'Accepted';
      }
    );
  }

  getAllUsers() {
    this.appHttpService.getAllUsers().subscribe(
      (response) => {
        if (!response.data) {
          this.allUsers = [];
        } else {
          // tslint:disable-next-line:prefer-const
          for (let user of response.data) {
            if (user._id !== this.currentUserId) {
              user.friendStatus = 'Add Friend';
              user.class = 'default';
              this.allUsers.push(user);
            }
          }
        }
      }
    );
  }

  getUserProfile() {
    this.appHttpService.getUser().subscribe(
      response => {
        if (response.data) {
          this.sentRequests = response.data.sentRequests;
          this.receivedRequests = response.data.receivedRequests;
          const sentRequests = this.sentRequests.map((request) => {
            return request.receiverId;
          });
          const receivedRequests = this.receivedRequests.map((request) => {
            return request.requesterId;
          });
          this.friends = response.data.friends.map(friend => {
            // tslint:disable-next-line:prefer-const
            let obj = {
              name: friend.firstName + ' ' + friend.lastName,
              id: friend._id
            };
            return obj;
          });
          for (let i = 0; i < this.allUsers.length; i++) {
            if (sentRequests.includes(this.allUsers[i]._id)) {
              this.allUsers[i].friendStatus = 'Request Sent';
              this.allUsers[i].class = 'sent';
            }
            if (receivedRequests.includes(this.allUsers[i]._id)) {
              this.allUsers[i].friendStatus = 'Request Received';
              this.allUsers[i].class = 'received';
            }
          }
        }
      }
    );
  }

  onAddFriend(user) {
    const reqObj = {
      requesterId: this.currentUserId,
      requesterName: this.authService.getUsername(),
      receiverId: user._id,
      receiverName: user.firstName + ' ' + user.lastName,
      status: 'Pending'
    };
    this.socketService.sendFreindRequest(reqObj);
    // ideally need to subscribe to event from socket and then do the stuff
    const index = this.allUsers.map((item) => item._id).indexOf(user._id);
    this.allUsers[index].friendStatus = 'Request Sent';
    this.allUsers[index].class = 'sent';

    this.sentRequests.push(reqObj);
  }

  onAcceptFriendRequest(request) {
    this.socketService.acceptFriendRequest(request);
    // need to find request id in receivedRequests and change status to accepted
    const index = this.receivedRequests.map(req => req.requesterId).indexOf(request.requesterId);
    this.receivedRequests[index].status = 'Accepted';
    const friend = {name: request.requesterName, id: request.requesterId};
    this.friends.push(friend);
  }
}
