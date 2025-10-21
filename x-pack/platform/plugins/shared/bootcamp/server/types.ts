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
import type { IRouter, Logger } from '@kbn/core/server';
import type { FeaturesPluginSetup, FeaturesPluginStart } from '@kbn/features-plugin/server';
import type { BootcampConfig } from './config';

export interface BootcampServerPluginSetupDeps {
  spaces: SpacesPluginSetup;
  fieldsMetadata?: FieldsMetadataServerSetup;
  features?: FeaturesPluginSetup;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampServerSetup {}

export interface BootcampServerPluginStartDeps {
  spaces: SpacesPluginStart;
  fieldsMetadata?: FieldsMetadataServerStart;
  features?: FeaturesPluginStart;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampServerStart {}

export interface BootcampServerLibs {
  router: IRouter;
  logger: Logger;
  config: BootcampConfig;
}
