/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EcsFieldsClient } from './ecs_fields_client';
import { EcsFieldsServiceSetup, EcsFieldsServiceStart } from './types';

export class EcsFieldsService {
  constructor() {}

  public setup(): EcsFieldsServiceSetup {
    return {};
  }

  public start(): EcsFieldsServiceStart {
    return {
      getClient() {
        return new EcsFieldsClient();
      },
    };
  }
}
