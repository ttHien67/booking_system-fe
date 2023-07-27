import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommandURL } from "../commands/api.command";
import { BaseListResponse } from "src/app/models/base-list-response.model";
import { BaseResponse } from "src/app/models/base-response.model";

@Injectable({
    providedIn: 'root'
})

export class CalendarWorkingService {
    constructor(
        private http: HttpClient
    ){}

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    getCalendar(json : any) {
        return this.http.post<BaseListResponse>(CommandURL.CALENDAR + '/getCalendar', json, {headers: this.header});
    }

    createCalendar(json: any) {
        return this.http.post<BaseResponse>(CommandURL.CALENDAR + '/createCalendar', json, {headers: this.header});
    }

    countService(json: any) {
        return this.http.post<BaseResponse>(CommandURL.CALENDAR + '/countService', json, {headers: this.header});
    }
}