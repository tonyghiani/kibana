/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { SharePluginSetup, SharePluginStart } from '@kbn/share-plugin/public';
import type { BootcampDashboardService } from './services/dashboard_service';

export interface BootcampPublicPluginSetupDeps {
  share: SharePluginSetup;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampPublicSetup {}

export interface BootcampPublicPluginStartDeps {
  share: SharePluginStart;
}

export interface BootcampPublicStart {
  dashboardService: BootcampDashboardService;
}
