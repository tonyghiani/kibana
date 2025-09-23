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
} from './types';

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

  constructor(context: PluginInitializerContext) {
    this.logger = context.logger.get();
  }

  public setup(core: BootcampPluginCoreSetup, plugins: BootcampServerPluginSetupDeps) {
    this.logger.info('BootcampPlugin setup');
    plugins.fieldsMetadata.registerIntegrationFieldsExtractor(() => Promise.resolve({}));
    return {};
  }

  public start(core: CoreStart, plugins: BootcampServerPluginStartDeps) {
    this.logger.info('BootcampPlugin start');
    return {};
  }

  public stop() {}
}
