/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createEcsFieldsClientMock } from './ecs_fields_client.mock';
import { EcsFieldsServiceSetup, EcsFieldsServiceStart } from './types';

export const createEcsFieldsServiceSetupMock = (): jest.Mocked<EcsFieldsServiceSetup> => ({});

export const createEcsFieldsServiceStartMock = (): jest.Mocked<EcsFieldsServiceStart> => ({
  getClient: jest.fn(() => createEcsFieldsClientMock()),
});
