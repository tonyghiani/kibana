/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PluginInitializerContext, Logger, CoreStart } from '@kbn/core/server';
import type {
  BootcampPluginCoreSetup,
  BootcampServerLibs,
  BootcampServerPluginSetupDeps,
  BootcampServerPluginStartDeps,
  BootcampServerSetup,
  BootcampServerStart,
} from './types';
import { registerRoutes } from './routes';
import { dashboardSavedObjectType } from './saved_objects/dashboard_saved_object_type';
import type { BootcampConfig } from './config';
import { UI_SETTINGS } from '../common/ui_settings';
import { registerBootcampKibanaFeatures } from './features';

export class BootcampPlugin {
  private readonly logger: Logger;
  private readonly config: BootcampConfig;

  constructor(initializerContext: PluginInitializerContext<BootcampConfig>) {
    this.logger = initializerContext.logger.get();
    this.config = initializerContext.config.get();
  }

  public setup(
    core: BootcampPluginCoreSetup,
    plugins: BootcampServerPluginSetupDeps
  ): BootcampServerSetup {
    // Register the UI settings

    core.uiSettings.register(UI_SETTINGS);

    // Register the dashboard saved object type
    core.savedObjects.registerType(dashboardSavedObjectType);

    const libs: BootcampServerLibs = {
      logger: this.logger,
      router: core.http.createRouter(),
      config: this.config,
    };

    // Register the routes
    registerRoutes(libs);

    // Register the features
    registerBootcampKibanaFeatures(plugins.features);

    return {
      logSetup: () => this.logger.info('Hello setup'),
    };
  }

  public start(core: CoreStart, plugins: BootcampServerPluginStartDeps): BootcampServerStart {
    return {
      logStart: () => this.logger.info('Hello start'),
    };
  }
}
