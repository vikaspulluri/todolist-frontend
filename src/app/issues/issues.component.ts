import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { config } from '../app.config';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  public filtersFormConfig = config.filtersForm;
  public activeUserId = this.filtersFormConfig.userGroup[0].value;
  public activePriority = this.filtersFormConfig.priorityGroup[0].value;
  public activeProjectId$ = this.filtersFormConfig.projectGroup[0].value;
  public activeIssueType$ = this.filtersFormConfig.issueGroup[0].value;
  public activeLabel$ = this.filtersFormConfig.labelGroup[0].value;

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

  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.mapActivatedQueryParams(queryParams);
    });
  }

  mapActivatedQueryParams(queryParams) {
    if (queryParams.get('projectId')) {
      let projectId = queryParams.get('projectId');
      let index = this.filtersFormConfig.projectGroup.findIndex(item => item.value === projectId);
      if (index && index > -1) {
        this.activeProjectId$ = this.filtersFormConfig.projectGroup[index].value;
        this.updateProjectGroup();
      }
    }
    if (queryParams.get('issueType')) {
      let issueType = queryParams.get('issueType');
      let index = this.filtersFormConfig.issueGroup.findIndex(item => item.value === issueType);
      if (index && index > -1) {
        this.activeIssueType$ = this.filtersFormConfig.issueGroup[index].value;
        this.updateIssueGroup();
      }
    }

    if (queryParams.get('priority')) {
      let priority = queryParams.get('priority');
      let index = this.filtersFormConfig.priorityGroup.findIndex(item => item.value === priority);
      if (index && index > -1) {
        this.activePriority = this.filtersFormConfig.priorityGroup[index].value;
        this.updatePriorityGroup();
      }
    }
    if (queryParams.get('label')) {
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

  onUpdateFilters() {
    console.log(this.filtersForm.value);
  }


}
