import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss', '../../../styles/_foundation-theme.scss']
})
export class IssueFormComponent implements OnInit {

  public users;
  public user;
  public projects = [{value: 'general', display: 'General'}, {value: 'project-xxx', display: 'Project-1'}];
  public project = [this.projects[0]];
  constructor() {
    this.users = [
      {value: 'xxx', display: 'Vikas'},
      {value: 'yyy', display: 'Noothana'},
      {value: 'zzz', display: 'Vinnu'},
      {value: 'aaa', display: 'Karthik'},
      {value: 'bbb', display: 'Sathish'},
      {value: 'ccc', display: 'Hemanth'},
      {value: 'sss', display: 'Mahesh'},
      {value: 'ddd', display: 'Eswar'},
      {value: 'www', display: 'Ganesh'}
    ];
    this.user = [this.users[0]];
  }

  ngOnInit() {
  }

}
