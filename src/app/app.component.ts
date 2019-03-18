import { Component } from '@angular/core';
import { UtilService } from './shared/util.service';
import { SubscriptionService } from './shared/subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UtilService, SubscriptionService]
})
export class AppComponent {
  title = 'issue-tracker-frontend';
}
