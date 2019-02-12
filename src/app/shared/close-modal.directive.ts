import {
  Directive,
  HostListener } from '@angular/core';

@Directive({
  selector: '[appCloseModal]'
})
export class CloseModalDirective {

  @HostListener('click', ['$event']) closeModal(e) {
    document.querySelector('.item-creation-container').classList.add('d-none');
  }
}
