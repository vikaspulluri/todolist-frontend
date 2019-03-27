import { Injectable, ModuleWithComponentFactories } from '@angular/core';
import { config } from '../app.config';
import { AutoCompleteTag } from './interface';
import { UsersResponse } from './response.interface';
import { AuthService } from '../auth/shared/auth.service';
import * as moment from 'moment';
@Injectable()

// provided in AppComponent
export class UtilService {

    public config = config;
    private currentUserId = this.authService.getUserId();
    constructor(private authService: AuthService) {}

    /**
     * getShortName(title, length)
     * Function that shortens the given string to the provided length
     * @param title string
     * @param length optional number
     * @returns string
     */
    public getShortName(title: string, length?: number) {
        if (title === '' || typeof title === 'undefined' || title === null) {
            return;
        }
        if (typeof length === 'undefined') {
            length = 2;
        }
        let subTitles = title.split(' ');
        let maxLength = subTitles.length;

        if (length <= maxLength) {
            return subTitles.reduce((acc, current) => acc + current.charAt(0), '');
        } else if (maxLength === 1) {
            return title.substring(0, 2);
        }
    }

    /**
     * getGreeting()
     * Function that returns 'morning', 'afternoon', 'evening' based on current time
     * @returns string
     */
    public getGreeting() {
        let currentDate = this.getCurrentDate();
        let hours = currentDate.getHours();
        if (hours < 12) {
            return this.config.greetings[0];
        } else if (hours < 18) {
            return this.config.greetings[1];
        } else {
            return this.config.greetings[2];
        }
    }

    /**
     * getCurrentDate()
     * Function that returns new Date Object
     * @returns Date object
     */
    public getCurrentDate() {
        return new Date();
    }

    /**
     * mapUserDataToForm()
     * Function that maps the users data to AutoCompleteTag format
     * @param Object of UsersResponse.data
     * @returns Array
     */
    public mapUserDataToForm(users: UsersResponse['data']) {
        let formData: AutoCompleteTag[] = users.map(user => {
            let obj: AutoCompleteTag = {
                value: user.userId,
                display: user.firstName + ' ' + user.lastName
            };
            return obj;
        });
        return formData;
    }

    /**
     * excludeCurrentUserFromInputTag()
     * Function that excludes current user details from populating in the form
     * @param Array of AutoCompleteTag
     * @returns AutoCompleteTag[]
     */
    public excludeCurrentUserFromInputTag(users: AutoCompleteTag[]) {
        return users.filter(user => user.value !== this.authService.getUserId());
    }

    /**
     * unmapUserDataFromForm()
     * Function that maps the form data to user data
     * @param users AutoCompleteTag[]
     */
    public unmapUserDataFromForm(users: AutoCompleteTag[]) {
        if (!users) { return; }
        let data = users.map(user => {
            let name = user.display.split(' ');
            let obj = {
                userId: user.value,
                firstName: name[0],
                lastName: name[1]
            };
            return obj;
        });
        return data;
    }

    public setUserPrivilieges(ownerId: string, users: AutoCompleteTag[]): AutoCompleteTag[] {
        let priviliegedUsers = users.map(user => {
            let obj = {
                value: user.value,
                display: user.display,
                readOnly: this.currentUserId === ownerId ? false : true
            };
            return obj;
        });
        return priviliegedUsers;
    }

    /**
     * formatDate()
     * Functioin that formats the date string to user readable form
     * @param isoDate Date String in ISO format
     * @returns String - 27th Mar 19, 10:57 pm
     */
    public formatDate(isoDate: string) {
        let date = new Date(isoDate);
        return moment(date).format('Do MMM YY, h:mm a');
    }

}
