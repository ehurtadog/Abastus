'use strict';
import * as models from './models';

export interface UserListResponse {
  items?: Array<models.User>;
}
