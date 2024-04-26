/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup } from '@kbn/core/server';

import { EcsFieldsServiceSetup, EcsFieldsServiceStart } from './services/ecs_fields/types';

export type EcsFieldsPluginCoreSetup = CoreSetup<
  EcsFieldsServerPluginStartDeps,
  EcsFieldsPluginStart
>;
export type EcsFieldsPluginStartServicesAccessor = EcsFieldsPluginCoreSetup['getStartServices'];

export interface EcsFieldsPluginSetup {
  ecsFields: EcsFieldsServiceSetup;
}

export interface EcsFieldsPluginStart {
  ecsFields: EcsFieldsServiceStart;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EcsFieldsServerPluginSetupDeps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EcsFieldsServerPluginStartDeps {}
