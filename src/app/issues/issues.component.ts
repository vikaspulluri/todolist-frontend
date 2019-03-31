import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { config } from '../app.config';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppHttpService } from '../shared/app-http.service';
import { UsersResponse, ProjectsResponse } from '../shared/response.interface';
import { UtilService } from '../shared/util.service';
import { AuthService } from '../auth/shared/auth.service';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  public filtersFormConfig = config.filtersForm;
  public activeUserId;
  public activePriority = this.filtersFormConfig.priorityGroup[0].value;
  public activeProjectId$;
  public activeIssueType$ = this.filtersFormConfig.issueGroup[0].value;
  public activeLabel$ = this.filtersFormConfig.labelGroup[0].value;
  public users;
  public projects;
  public currentUserId = this.authService.getUserId();

  filtersForm = new FormGroup({
    userGroup: new FormGroup({
      user: new FormControl(this.activeUserId)
    }),
    issueGroup: new FormGroup({
      issueType: new FormControl(this.activeIssueType$)
    }),
    priorityGroup: new FormGroup({
      priority: new FormControl(this.activePriority)
    }),
    projectGroup: new FormGroup({
      projectId: new FormControl(this.activeProjectId$)
    }),
    labelGroup: new FormGroup({
      label: new FormControl(this.activeLabel$)
    })
  });

  constructor(private route: ActivatedRoute,
              private loaderService: NgxUiLoaderService,
              private httpService: AppHttpService,
              private utilService: UtilService,
              private authService: AuthService) {}
  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.mapActivatedQueryParams(queryParams);
      console.log(this.filtersForm.value);
      this.getAllUsers();
      this.getProjects('', [this.currentUserId]);
    });
  }

  mapActivatedQueryParams(queryParams) {
    if (queryParams.has('projectId')) {
      let projectId = queryParams.get('projectId');
      let index = this.filtersFormConfig.projectGroup.findIndex(item => item.value === projectId);
      if (index && index > -1) {
        this.activeProjectId$ = this.filtersFormConfig.projectGroup[index].value;
        this.updateProjectGroup();
      }
    }
    if (queryParams.has('userId')) {
      let userId = queryParams.get('userId');
      this.activeUserId = userId;
      this.updateUserGroup();
    }
    if (queryParams.has('issueType')) {
      let issueType = queryParams.get('issueType');
      let index = this.filtersFormConfig.issueGroup.findIndex(item => item.value === issueType);
      if (index && index > -1) {
        this.activeIssueType$ = this.filtersFormConfig.issueGroup[index].value;
        this.updateIssueGroup();
      }
    }

    if (queryParams.has('priority')) {
      let priority = queryParams.get('priority');
      let index = this.filtersFormConfig.priorityGroup.findIndex(item => item.value === priority);
      if (index && index > -1) {
        this.activePriority = this.filtersFormConfig.priorityGroup[index].value;
        this.updatePriorityGroup();
      }
    }
    if (queryParams.has('label')) {
      let label = queryParams.get('label');
      let index = this.filtersFormConfig.labelGroup.findIndex(item => item.value === label);
      if (index && index > -1) {
        this.activeLabel$ = this.filtersFormConfig.labelGroup[index].value;
        this.updateLabelGroup();
      }
    }
  }

  // function to update priorityGroup in filters
  updatePriorityGroup() {
    this.filtersForm.patchValue({
      priorityGroup: {
        priority: this.activePriority
      }
    });
  }

  // function to update labelGroup in filters
  updateLabelGroup() {
    this.filtersForm.patchValue({
      labelGroup: {
        label: this.activeLabel$
      }
    });
  }

  // function to update issueGroup in filters
  updateIssueGroup() {
    this.filtersForm.patchValue({
      issueGroup: {
        issueType: this.activeIssueType$
      }
    });
  }

  // function to update projectGroup in filters
  updateProjectGroup() {
    this.filtersForm.patchValue({
      projectGroup: {
        projectId: this.activeProjectId$
      }
    });
  }

  updateUserGroup() {
    this.filtersForm.patchValue({
      userGroup: {
        user: this.activeUserId
      }
    });
  }

  getAllUsers() {
    this.loaderService.start();
    this.httpService.getAllUsers().subscribe((response: UsersResponse) => {
      this.users = this.utilService.mapUserDataToForm(response.data);
      this.users.push({value: '*', display: 'All'});
      this.activeUserId = this.activeUserId || this.currentUserId;
      this.updateUserGroup();
      this.loaderService.stop();
    }, err => this.loaderService.stop());
  }

  getProjects(title: string, users: string[]) {
    this.loaderService.start();
    this.httpService.getProjects({title: title, users: users}).subscribe((response: ProjectsResponse) => {
      this.projects = this.utilService.mapProjectDataToForm(response.data);
      this.activeProjectId$ = this.activeProjectId$ || this.projects[0].value;
      this.updateProjectGroup();
      this.loaderService.stop();
    }, err => this.loaderService.stop());
  }

  getAllLabels() {}

  onUpdateFilters() {
    console.log(this.filtersForm.value);
  }


}
