import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { config } from '../app.config';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  public formQueryOptions = config.contactUsForm.queryGroup;
  public queries = this.formQueryOptions;
  public description;
  public query = this.queries[0].value;
  constructor(private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  onContactFormSubmit(contactForm: NgForm) {
    if (contactForm.invalid) {
      return;
    }
  }

}
