import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseListResponse } from "src/app/models/base-list-response.model";
import { CommandURL } from "../commands/api.command";


@Injectable({
    providedIn: 'root'
})

export class ProductService {
    constructor(
        private http: HttpClient
    ){}
    
    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    getProduct(json : any) {
        return this.http.post<BaseListResponse>(CommandURL.PRODUCT + '/getProduct', json, {headers: this.header})
    }
}