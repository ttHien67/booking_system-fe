import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommandURL } from "../commands/api.command";
import { BaseListResponse } from "src/app/models/base-list-response.model";
import { BaseResponse } from "src/app/models/base-response.model";

@Injectable({
    providedIn: 'root'
})

export class BookingService {
    constructor(
        private http: HttpClient
    ){}

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    createBooking(json : any) {
        return this.http.post<BaseResponse>(CommandURL.BOOKING + '/createBooking', json, {headers: this.header});
    }

    getBooking(json : any) {
        return this.http.post<BaseListResponse>(CommandURL.BOOKING + '/getBooking', json, {headers: this.header});
    }

    updateBooking(json : any) {
        return this.http.post<BaseResponse>(CommandURL.BOOKING + '/updateBooking', json, {headers: this.header});
    }

    statisticBooking(json : any) {
        return this.http.post<BaseResponse>(CommandURL.BOOKING + '/statisticBooking', json, {headers: this.header});
    }

    deleteBooking(json: any){
        return this.http.post<BaseResponse>(CommandURL.BOOKING + '/deleteBooking', json, {headers: this.header})
    }
}
