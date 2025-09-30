/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup, IRouter, Logger } from '@kbn/core/server';
import type { FeaturesPluginSetup, FeaturesPluginStart } from '@kbn/features-plugin/server';
import type { BootcampConfig } from './config';

export type BootcampPluginCoreSetup = CoreSetup<BootcampServerPluginStartDeps, BootcampServerStart>;

export interface BootcampServerSetup {
  logSetup: () => void;
}

export interface BootcampServerStart {
  logStart: () => void;
}

export interface BootcampServerPluginSetupDeps {
  features?: FeaturesPluginSetup;
}

export interface BootcampServerPluginStartDeps {
  features?: FeaturesPluginStart;
}

export interface BootcampServerLibs {
  logger: Logger;
  router: IRouter;
  config: BootcampConfig;
}
