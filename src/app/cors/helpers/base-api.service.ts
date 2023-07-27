import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import { AppDefinition } from 'src/app/services/commands/app-define.constant';
import { BaseResponse } from 'src/app/models/base-response.model';
import { BaseListResponse } from 'src/app/models/base-list-response.model';

export const ResponseType = {
  JSON: 'json',
  TEXT: 'text',
  STREAM: 'arraybuffer',
  BLOB: 'blob',
};

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  private numberOfRetry = AppDefinition.NUMBER_OF_RETRY_API;

  // Http Options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient,
  ) {
  }

  /**
   * HttpClient API post() method with Json Payload
   * @param path
   * @param payload
   */
  postJson(path: string, payload: any): Observable<BaseListResponse> {

    // thêm ngôn ngữ vào request
    // if (payload) {
    //   payload.language = this.translateService.currentLang;
    // }

    return this.http
      .post<BaseListResponse>(path, JSON.stringify(payload), this.httpOptions)
      .pipe(retry(this.numberOfRetry), catchError(this.handleError));
  }

  /**
   * HttpClient API post() method with Custom Response Type: json, text, arraybuffer, blob
   * @param path
   * @param payload
   * @param typeOfRes
   */
  postCustomResponse(
    path: string,
    payload: any,
    typeOfRes: any = ResponseType.JSON
  ) {
    return this.http
      .post(path, JSON.stringify(payload), {
        ...this.httpOptions,
        responseType: typeOfRes,
      })
      .pipe(retry(this.numberOfRetry), catchError(this.handleError));
  }

  /**
   * HttpClient API post() method with FormData Payload
   * Note: No need set content-type multipart/form-data
   * Request auto generate suffix boundary
   * @param path
   * @param payload
   */
  postFormData(path: string, payload: FormData): Observable<BaseResponse> {
    return this.http
      .post<BaseResponse>(path, payload)
      .pipe(retry(this.numberOfRetry), catchError(this.handleError));
  }

  saveFileFromHttpClient(response: any, fileName?: string) {
    let dataType = response.type;
    let binaryData = [];
    binaryData.push(response);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(
      new Blob(binaryData, {type: dataType})
    );
    if (fileName) {
      downloadLink.setAttribute('download', fileName);
    }
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    // if (error.error instanceof ErrorEvent) {
    //   // Get client-side error
    //   // errorMessage = error.error.message;
    //   errorMessage = error.error.errorDesc;
    // } else {
    //   // Get server-side error
    //   // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    //   errorMessage = error.error.errorDesc;
    // }
    errorMessage = error.error.errorDesc;
    return throwError(errorMessage);
  }
}
