import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "src/app/models/base-response.model";
import { CommandURL } from "../commands/api.command";
import { BaseListResponse } from "src/app/models/base-list-response.model";


@Injectable({
    providedIn: 'root'
})

export class PermissionService {
    constructor(
        private http: HttpClient
    ) { }

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    getPermission(json: any) {
        return this.http.post<BaseListResponse>(CommandURL.PERMISSION + '/getPermission', json, { headers: this.header });
    }

    // getParentMenu(json : any) {
    //     return this.http.post<BaseListResponse>(CommandURL.MENU + '/getParentMenu', json, {headers: this.header});
    // }

    // findAllMenu(json : any) {
    //     return this.http.post<BaseListResponse>(CommandURL.MENU + '/findAllMenu', json, {headers: this.header});
    // }

    createPermission(json: any) {
        return this.http.post<BaseResponse>(CommandURL.PERMISSION + '/createPermission', json, { headers: this.header });
    }

    // updateMenu(json : any) {
    //     return this.http.post<BaseResponse>(CommandURL.MENU + '/update', json, {headers: this.header});
    // }
}