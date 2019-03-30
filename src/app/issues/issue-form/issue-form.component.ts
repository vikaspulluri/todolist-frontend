import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss', '../../../styles/_foundation-theme.scss']
})
export class IssueFormComponent implements OnInit {

  private mode = 'create'; // by default it's a create form unless there is a query param
  private issueId = null;
  private attachmentPreview;
  public issueForm: FormGroup;
  public users;
  public user;
  public projects = [{value: 'general', display: 'General'}, {value: 'project-xxx', display: 'Project-1'}];
  public project = [this.projects[0]];
  constructor() {
    this.users = [
      {value: 'xxx', display: 'Vikas'},
      {value: 'yyy', display: 'Noothana'}
    ];
    this.user = [this.users[0]];
  }

  ngOnInit() {
    this.issueForm = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      issueType:  new FormControl({value: 'Task', disabled: true}, {validators: [Validators.required]}),
      attachment: new FormControl(null),
      user: new FormControl(null)
    });
  }

  onImagePicked($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    this.issueForm.patchValue({attachment: file});
    this.issueForm.get('attachment').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = (e) => {
      this.attachmentPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

}
