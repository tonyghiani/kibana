/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PluginInitializerContext, CoreStart, Plugin, Logger } from '@kbn/core/server';

import {
  EcsFieldsPluginCoreSetup,
  EcsFieldsPluginSetup,
  EcsFieldsPluginStart,
  EcsFieldsServerPluginSetupDeps,
  EcsFieldsServerPluginStartDeps,
} from './types';
import { initEcsFieldsServer } from './ecs_fields_server';
import { EcsFieldsService } from './services/ecs_fields';
import { EcsFieldsBackendLibs } from './lib/shared_types';

export class EcsFieldsPlugin
  implements
    Plugin<
      EcsFieldsPluginSetup,
      EcsFieldsPluginStart,
      EcsFieldsServerPluginSetupDeps,
      EcsFieldsServerPluginStartDeps
    >
{
  private readonly logger: Logger;
  private libs!: EcsFieldsBackendLibs;
  private ecsFieldsService: EcsFieldsService;

  constructor(context: PluginInitializerContext) {
    this.logger = context.logger.get();

    this.ecsFieldsService = new EcsFieldsService();
  }

  public setup(core: EcsFieldsPluginCoreSetup, plugins: EcsFieldsServerPluginSetupDeps) {
    const ecsFields = this.ecsFieldsService.setup();

    this.libs = {
      getStartServices: () => core.getStartServices(),
      logger: this.logger,
      plugins,
      router: core.http.createRouter(),
    };

    // Register server side APIs
    initEcsFieldsServer(this.libs);

    return {
      ecsFields,
    };
  }

  public start(core: CoreStart, plugins: EcsFieldsServerPluginStartDeps) {
    const ecsFields = this.ecsFieldsService.start();

    return { ecsFields };
  }

  public stop() {}
}
