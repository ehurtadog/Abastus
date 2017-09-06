import { Http, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { DefaultApi } from './abastus-sdk/api/DefaultApi';
import { UserLoginService } from './account-management.service';
import { Config } from '../config/config';
import { HttpService } from './http-service';
import { Logger } from './logger.service';

@Injectable()
export class CustomAuthorizerClient {
  private client: DefaultApi;

  constructor (http: Http) { //<-- OJO!!! POR QUE HTTP y NO HTTPMODULE
    let httpService: HttpService = new HttpService(http);
    httpService.addInterceptor((options: RequestOptions) => {
      // options.headers.set('Authorization', 'Basic bXktdHJ1c3RlZC1jbGllbnQ6c2VjcmV0');
      options.headers.set('Authorization', 'Basic dHJ1c3RlZC1hcHA6c2VjcmV0');
      // options.headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

      console.log('%cCustom Authorizer Request:\n', Logger.LeadInStyle, options.method, options.url,
        '\nHeaders:', options.headers, '\nBody:', options.body);
    });
    this.client = new DefaultApi(<any> httpService, null);
  }

  public getClient(): DefaultApi {
    return this.client;
  }
}
