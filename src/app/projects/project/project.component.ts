import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/shared/util.service';
import { AppHttpService } from 'src/app/shared/app-http.service';
import { UsersResponse, ProjectResponse } from 'src/app/shared/response.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Project } from 'src/app/shared/models';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss', '../../../styles/_foundation-theme.scss']
})
export class ProjectComponent implements OnInit {

  public users;
  public members;
  public projectId$;
  public projectShortName$;
  private activeProject: Project;
  private currentUserId = this.authService.getUserId();
  private isOutSider = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private httpService: AppHttpService,
    private toastrService: ToastrService,
    private loaderService: NgxUiLoaderService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.loaderService.start(); // starting on page load. finish it when all requests completed
    this.getAllUsers();
    this.route.paramMap.subscribe(params => {
      // need to get project details from id
      this.projectId$ = params.get('id');
      this.getProject(this.projectId$);
    });
  }

  getAllUsers() {
    this.httpService.getAllUsers().subscribe((response: UsersResponse) => {
      let usersData = this.utilService.mapUserDataToForm(response.data);
      this.users = this.utilService.excludeCurrentUserFromInputTag(usersData);
    });
  }

  getProject(projectId: string) {
    this.httpService.getProject(projectId).subscribe((response: ProjectResponse) => {
      console.log(response);
      if (!response.data || !response.data.projectId) {
        this.router.navigate(['/projects']).then(success => {
          this.toastrService.error('No project found with the ID provided');
        });
        return;
      }
      this.activeProject = response.data;
      this.projectShortName$ = this.utilService.getShortName(this.activeProject.title, 2);
      this.activeProject.createdDate = this.utilService.formatDate(response.data.createdDate);
      this.members = this.utilService.mapUserDataToForm(this.activeProject.members);
      this.members = this.utilService.setUserPrivilieges(this.activeProject.ownerId, this.members);
      this.isOutSider = !this.isMemberOfProject();
    }, err => this.loaderService.stop());
  }

  isMemberOfProject() {
    let filteredArray = this.members.filter(member => member.userId === this.currentUserId);
    return true ? (filteredArray.length > 0) || (this.currentUserId === this.activeProject.ownerId) : false;
  }

}
