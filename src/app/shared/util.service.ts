import { Injectable } from '@angular/core';
import { config } from '../app.config';
@Injectable()

// provided in AppComponent
export class UtilService {

    public config = config;

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
            return subTitles.reduce((acc, current) => acc + current.charAt(0));
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

}
