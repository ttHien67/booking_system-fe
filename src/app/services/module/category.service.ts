import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/cors/helpers/base-api.service';
import { CommandURL } from '../commands/api.command';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {


    constructor(private baseApiService: BaseApiService) { }

    create(payload: any) {
        return this.baseApiService.postJson(CommandURL.MENU + '/createMenu', payload);
    }

    update(payload: any) {
        return this.baseApiService.postJson(CommandURL.MENU + '/updateMenu', payload);
    }

    getByCondition(payload: any) {
        return this.baseApiService.postJson(CommandURL.MENU + '/getMenu', payload);
    }

    findAllMenu() {
        return this.baseApiService.postJson(CommandURL.MENU + '/findAllMenu', {});
    }

    findMenuByUserId(userId: string) {
        const json = {userId: userId}
        return this.baseApiService.postJson(CommandURL.MENU + '/findMenuByUser', json); 
    }
}
