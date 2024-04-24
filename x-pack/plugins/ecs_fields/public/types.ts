/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup, CoreStart, Plugin as PluginClass } from '@kbn/core/public';
import type { DataPublicPluginStart } from '@kbn/data-plugin/public';
import type { DataViewsPublicPluginStart } from '@kbn/data-views-plugin/public';
import type { ObservabilityAIAssistantPublicStart } from '@kbn/observability-ai-assistant-plugin/public';
import { SharePluginSetup } from '@kbn/share-plugin/public';
import { UiActionsStart } from '@kbn/ui-actions-plugin/public';

import { EcsFieldsLocators } from '../common/locators';
import type { LogAIAssistantProps } from './components/log_ai_assistant/log_ai_assistant';
// import type { OsqueryPluginStart } from '../../osquery/public';
import { LogViewsServiceSetup, LogViewsServiceStart } from './services/fields';

// Our own setup and start contract values
export interface EcsFieldsClientSetupExports {
  logViews: LogViewsServiceSetup;
  locators: EcsFieldsLocators;
}

export interface EcsFieldsClientStartExports {
  logViews: LogViewsServiceStart;
  LogAIAssistant?: (props: Omit<LogAIAssistantProps, 'observabilityAIAssistant'>) => JSX.Element;
}

export interface EcsFieldsClientSetupDeps {
  share: SharePluginSetup;
}

export interface EcsFieldsClientStartDeps {
  data: DataPublicPluginStart;
  dataViews: DataViewsPublicPluginStart;
  observabilityAIAssistant?: ObservabilityAIAssistantPublicStart;
  uiActions: UiActionsStart;
}

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

export type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer Value> ? Value : never;

export type EcsFieldsClientStartServicesAccessor = EcsFieldsClientCoreSetup['getStartServices'];
export type EcsFieldsClientStartServices = UnwrapPromise<
  ReturnType<EcsFieldsClientStartServicesAccessor>
>;
