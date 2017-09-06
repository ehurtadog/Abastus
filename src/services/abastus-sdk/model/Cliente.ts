'use strict';
import * as models from './models';

export interface Cliente {
  clientId?: string;
  clientFirstName?: string;
  clientLastName?: string;
  balance?: number;
  formattedBalance?: string;
  status?: string;
}
