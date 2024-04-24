/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PluginInitializerContext, CoreStart, Plugin } from '@kbn/core/server';

import {
  EcsFieldsPluginCoreSetup,
  EcsFieldsPluginSetup,
  EcsFieldsPluginStart,
  EcsFieldsServerPluginSetupDeps,
  EcsFieldsServerPluginStartDeps,
} from './types';
import { initEcsFieldsServer } from './ecs_fields_server';
import { LogViewsService } from './services/fields';
import { KibanaFramework } from './lib/adapters/framework/kibana_framework_adapter';
import { EcsFieldsBackendLibs } from './lib/ecs_fields_types';
import { EcsFieldsConfig } from '../common/plugin_config';

export class EcsFieldsPlugin
  implements
    Plugin<
      EcsFieldsPluginSetup,
      EcsFieldsPluginStart,
      EcsFieldsServerPluginSetupDeps,
      EcsFieldsServerPluginStartDeps
    >
{
  private libs!: EcsFieldsBackendLibs;
  private logViews: LogViewsService;

  constructor(context: PluginInitializerContext<EcsFieldsConfig>) {
    this.logViews = new LogViewsService(this.logger.get('logViews'));
  }

  public setup(core: EcsFieldsPluginCoreSetup, plugins: EcsFieldsServerPluginSetupDeps) {
    const framework = new KibanaFramework(core, plugins);

    const logViews = this.logViews.setup();

    this.libs = {
      framework,
      getStartServices: () => core.getStartServices(),
    };

    // Register server side APIs
    initEcsFieldsServer(this.libs);

    return {
      logViews,
    };
  }

  public start(core: CoreStart, plugins: EcsFieldsServerPluginStartDeps) {
    const logViews = this.logViews.start({
      savedObjects: core.savedObjects,
      dataViews: plugins.dataViews,
      elasticsearch: core.elasticsearch,
    });

    return { logViews };
  }

  public stop() {}
}
