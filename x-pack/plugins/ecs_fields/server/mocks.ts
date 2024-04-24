/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createLogViewsServiceStartMock } from './services/fields/log_views_service.mock';
import { EcsFieldsPluginSetup, EcsFieldsPluginStart } from './types';

const createEcsFieldsSetupMock = () => {
  const ecsFieldsSetupMock: jest.Mocked<EcsFieldsPluginSetup> = {};

  return ecsFieldsSetupMock;
};

const createEcsFieldsStartMock = () => {
  const ecsFieldsStartMock: jest.Mocked<EcsFieldsPluginStart> = {
    logViews: createLogViewsServiceStartMock(),
  };
  return ecsFieldsStartMock;
};

export const ecsFieldsPluginMock = {
  createSetupContract: createEcsFieldsSetupMock,
  createStartContract: createEcsFieldsStartMock,
};
