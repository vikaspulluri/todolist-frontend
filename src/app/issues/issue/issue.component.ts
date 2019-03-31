import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/util.service';
import { AppHttpService } from 'src/app/shared/app-http.service';
import { IssueDetailsResponse } from 'src/app/shared/response.interface';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/shared/models';
import { textEditorConfig } from 'src/app/shared/libraries.config';

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
  public textEditorConfig = textEditorConfig;
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
      this.issueDetails = {
        issueId: response.data.issueId,
        title: response.data.title,
        assignee: response.data.assignee,
        reporter: response.data.reporter,
        priority: response.data.priority,
        project: response.data.project,
        description: response.data.description,
        watchers: response.data.watchers,
        labels: response.data.labels,
        imageUrl: response.data.imageUrl,
        createdDate: this.utilService.formatDate(response.data.createdDate),
        lastModifiedOn: this.utilService.formatDate(response.data.lastModifiedOn)
      };
      console.log(this.issueDetails.description);
      this.loaderService.stop();
    }, err => this.router.navigate(['/issues']));
  }

}
