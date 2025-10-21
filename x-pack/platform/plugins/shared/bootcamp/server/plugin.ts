/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  CoreSetup,
  CoreStart,
  Logger,
  Plugin,
  PluginInitializerContext,
} from '@kbn/core/server';
import type {
  BootcampServerLibs,
  BootcampServerPluginSetupDeps,
  BootcampServerPluginStartDeps,
  BootcampServerSetup,
  BootcampServerStart,
} from './types';
import { registerRoutes } from './routes';
import { dashboardSavedObject } from './saved_objects/dashboard_saved_object';
import type { BootcampConfig } from './config';
import { BOOTCAMP_UI_SETTINGS } from '../common/ui_settings';
import { registerBootcampFeatures } from './features';

export class BootcampPlugin
  implements
    Plugin<
      BootcampServerSetup,
      BootcampServerStart,
      BootcampServerPluginSetupDeps,
      BootcampServerPluginStartDeps
    >
{
  private readonly logger: Logger;
  private readonly config: BootcampConfig;

  constructor(initContext: PluginInitializerContext) {
    this.logger = initContext.logger.get();
    this.config = initContext.config.get<BootcampConfig>();
  }

  setup(
    core: CoreSetup<BootcampServerPluginStartDeps, BootcampServerStart>,
    plugins: BootcampServerPluginSetupDeps
  ): BootcampServerSetup {
    this.logger.info('Bootcamp plugin setup');

    core.savedObjects.registerType(dashboardSavedObject);

    core.uiSettings.register(BOOTCAMP_UI_SETTINGS);

    const libs: BootcampServerLibs = {
      router: core.http.createRouter(),
      logger: this.logger,
      config: this.config,
    };

    registerRoutes(libs);

    registerBootcampFeatures(plugins.features);

    return {};
  }

  start(core: CoreStart, plugins: BootcampServerPluginStartDeps): BootcampServerStart {
    this.logger.info('Bootcamp plugin start');

    return {};
  }
}
