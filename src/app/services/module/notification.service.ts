import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommandURL } from "../commands/api.command";


@Injectable({
    providedIn: 'root'
})


export class NotificationService {
    constructor(
        private http: HttpClient
    ){}

    private header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    })

    sendNotification(json: any){
        return this.http.post<any>(CommandURL.NOTIFICATION + '/sendNotification', json, {headers: this.header});
    }
}