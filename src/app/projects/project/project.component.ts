import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/shared/util.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss', '../../../styles/_foundation-theme.scss']
})
export class ProjectComponent implements OnInit {

  public users;
  public user;
  public projectId$;
  public projectShortName$;
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
      this.route.paramMap.subscribe(params => {
        // need to get project details from id
        this.projectId$ = params.get('id');
        this.projectShortName$ = this.utilService.getShortName(this.projectId$, 2);
      });
    }

}
