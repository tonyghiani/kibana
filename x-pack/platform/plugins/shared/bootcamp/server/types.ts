/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup } from '@kbn/core/server';
import type {
  FieldsMetadataServerSetup,
  FieldsMetadataServerStart,
} from '@kbn/fields-metadata-plugin/server';

export type BootcampPluginCoreSetup = CoreSetup<BootcampServerPluginStartDeps, BootcampServerStart>;

export interface BootcampServerSetup {
  logSetup: () => void;
}

export interface BootcampServerStart {
  logStart: () => void;
}

export interface BootcampServerPluginSetupDeps {
  fieldsMetadata: FieldsMetadataServerSetup;
}

export interface BootcampServerPluginStartDeps {
  fieldsMetadata: FieldsMetadataServerStart;
}
