import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../shared/util.service';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss', '../../../styles/_foundation-theme.scss']
})
export class IssueComponent implements OnInit {

  public users;
  public user;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService) {
    this.users = [
      {value: 'xxx', display: 'Vikas', readonly: true},
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
