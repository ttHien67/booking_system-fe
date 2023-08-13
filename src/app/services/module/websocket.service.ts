import {Injectable} from "@angular/core";
import * as SockJS from 'sockjs-client';
import { NotificationService } from "./notification.service";
import { WEBSOCKET_ENDPOINT, WEBSOCKET_NOTIFY_TOPIC } from "src/app/shares/contants/base-url.contants";
import { Stomp } from "@stomp/stompjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"
})


export class WebSocketService {
    stompClient: any;

    constructor(
        private notificationService: NotificationService,
        private authService: AuthService
    ){}

    connect(): void {
        console.log("Websocket Connection");
        const userId = this.authService.currentUser().userId;
        const ws = new SockJS(WEBSOCKET_ENDPOINT);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function(frame: any){
            _this.stompClient.subscribe("/topic/" + userId + WEBSOCKET_NOTIFY_TOPIC, function(sdkEvent: any){
                _this.onMessageReceived(sdkEvent);
            });
        });
    }

    disconnect(): void {
        if(this.stompClient !== null){
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
        
    }

    errorCallback(error: any){
        console.error("ErrorCallback -> "+ error);
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    onMessageReceived(message: any) {
        console.log("Message received from server: " + message);
        this.notificationService.notificationMessage.emit(JSON.parse(message.body));
    }

}