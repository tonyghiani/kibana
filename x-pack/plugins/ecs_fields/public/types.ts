/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup, CoreStart, Plugin as PluginClass } from '@kbn/core/public';

import { EcsFieldsServiceSetup, EcsFieldsServiceStart } from './services/ecs_fields';

export interface EcsFieldsClientSetupExports {
  ecsFields: EcsFieldsServiceSetup;
}

export interface EcsFieldsClientStartExports {
  ecsFields: EcsFieldsServiceStart;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EcsFieldsClientSetupDeps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EcsFieldsClientStartDeps {}

export type EcsFieldsClientCoreSetup = CoreSetup<
  EcsFieldsClientStartDeps,
  EcsFieldsClientStartExports
>;
export type EcsFieldsClientCoreStart = CoreStart;
export type EcsFieldsClientPluginClass = PluginClass<
  EcsFieldsClientSetupExports,
  EcsFieldsClientStartExports,
  EcsFieldsClientSetupDeps,
  EcsFieldsClientStartDeps
>;

export type EcsFieldsClientStartServicesAccessor = EcsFieldsClientCoreSetup['getStartServices'];
export type EcsFieldsClientStartServices = ReturnType<EcsFieldsClientStartServicesAccessor>;
