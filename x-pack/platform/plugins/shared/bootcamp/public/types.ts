/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup, CoreStart, Plugin as PluginClass } from '@kbn/core/public';
import type { SharePluginSetup, SharePluginStart } from '@kbn/share-plugin/public';
import type { BootcampDashboardService } from './services/bootcamp_dashboard_service';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampPublicSetup {}

export interface BootcampPublicStart {
  dashboardService: BootcampDashboardService;
}

export interface BootcampPublicSetupDeps {
  share: SharePluginSetup;
}

export interface BootcampPublicStartDeps {
  share: SharePluginStart;
}

export type BootcampClientCoreSetup = CoreSetup<BootcampPublicStartDeps, BootcampPublicStart>;
export type BootcampClientCoreStart = CoreStart;
export type BootcampClientPluginClass = PluginClass<
  BootcampPublicSetup,
  BootcampPublicStart,
  BootcampPublicSetupDeps,
  BootcampPublicStartDeps
>;

export type BootcampPublicStartServicesAccessor = BootcampClientCoreSetup['getStartServices'];
export type BootcampPublicStartServices = ReturnType<BootcampPublicStartServicesAccessor>;
