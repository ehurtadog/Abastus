import { Injectable } from '@angular/core';
import { Config } from '../config/config';
import { Logger } from './logger.service';
import { User } from './abastus-sdk/model/User';
import { UserTokens } from './abastus-sdk/model/UserTokens';
import { CustomAuthorizerClient } from './abastus-api.service';
import { GlobalStateService } from './global-state.service';

export enum UserState {
  SignedOut = 0,
  SignedIn = 1,
  PendingConfirmation = 2,
  InvalidCredentials = 3
}

export interface IUserLogin {
  username?: string;
  password?: string;
}

interface IUserAttribute {
  Name: string;
  Value: string;
}



@Injectable()
export class OAuth2Util {

  private static _CLIENT_ID: string = Config['CLIENT_ID'];

  public static getClientId(): string {
    return OAuth2Util._CLIENT_ID;
  }

  public static getUsername(): string {
    //Retrieve username from local storage. Return null if it does not exist
    return LocalStorage.get('userName');
  }

  public static setUsername(username: string) {
    LocalStorage.set('userName', username);
  }

  public static getUserId(): string {
    //Retrieve user ID from local storage. Return null if it does not exist
    return LocalStorage.get('userId');
  }

  public static getUserProfile() : Object {
    // Retrieve user profile attributes from local storage
    return LocalStorage.getObject('userProfile');
  }

  public static getUserState(): UserState {
    // Retrieve user state from local storage. Return null if it does not exist
    switch (parseInt(LocalStorage.get('userState'))) {
      case 0:
        return UserState.SignedOut;
      case 1:
        return UserState.SignedIn;
      case 2:
        return UserState.PendingConfirmation;
      case 3:
        return UserState.InvalidCredentials;
      default:
        return null;
    }
  };

  public static setUserState(userState: UserState) {
    LocalStorage.set('userState', JSON.stringify(userState));
  }
}

@Injectable()
export class UserLoginService {
  public static _userTokens = {
    accessToken: undefined,
    refreshToken: undefined
  };

  // private static authClient: CustomAuthorizerClient;
  users: User[] = [];
  data: any = [];
  //private static globals: GlobalStateService;


    // constructor (public authClient: CustomAuthorizerClient) {
    //   console.log('antes de la asignacion');
    //   this.authClient = authClient;
    //   console.log('despues de la asignacion');
    //   //this.globals = globals;
    // }

  public static getAccessToken() {
    //let accessToken: string = UserLoginService._userTokens.accessToken;
    let accessToken: string = '45115929-e1c2-4173-ae6b-b8e0a65c261b';

    if (!accessToken) {
      //retrieve from Local Storage if it exists
      accessToken = LocalStorage.get('userTokens.accessToken');
      UserLoginService._userTokens.accessToken = accessToken;
    }

    return accessToken;
  }

  public static getRefreshToken() {
    let refreshToken: string = UserLoginService._userTokens.refreshToken;

    if (!refreshToken) {
      // retrieve from Local Storage if it exists
      refreshToken = LocalStorage.get('userTokens.refreshToken');
      UserLoginService._userTokens.refreshToken = refreshToken;
    }
    return refreshToken;
  }

  public static getOAuth2TokenType() {
    return LocalStorage.get('userTokens.OAuth2TokenType');
  }

  public static getOAuth2ExpiresIn() {
    return LocalStorage.get('userTokens.OAuth2ExpiresIn');
  }

  public static getOAuth2Scope() {
    return LocalStorage.get('userTokens.OAuth2Scope');
  }
  private static clearUserState() {
    //Clear user tokens
    UserLoginService._userTokens = {
      accessToken: undefined,
      refreshToken: undefined
    }

    LocalStorage.set('userTokens.accessToken', null);
    LocalStorage.set('userTokens.refreshToken', null);
    LocalStorage.set('userTokens.OAuth2TokenType', null);
    LocalStorage.set('userTokens.OAuth2ExpiresIn', null);
    LocalStorage.set('userTokens.OAuth2Scope', null);
    LocalStorage.remove('clientDetails');

    // Clear user state
    OAuth2Util.setUserState(UserState.SignedOut);

    // Clear username and user ID attributes
    LocalStorage.set('userId', null);
    LocalStorage.set('userName', null);
  };

