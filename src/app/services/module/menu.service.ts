import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseListResponse } from "src/app/models/base-list-response.model";
import { CommandURL } from "../commands/api.command";
import { BaseResponse } from "src/app/models/base-response.model";

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    constructor(
        private http: HttpClient
    ) { }

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    getMenu(json: any) {
        return this.http.post<BaseListResponse>(CommandURL.MENU + '/getMenu', json, { headers: this.header });
    }

    getMenuForCategory(json: any) {
        return this.http.post<BaseListResponse>(CommandURL.MENU + '/getMenuForCategory', json, { headers: this.header });
    }

    getParentMenu(json: any) {
        return this.http.post<BaseListResponse>(CommandURL.MENU + '/getParentMenu', json, { headers: this.header });
    }

    findAllMenu(json: any) {
        return this.http.post<BaseListResponse>(CommandURL.MENU + '/findAllMenu', json, { headers: this.header });
    }

    createMenu(json: any) {
        return this.http.post<BaseResponse>(CommandURL.MENU + '/create', json, { headers: this.header });
    }

    updateMenu(json: any) {
        return this.http.post<BaseResponse>(CommandURL.MENU + '/update', json, { headers: this.header });
    }
}