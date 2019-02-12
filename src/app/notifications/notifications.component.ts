import { Component, OnInit } from '@angular/core';
import { AppHttpService } from '../shared/http.service';
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications;
  constructor(private appHttpService: AppHttpService, private utilService: UtilService) { }
  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.appHttpService.getUserNotifications().subscribe(
      result => {
        this.notifications = result.data.map(item => {
          // tslint:disable-next-line:prefer-const
          let obj = {
            message: item.message,
            arrived: this.utilService.getReadableDate(item.arrived)
          };
          return obj;
        });
      }
    );
  }

}
