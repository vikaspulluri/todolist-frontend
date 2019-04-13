import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/util.service';
import { AppHttpService } from 'src/app/shared/app-http.service';
import { IssueDetailsResponse, UsersResponse } from 'src/app/shared/response.interface';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { Issue } from 'src/app/shared/models';
import { textEditorConfig, galleryConfig } from 'src/app/shared/libraries.config';
import { AuthService } from 'src/app/auth/shared/auth.service';
import {  NgxGalleryImage } from 'ngx-gallery';
import { config } from '../../app.config';
import { TagModel } from 'ngx-chips/core/accessor';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss', '../../../styles/_foundation-theme.scss']
})
export class IssueComponent implements OnInit {

  public users;
  public user;
  public issueId;
  public labels;
  public issueDetails: Issue;
  public issueDuration; // holds duration of issue in active state
  public textEditorConfig = textEditorConfig;
  public currentUserId = this.authService.getUserId();
  public galleryOptions = galleryConfig;
  public galleryImages: NgxGalleryImage[];
  public statusGroup = config.filtersForm.issueGroup.slice();
  public priorityGroup = config.filtersForm.priorityGroup.slice();
  public isAssigneeEditing = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private httpService: AppHttpService,
    private loaderService: NgxUiLoaderService,
    private toastrService: ToastrService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.loaderService.start();
    this.statusGroup.shift(); // no need to keep 'All' in issue status form
    this.priorityGroup.shift();
    this.route.paramMap.subscribe(params => {
      // need to get project details from id
      this.issueId = params.get('id');
      if (this.issueId && typeof this.issueId !== 'undefined') {
        this.getIssueById();
      } else {
        this.router.navigate(['/issues']);
      }
    });
    this.getAllUsers();
    this.getAllLabels();
  }

  getIssueById() {
    this.httpService.getIssueById(this.issueId).subscribe((response: IssueDetailsResponse) => {
      this.issueDetails = {
        issueId: response.data.issueId,
        title: response.data.title,
        assignee: response.data.assignee,
        formAssignee: this.utilService.mapUserDataToForm([response.data.assignee]),
        reporter: response.data.reporter,
        status: response.data.status,
        priority: response.data.priority,
        project: response.data.project,
        description: response.data.description,
        watchers: response.data.watchers,
        formWatchers: this.utilService.mapUserDataToForm(response.data.watchers),
        labels: response.data.labels,
        imageUrl: response.data.imageUrl,
        createdDate: this.utilService.formatDate(response.data.createdDate),
        lastModifiedOn: this.utilService.formatDate(response.data.lastModifiedOn)
      };
      this.updatePrivilieges();
      if (this.issueDetails.completionDate) {
        this.issueDuration = this.utilService.getDuration(response.data.createdDate, response.data.completionDate);
      } else {
        this.issueDuration = this.utilService.getDuration(response.data.createdDate, null);
      }
      this.galleryImages = [{medium: this.issueDetails.imageUrl, small: this.issueDetails.imageUrl, big: this.issueDetails.imageUrl}];
      this.loaderService.stop();
    }, err => this.router.navigate(['/issues']));
  }

  getAllUsers() {
    this.httpService.getAllUsers().subscribe((response: UsersResponse) => {
      this.users = this.utilService.mapUserDataToForm(response.data);
    }, err => this.loaderService.stop());
  }

  getAllLabels() {
    this.httpService.getAllLabels().subscribe((response: {message: string, error: boolean, data: string[]}) => {
      this.labels = response.data.map(label => {
        let obj = {
          display: label,
          value: label
        };
        return obj;
      });
      console.log(this.labels);
    }, err => this.loaderService.stop());
  }

  onUpdateAssignee($event, isSaveBtn = false) {
    if ($event) {
      this.issueDetails.formAssignee[0].display = $event.display;
      this.issueDetails.formAssignee[0].value = $event.value;
    }
    if (isSaveBtn) {
      this.isAssigneeEditing = false;
      // check if the assignee is changed, if not return
      if (this.issueDetails.assignee.userId === this.issueDetails.formAssignee[0].value) {
        return;
      }
      this.issueDetails.assignee.userId = this.issueDetails.formAssignee[0].value;
      let assigneeName = this.issueDetails.formAssignee[0].display.split(' ');
      this.issueDetails.assignee.firstName = assigneeName[0];
      this.issueDetails.assignee.lastName = assigneeName[1];

      // update issue with assignee
      this.loaderService.start();
      this.httpService.updateIssueAssignee(this.issueDetails.assignee, this.issueDetails.issueId).subscribe(response => {
        this.toastrService.success(response.message);
        this.loaderService.stop();
        const defaultMsg = '*** has updated the assignee for ###';
        // realtime message to watchers
        const receivers = this.getNotificationReceivers();
        this.utilService.sendNotification(defaultMsg, 'issue',
                        {id: this.issueDetails.issueId, title: this.issueDetails.title}, receivers);
        // update issue activity
        let readableMsg = this.utilService.updateDefaultMsg(defaultMsg, this.authService.getUsername(), this.issueDetails.title);
        this.updateActivity(this.issueDetails.issueId, readableMsg);
      }, err => this.loaderService.stop());

    }
  }

  onCancelUpdateAssignee() {
    this.isAssigneeEditing = false;
    this.issueDetails.formAssignee[0].display = this.issueDetails.assignee.firstName + ' ' + this.issueDetails.assignee.lastName;
    this.issueDetails.formAssignee[0].value = this.issueDetails.assignee.userId;
  }

  updateActivity(issueId: string, summary: string) {
    this.httpService.updateIssueActivity(issueId, summary).subscribe(response => {
      console.log('successfully updated activity');
    });
  }

  addNotifications() {
  }

  getNotificationReceivers() {
    return [this.issueDetails.assignee, this.issueDetails.reporter, ...this.issueDetails.watchers];
  }

  updatePrivilieges() {
    if (!this.isReporter()) {
      this.textEditorConfig.contenteditable = false;
      this.textEditorConfig.events = {
        'froalaEditor.initialized': function(e, editor) {
          editor.edit.off();
        }
      };
    }
  }

  isAssignee() {
    if (this.issueDetails && this.issueDetails.assignee) {
      // tslint:disable-next-line:max-line-length
      return this.currentUserId === this.issueDetails.assignee.userId;
    }
    return false;
  }

  isReporter() {
    if (this.issueDetails && this.issueDetails.reporter) {
      return this.currentUserId === this.issueDetails.reporter.userId;
    }
    return false;
  }

  isWatcher() {
    if (this.issueDetails && this.issueDetails.watchers) {
      let findUser = this.issueDetails.watchers.find(user => user.userId === this.currentUserId);
      return true ? (findUser && findUser.userId) : false;
    }
    return false;
  }

  isOutSideUser() {
    return !(this.isAssignee() || this.isReporter() || this.isWatcher());
  }

}
