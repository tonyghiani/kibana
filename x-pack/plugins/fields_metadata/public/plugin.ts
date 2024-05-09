/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreStart } from '@kbn/core/public';
import { FieldsMetadataService } from './services/fields_metadata';
import {
  FieldsMetadataClientCoreSetup,
  FieldsMetadataClientPluginClass,
  FieldsMetadataClientSetupDeps,
  FieldsMetadataClientStartDeps,
} from './types';

export class FieldsMetadataPlugin implements FieldsMetadataClientPluginClass {
  private fieldsMetadata: FieldsMetadataService;

  constructor() {
    this.fieldsMetadata = new FieldsMetadataService();
  }

  public setup(_: FieldsMetadataClientCoreSetup, pluginsSetup: FieldsMetadataClientSetupDeps) {
    const fieldsMetadata = this.fieldsMetadata.setup();

    return { fieldsMetadata };
  }

  public start(core: CoreStart, plugins: FieldsMetadataClientStartDeps) {
    const { http } = core;

    const fieldsMetadata = this.fieldsMetadata.start({
      http,
    });

    return {
      fieldsMetadata,
    };
  }

  public stop() {}
}
