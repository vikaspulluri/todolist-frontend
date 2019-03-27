import { Component, OnInit } from '@angular/core';
import { UtilService } from '../shared/util.service';
import { SubscriptionService } from '../shared/subscription.service';
import { AuthService } from '../auth/shared/auth.service';
import { fadeOut } from '../shared/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    fadeOut
  ]
})
export class DashboardComponent implements OnInit {

  public greeting: string;
  public username: string;
  public userFirstName: string;
  public userId: string;
  public isRecommendationsPresent = true;
  constructor(private utilService: UtilService,
    private subService: SubscriptionService,
    private authService: AuthService) {
    this.greeting = this.utilService.getGreeting();
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.userFirstName = this.authService.getUserFirstName();
    this.userId = this.authService.getUserId();
    this.setRecommendations();
  }

  setRecommendations() {
    this.isRecommendationsPresent = this.subService.getIsRecommendationsPresent();
  }

  onCancelRecommendations() {
    this.subService.clearRecommendations();
    this.setRecommendations();
  }

}
