import {
  Directive,
  HostBinding,
  HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleModal]'
})
export class ToggleModalDirective {

  @HostListener('click', ['$event']) openModal(e) {
    e.preventDefault();
    document.querySelector('.item-creation-container').classList.remove('d-none');
  }
}
