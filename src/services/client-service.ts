import { Injectable } from '@angular/core';
import { Config } from '../config/config';
import { Logger } from './logger.service';
import { CustomAuthorizerClient } from './abastus-api.service';
import { UserLoginService } from './account-management.service';
import { LocalStorage } from './account-management.service';

@Injectable()
export class ClientDataService {

  public static getClientFirstName(): string {
    if (LocalStorage.getObject('clientDetails') && LocalStorage.getObject('clientDetails')['clientFirstName']) {
      return (LocalStorage.getObject('clientDetails')['clientFirstName'])
    }
    return null;
  }

  public static getClientLastName(): string {
    if (LocalStorage.getObject('clientDetails') && LocalStorage.getObject('clientDetails')['clientLastName']) {
      return (LocalStorage.getObject('clientDetails')['clientLastName'])
    }
    return null;
  }

  public static getClientFullName(): string {
    if (this.getClientFirstName() && this.getClientLastName()) {
      return this.getClientFirstName() + ' ' + this.getClientLastName();
    }
    return null;
  }

  public static getClientBalance(): number {
    if (LocalStorage.getObject('clientDetails') && LocalStorage.getObject('clientDetails')['balance']) {
      return (LocalStorage.getObject('clientDetails')['balance']);
    }
    return 0;
  }

  public static getClientFormattedBalance(): string {
    if (LocalStorage.getObject('clientDetails') && LocalStorage.getObject('clientDetails')['formattedBalance']) {
      return (LocalStorage.getObject('clientDetails')['formattedBalance']);
    }
    return '$0.00';
  }

  public static getClientStatus(): string {
    if (LocalStorage.getObject('clientDetails') && LocalStorage.getObject('clientDetails')['status']) {
      return (LocalStorage.getObject('clientDetails')['status']);
    }
    return null;
  }

  public static getClientDetails(clientId: string, authClient: CustomAuthorizerClient): Promise<void> {
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      authClient.getClient().clientDetails(UserLoginService._userTokens.accessToken, clientId).subscribe(
        (clientData) => {
          let clientDetails = {
            'clientId': clientData.clientId,
            'clientFirstName': clientData.clientFirstName,
            'clientLastName': clientData.clientLastName,
            'balance': clientData.balance,
            'formattedBalance': clientData.formattedBalance,
            'status': clientData.status
          };

          console.log('%cClient Details: ', Logger.LeadInStyle, clientDetails);
          LocalStorage.setObject('clientDetails', clientDetails);

          resolve();
        },
        (error) => {
          reject(error);
        }
      )
    });

    return promise;
  }
}
