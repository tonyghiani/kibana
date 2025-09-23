/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup } from '@kbn/core/server';
import type { FieldsMetadataServerSetup } from '@kbn/fields-metadata-plugin/server';

export type BootcampPluginCoreSetup = CoreSetup<BootcampServerPluginStartDeps, BootcampServerStart>;
export type BootcampPluginStartServicesAccessor = BootcampPluginCoreSetup['getStartServices'];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampServerSetup {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampServerStart {}

export interface BootcampServerPluginSetupDeps {
  fieldsMetadata: FieldsMetadataServerSetup;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootcampServerPluginStartDeps {}
