import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { CommandURL } from "../commands/api.command";


@Injectable({
    providedIn: 'root'
})


export class NotificationService {

    notificationMessage = new EventEmitter();
    
    constructor(
        private http: HttpClient
    ) { }

    private header = new HttpHeaders({
        'Content-Type': 'application/json'
    })

    sendNotification(json: any) {
        return this.http.post<any>(CommandURL.NOTIFICATION + '/sendNotification', json, { headers: this.header });
    }

    responseNotification(json: any) {
        return this.http.post<any>(CommandURL.NOTIFICATION + '/responseNotification', json, { headers: this.header });
    }
}