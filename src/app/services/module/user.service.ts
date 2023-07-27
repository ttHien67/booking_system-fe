import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommandURL } from "../commands/api.command";
import { BaseListResponse } from "src/app/models/base-list-response.model";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(
        private http: HttpClient
    ){}

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    createUser(json : any) {
        return this.http.post<BaseListResponse>(CommandURL.USER + '/createUser', json, {headers: this.header});
    }
}