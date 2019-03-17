import { Injectable } from '@angular/core';

@Injectable()

// provided in AppComponent
export class UtilService {

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

}
