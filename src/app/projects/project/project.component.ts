import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss', '../../../styles/_foundation-theme.scss']
})
export class ProjectComponent implements OnInit {

  public users;
  public user;
  constructor() {
    this.users = [
      {value: 'xxx', display: 'Vikas', readonly: true},
      {value: 'yyy', display: 'Noothana'},
      {value: 'zzz', display: 'Vinnu'}
    ];
    this.user = [this.users[0]];

  }

  ngOnInit() {
  }

}
