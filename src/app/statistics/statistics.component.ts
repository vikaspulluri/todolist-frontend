import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/shared/util.service';
import { AuthService } from '../auth/shared/auth.service';
import { AppHttpService } from '../shared/app-http.service';
import { UserStatsResponse } from '../shared/response.interface';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss', '../../styles/_foundation-theme.scss']
})
export class StatisticsComponent implements OnInit {

  public userId$;
  public userName;
  public userShortName$;
  public contributions = [];
  private currentUserId = this.authService.getUserId();
  constructor(private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private authService: AuthService,
    private httpService: AppHttpService,
    private loaderService: NgxUiLoaderService) {

  }

  ngOnInit() {
    this.loaderService.start();
    this.route.paramMap.subscribe(params => {
      // need to get project details from userId
      this.userId$ = params.get('userId') || this.currentUserId;
      this.getUserStats();
    });
  }

  getUserStats() {
    this.httpService.getUserStats(this.userId$).subscribe((response: UserStatsResponse) => {
      this.userName = response.data.firstName + ' ' + response.data.lastName;
      this.userShortName$ = this.utilService.getShortName(this.userName, 2);
      this.contributions = response.data.projectDetails;
      this.loaderService.stop();
    }, err => this.loaderService.stop());
  }

}
