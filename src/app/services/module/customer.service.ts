import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommandURL } from "../commands/api.command";
import { BaseListResponse } from "src/app/models/base-list-response.model";
import { BaseResponse } from "src/app/models/base-response.model";

@Injectable({
    providedIn: 'root'
})

export class CustomerService {
    constructor(
        private http: HttpClient
    ){}

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    getCustomer(json : any) {
        return this.http.post<BaseListResponse>(CommandURL.CUSTOMER + '/getCustomer', json, {headers: this.header});
    }

    updateCustomer(json: any) {
        return this.http.post<BaseResponse>(CommandURL.CUSTOMER + '/updateCustomer', json, {headers: this.header});
    }

    deleteCustomer(json: any) {
        return this.http.post<BaseResponse>(CommandURL.CUSTOMER + '/deleteCustomer', json, {headers: this.header});
    }
}