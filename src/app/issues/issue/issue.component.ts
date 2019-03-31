import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/util.service';
import { AppHttpService } from 'src/app/shared/app-http.service';
import { IssueDetailsResponse } from 'src/app/shared/response.interface';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/shared/models';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss', '../../../styles/_foundation-theme.scss']
})
export class IssueComponent implements OnInit {

  public users;
  public user;
  public issueId;
  public issueDetails: Issue;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private httpService: AppHttpService,
    private loaderService: NgxUiLoaderService,
    private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.loaderService.start();
    this.route.paramMap.subscribe(params => {
      // need to get project details from id
      this.issueId = params.get('id');
      if (this.issueId && typeof this.issueId !== 'undefined') {
        this.getIssueById();
      } else {
        this.router.navigate(['/issues']);
      }
    });
  }

  getIssueById() {
    this.httpService.getIssueById(this.issueId).subscribe((response: IssueDetailsResponse) => {
      this.issueDetails.issueId = response.data.issueId;
      this.issueDetails.title = response.data.title;
      this.issueDetails.assignee = response.data.assignee;
      this.issueDetails.reporter = response.data.reporter;
      this.issueDetails.priority = response.data.priority;
      this.issueDetails.project = response.data.project;
      this.issueDetails.description = response.data.description;
      this.issueDetails.watchers = response.data.watchers;
      this.issueDetails.labels = response.data.labels;
      this.issueDetails.imageUrl = response.data.imageUrl;
      this.issueDetails.createdDate = this.utilService.formatDate(response.data.createdDate);
      this.issueDetails.lastModifiedOn = this.utilService.formatDate(response.data.lastModifiedOn);
    }, err => this.router.navigate(['/issues']));
  }

}
