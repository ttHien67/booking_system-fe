import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseListResponse } from "src/app/models/base-list-response.model";
import { CommandURL } from "../commands/api.command";

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    constructor(
        private http: HttpClient
    ){}

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    getMenu(json : any) {
        return this.http.post<BaseListResponse>(CommandURL.MENU + '/getMenu', json, {headers: this.header});
    }
}