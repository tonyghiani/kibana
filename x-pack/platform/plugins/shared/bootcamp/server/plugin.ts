/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PluginInitializerContext, Logger, CoreStart } from '@kbn/core/server';
import type {
  BootcampPluginCoreSetup,
  BootcampServerPluginSetupDeps,
  BootcampServerPluginStartDeps,
  BootcampServerSetup,
  BootcampServerStart,
} from './types';

export class BootcampPlugin {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(
    core: BootcampPluginCoreSetup,
    plugins: BootcampServerPluginSetupDeps
  ): BootcampServerSetup {
    this.logger.info('bootcamp: Setup');

    core.getStartServices().then(([coreStart, pluginsStart, startContract]) => {
      this.logger.info('bootcamp: getStartServices');
      startContract.logStart();
    });

    return {
      logSetup: () => this.logger.info('Hello setup'),
    };
  }

  public start(core: CoreStart, plugins: BootcampServerPluginStartDeps): BootcampServerStart {
    this.logger.info('bootcamp: Start');

    return {
      logStart: () => this.logger.info('Hello start'),
    };
  }
}
