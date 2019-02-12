import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private friends;
  private statusChangeListener = new Subject<boolean>();
  private listCreateListener = new Subject<{title: String, description: String}>();
  public isFriendsSet: Boolean = false;
  // tslint:disable-next-line:prefer-const
  private dateOptions = {weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'};

  public setFriends(data) {
    this.friends = data;
    if (this.isFriendsSet === false) {
      this.isFriendsSet = true;
      this.statusChangeListener.next(true);
    }
  }

  public getFriends() {
    return this.friends;
  }

  public getStatusChangeListener() {
    return this.statusChangeListener.asObservable();
  }

  public createList(formData) {
    this.listCreateListener.next(formData);
  }

  public getListCreateListener() {
    return this.listCreateListener.asObservable();
  }

  public getReadableDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', this.dateOptions);
  }

  public getShortReadableDate(dateString) {
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', dateOptions);
  }

  public getGreeting() {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) {
      return 'Morning';
    } else if (hours >= 12 && hours < 18) {
      return 'Afternoon';
    } else if (hours >= 18) {
      return 'Evening';
    }
    return 'Morning';
  }

  public getTimeFromDateString(dateString) {
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', dateOptions);
  }

  public hideModal(selector) {
    document.querySelector(selector).classList.add('d-none');
    document.querySelector(selector).classList.remove('d-flex');
  }

  public showModal(selector) {
    document.querySelector(selector).classList.add('d-flex');
    document.querySelector(selector).classList.remove('d-none');
  }

  public getRandomInteger() {
    const rand: number = Math.random() * 10;
    return Math.round(rand);
  }

}