  public static signIn(authenticationData: IUserLogin, authClient: CustomAuthorizerClient, globals: GlobalStateService): Promise<void> {
    // Set user name
    OAuth2Util.setUsername(authenticationData.username);
    console.log('Authenticating user ' + authenticationData.username);

    if (! Config.DEVELOPER_MODE) {
      let promise: Promise<void> = new Promise<void>((resolve, reject) => {
        authClient.getClient().authenticateUser(authenticationData).subscribe(
          (userTokens) => {
            Logger.heading('User ' + authenticationData.username + ' authenticated!');
            UserLoginService._userTokens.accessToken = userTokens.access_token;
            UserLoginService._userTokens.refreshToken = userTokens.refresh_token;

            LocalStorage.set('userTokens.accessToken', UserLoginService._userTokens.accessToken);
            LocalStorage.set('userTokens.refreshToken', UserLoginService._userTokens.refreshToken);
            LocalStorage.set('userTokens.OAuth2TokenType', userTokens.token_type);
            LocalStorage.set('userTokens.OAuth2ExpiresIn', userTokens.expires_in.toString());
            LocalStorage.set('userTokens.OAuth2Scope', userTokens.scope);

            this.getUserDetails(authClient)
              .catch((error: Error): void => {
                console.log('There was an error while retriving user details.\n' + error);
                reject(error);
              });

              console.log('User detail retrieved!');

            OAuth2Util.setUserState(UserState.SignedIn);

            resolve();
          },
          (error) => {
            console.error('error desde signIn: ', error);
            reject(error);
          });
      });

      return promise;
    } else {
      UserLoginService._userTokens.accessToken = Config.DEVELOPER_ACCESS_TOKEN;
      LocalStorage.set('userTokens.accessToken', UserLoginService._userTokens.accessToken);

      let promise: Promise<void> = new Promise<void>((resolve, reject) => {
        this.getUserDetails(authClient)
          .then(() => {
            OAuth2Util.setUserState(UserState.SignedIn);
            resolve();
          })
          .catch((error: Error): void => {
            reject(error);
          });
      });

      return promise;
    }
  }

  private static getUserDetails(authClient: CustomAuthorizerClient): Promise<void> {
    let promise: Promise<void> = new Promise<void>((resolve, reject) => {
      authClient.getClient().userDetails(UserLoginService._userTokens.accessToken).subscribe(
        (user) => {
          let userAttributes = {
            'userId': user.userId,
            'userFirstName': user.userFirstName,
            'userLastName': user.userLastName
          };

          console.log('%cUser Attributes: ', Logger.LeadInStyle, userAttributes);
          LocalStorage.setObject('userProfile', userAttributes);

          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });

    return promise;
  }

  public static signOut() {
    // Clear local user state
    UserLoginService.clearUserState();
  }
}

export class UserProfileService {
  public static getUserAttributes() {

  }
}

@Injectable()
export class LocalStorage {

  private static getLocalStorage() {
    let storage = window.localStorage || localStorage;

    if (!localStorage) {
      throw new Error('El navegador no soporta el almacenamiento local');
    }

    return storage;
  }

  public static set(key: string, value: string): void {
    LocalStorage.getLocalStorage().setItem(key, value);
  }

  public static get(key: string): string {
    return LocalStorage.getLocalStorage().getItem(key);
  }

  public static setObject(key: string, value: any): void {
    LocalStorage.set(key, JSON.stringify(value));
  }

  public static getObject(key: string): any {
    return JSON.parse(LocalStorage.get(key) || '{}');
  }

  public static remove(key: string): any {
    LocalStorage.getLocalStorage().removeItem(key);
  }
}

export const LOCAL_STORAGE_PROVIDERS: any[] = [
  {provide: LocalStorage, useClass: LocalStorage}
];
