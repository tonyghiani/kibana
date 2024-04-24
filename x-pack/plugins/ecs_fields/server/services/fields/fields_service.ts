/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FieldsClient } from './fields_client';
import { FieldsServiceSetup, FieldsServiceStart, FieldsServiceStartDeps } from './types';

export class FieldsService {
  constructor() {}

  public setup(): FieldsServiceSetup {
    return {};
  }

  public start({}: FieldsServiceStartDeps): FieldsServiceStart {
    return {
      getClient() {
        return new FieldsClient();
      },
    };
  }
}
