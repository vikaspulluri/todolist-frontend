import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimateTextService } from '../shared/animate-text.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  constructor(private animateTextService: AnimateTextService) { }

  ngOnInit() {
    this.animateTextService.initiate();
  }

  ngOnDestroy() {
    this.animateTextService.clearTime();
  }

}
