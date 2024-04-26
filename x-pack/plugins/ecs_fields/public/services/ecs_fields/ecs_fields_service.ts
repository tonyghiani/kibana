/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EcsFieldsClient } from './ecs_fields_client';
import { EcsFieldsServiceStartDeps, EcsFieldsServiceSetup, EcsFieldsServiceStart } from './types';

export class EcsFieldsService {
  public setup(): EcsFieldsServiceSetup {
    return {};
  }

  public start({ http }: EcsFieldsServiceStartDeps): EcsFieldsServiceStart {
    const client = new EcsFieldsClient(http);

    return {
      client,
    };
  }
}
