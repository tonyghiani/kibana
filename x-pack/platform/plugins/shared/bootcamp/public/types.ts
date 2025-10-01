/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { SharePluginSetup, SharePluginStart } from '@kbn/share-plugin/public';
import type { CoreSetup } from '@kbn/core/public';
import { type Plugin } from '@kbn/core/public';
import type { BootcampDashboardsService } from './services/bootcamp_dashboards_service';

// Type for the public setup contract - whatever you want to expose to other plugins
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampPublicSetup {}

// Type for the public start contract - whatever you want to expose to other plugins

export interface BootcampPublicStart {
  dashboardsService: BootcampDashboardsService;
}

// Type for the public setup contract dependecies - whatever this plugin depends on during setup

export interface BootcampPublicPluginSetup {
  share: SharePluginSetup;
}

// Type for the public start contract dependecies - whatever this plugin depends on during start
export interface BootcampPublicPluginStart {
  share: SharePluginStart;
}

export type BootcampClientPluginClass = Plugin<
  BootcampPublicSetup,
  BootcampPublicStart,
  BootcampPublicPluginSetup,
  BootcampPublicPluginStart
>;

export type BootcampClientCoreSetup = CoreSetup<BootcampPublicPluginStart, BootcampPublicStart>;
export type BootcampPublicStartServicesAccessor = BootcampClientCoreSetup['getStartServices'];
