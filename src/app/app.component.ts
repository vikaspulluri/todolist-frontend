import { Component } from '@angular/core';
import { UtilService } from './shared/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UtilService]
})
export class AppComponent {
  title = 'issue-tracker-frontend';
}
