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
  BootcampServerPluginSetupDeps,
  BootcampServerPluginStartDeps,
  BootcampServerSetup,
  BootcampServerStart,
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

  constructor(initContext: PluginInitializerContext) {
    this.logger = initContext.logger.get();
  }

  setup(
    core: CoreSetup<BootcampServerPluginStartDeps, BootcampServerStart>,
    plugins: BootcampServerPluginSetupDeps
  ): BootcampServerSetup {
    this.logger.info('Bootcamp plugin setup');

    core.getStartServices().then(([coreStart, pluginsStart, bootcampStart]) => {
      bootcampStart.bootcampLogService.warn('Bootcamp plugin setup');
    });

    const bootcampLogService = {
      warn: (message: string) => this.logger.warn(message),
      error: (message: string) => this.logger.error(message),
    };

    return {
      bootcampLogService,
    };
  }

  start(core: CoreStart, plugins: BootcampServerPluginStartDeps): BootcampServerStart {
    this.logger.info('Bootcamp plugin start');

    const bootcampLogService = {
      warn: (message: string) => this.logger.warn(message),
      error: (message: string) => this.logger.error(message),
    };

    return {
      bootcampLogService,
    };
  }
}
