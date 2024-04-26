/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreStart } from '@kbn/core/public';
import { EcsFieldsService } from './services/ecs_fields';
import {
  EcsFieldsClientCoreSetup,
  EcsFieldsClientPluginClass,
  EcsFieldsClientSetupDeps,
  EcsFieldsClientStartDeps,
} from './types';

export class EcsFieldsPlugin implements EcsFieldsClientPluginClass {
  private ecsFields: EcsFieldsService;

  constructor() {
    this.ecsFields = new EcsFieldsService();
  }

  public setup(_: EcsFieldsClientCoreSetup, pluginsSetup: EcsFieldsClientSetupDeps) {
    const ecsFields = this.ecsFields.setup();

    return { ecsFields };
  }

  public start(core: CoreStart, plugins: EcsFieldsClientStartDeps) {
    const { http } = core;

    const ecsFields = this.ecsFields.start({
      http,
    });

    return {
      ecsFields,
    };
  }

  public stop() {}
}
