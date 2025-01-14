/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { services as apiIntegrationServices } from '../api_integration/services';
import { services as commonServices } from '../common/services';

export const services = {
  ...commonServices,
  esSupertest: apiIntegrationServices.esSupertest,
  supertestWithoutAuth: apiIntegrationServices.supertestWithoutAuth,
};
