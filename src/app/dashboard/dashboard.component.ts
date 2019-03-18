import { Component, OnInit } from '@angular/core';
import { UtilService } from '../shared/util.service';
import { SubscriptionService } from '../shared/subscription.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('true', style({
        opacity: 1,
        display: 'block'
      })),
      state('false', style({
        opacity: 0,
        display: 'none'
      })),
      transition('true => false', [
        animate('1s')
      ]),
    ])
  ]
})
export class DashboardComponent implements OnInit {

  public greeting: string;
  public username: string;
  public isRecommendationsPresent;
  constructor(private utilService: UtilService, private subService: SubscriptionService) {
    this.greeting = this.utilService.getGreeting();
  }

  ngOnInit() {
    this.username = 'Vikas Pulluri';
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
