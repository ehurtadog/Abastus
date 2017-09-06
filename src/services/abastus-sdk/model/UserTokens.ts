'use strict';
import * as models from './models';

export interface UserTokens {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
}
