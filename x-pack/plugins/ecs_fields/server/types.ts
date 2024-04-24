/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup, RequestHandlerContext } from '@kbn/core/server';
import {
  PluginSetup as DataPluginSetup,
  PluginStart as DataPluginStart,
} from '@kbn/data-plugin/server';
import { PluginStart as DataViewsPluginStart } from '@kbn/data-views-plugin/server';
import { EcsFieldsDomainLibs } from './lib/ecs_fields_types';
import { LogViewsServiceSetup, LogViewsServiceStart } from './services/fields/types';

export type EcsFieldsPluginCoreSetup = CoreSetup<
  EcsFieldsServerPluginStartDeps,
  EcsFieldsPluginStart
>;
export type EcsFieldsPluginStartServicesAccessor = EcsFieldsPluginCoreSetup['getStartServices'];

export interface EcsFieldsPluginSetup extends EcsFieldsDomainLibs {
  logViews: LogViewsServiceSetup;
  registerUsageCollectorActions: (usageCollector: UsageCollector) => void;
}

export interface EcsFieldsPluginStart {
  logViews: LogViewsServiceStart;
}

export interface EcsFieldsServerPluginSetupDeps {
  data: DataPluginSetup;
}

export interface EcsFieldsServerPluginStartDeps {
  data: DataPluginStart;
  dataViews: DataViewsPluginStart;
}

export interface UsageCollector {
  countLogs?: () => void;
}

/**
 * @internal
 */
export type EcsFieldsPluginRequestHandlerContext = RequestHandlerContext;
