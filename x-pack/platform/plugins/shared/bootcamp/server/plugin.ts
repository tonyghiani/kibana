/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PluginInitializerContext, CoreStart, Plugin, Logger } from '@kbn/core/server';

import type {
  BootcampPluginCoreSetup,
  BootcampServerSetup,
  BootcampServerStart,
  BootcampServerPluginSetupDeps,
  BootcampServerPluginStartDeps,
  BootcampBackendLibs,
} from './types';
import { registerBootcampRoutes } from './routes';
import { dashboardSavedObjectType } from './saved_objects/dashboard_saved_object';
import type { ConfigType } from './config';
import { UI_SETTINGS } from '../common/ui_settings';
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
  private readonly config: ConfigType;

  constructor(context: PluginInitializerContext<ConfigType>) {
    this.logger = context.logger.get();
    this.config = context.config.get();
  }

  public setup(core: BootcampPluginCoreSetup, plugins: BootcampServerPluginSetupDeps) {
    this.logger.info('BootcampPlugin setup');
    this.logger.info(`BootcampPlugin config: ${JSON.stringify(this.config)}`);

    const libs: BootcampBackendLibs = {
      core,
      config: this.config,
      logger: this.logger,
      getStartServices: () => core.getStartServices(),
      plugins,
      router: core.http.createRouter(),
    };

    // Register the dashboard saved object type
    core.savedObjects.registerType(dashboardSavedObjectType);

    // Register the UI settings
    core.uiSettings.register(UI_SETTINGS);

    // Register the routes
    registerBootcampRoutes(libs);

    // Register the features
    registerBootcampFeatures(plugins.features);

    return {};
  }

  public start(core: CoreStart, plugins: BootcampServerPluginStartDeps) {
    this.logger.info('BootcampPlugin start');
    return {};
  }

  public stop() {}
}
