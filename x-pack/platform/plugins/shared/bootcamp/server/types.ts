/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { SpacesPluginSetup, SpacesPluginStart } from '@kbn/spaces-plugin/server';
import type {
  FieldsMetadataServerSetup,
  FieldsMetadataServerStart,
} from '@kbn/fields-metadata-plugin/server';

export interface BootcampServerPluginSetupDeps {
  spaces: SpacesPluginSetup;
  fieldsMetadata?: FieldsMetadataServerSetup;
}

export interface BootcampServerSetup {
  bootcampLogService: {
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}

export interface BootcampServerPluginStartDeps {
  spaces: SpacesPluginStart;
  fieldsMetadata?: FieldsMetadataServerStart;
}

export interface BootcampServerStart {
  bootcampLogService: {
    warn: (message: string) => void;
    error: (message: string) => void;
  };
}
