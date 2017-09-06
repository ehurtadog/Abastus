import { Http, Headers, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';
import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { Config } from '../../../config/config';
import { IUserLogin, OAuth2Util } from '../../account-management.service';
import { Config } from '../../../config/config';
import * as models from '../model/models';
import 'rxjs/Rx';

'use strict';

@Injectable()
export class DefaultApi {
  protected basePath = 'no importa';
  public defaultHeaders: Headers = new Headers();

  constructor (protected http: Http, @Optional() basePath: string) {
    if (basePath) {
      this.basePath = basePath;
    }
  }

  authenticateUser(authDetails): Observable<models.UserTokens> {
    const path = Config.AUTH_SERVER + '/oauth/token?grant_type=password&username=' +
      authDetails.username + '&password=' + authDetails.password;
    let headerParams = this.defaultHeaders;
    let queryParameters = new URLSearchParams();
    let requestOptions: RequestOptionsArgs = {
      method: 'POST',
      headers: headerParams,
      search: queryParameters
    };

    return this.http
      .request(path, requestOptions)
      .map((res: Response) => {/*alert('json(): ' + JSON.stringify(res.json()));*/ return res.json()})
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      if (error.status === 400) {
        errMsg = 'Credenciales inv&aacute;lidas';
      } else {
        errMsg = 'error.status: ' + error.status + '- error.statusText: ' + error.statusText +
          ', err: ' + err + ', ct.status: ' + body.currentTarget.status;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  userDetails(accessToken: any): Observable<models.User> {
    const path = Config.RESOURCE_SERVER + '/user/byusername/' + OAuth2Util.getUsername() +
      '?access_token=' + accessToken;
    let headerParams = this.defaultHeaders;
    let queryParameters = new URLSearchParams();
    let requestOptions: RequestOptionsArgs = {
      method: 'GET',
      headers: headerParams,
      search: queryParameters
    };
    console.log('Retrieving user details...');

    return this.http
      .request(path, requestOptions)
      .map((res: Response) => {return res.json()})
      .catch(this.handleError);
  }

  clientDetails(accessToken: any, clientId: string): Observable<models.Cliente> {
    const path = Config.RESOURCE_SERVER + '/client/' + clientId + '?access_token=' + accessToken;

    let headerParams = this.defaultHeaders;
    let queryParameters = new URLSearchParams();
    let requestOptions: RequestOptionsArgs = {
      method: 'GET',
      headers: headerParams,
      search: queryParameters
    };
    console.log('Retrieving client details...');

    return this.http
      .request(path, requestOptions)
      .map((res: Response) => {return res.json()})
      .catch(this.handleError);
  }
}
