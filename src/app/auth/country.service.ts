import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class CountryService {
    constructor(private http: HttpClient) {}
    private url = 'http://country.io';


    // unable to make it work due to CORS policy. Will figure out a way if time permits
    getCountries(): Observable<any> {
        const countryNames = this.http.get(`${this.url}/names.json`).pipe(map((res: Response) => res.json()));
        const phoneCodes = this.http.get(`${this.url}/phone.json`).pipe(map((res: Response) => res.json()));
        return forkJoin([countryNames, phoneCodes])
                            .pipe(map(responses => console.log(responses)));
    }

    // get the countries stored in local system in json format
    getCountriesLocal(): Observable<any> {
        const countryNames = this.http.get(`./assets/json/country-names.json`).pipe(map((res: Response) => res));
        const phoneCodes = this.http.get(`./assets/json/phone-codes.json`).pipe(map((res: Response) => res));
        return forkJoin([countryNames, phoneCodes])
                            .pipe(map(responses => {
                                const cnames = responses[0];
                                const pcodes = responses[1];
                                const countries = [];
                                // tslint:disable-next-line:forin
                                for (let i in cnames) {
                                    // tslint:disable-next-line:prefer-const
                                    let obj: {name: String, code: String, pcode: String} = {
                                        name: cnames[i],
                                        code: i,
                                        pcode: pcodes[i]
                                    };
                                    countries.push(obj);
                                }
                                return countries;
                            }));
    }

}
