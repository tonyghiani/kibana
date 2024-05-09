/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreSetup, CoreStart, Plugin as PluginClass } from '@kbn/core/public';

import { FieldsMetadataServiceSetup, FieldsMetadataServiceStart } from './services/fields_metadata';

export interface FieldsMetadataClientSetupExports {
  fieldsMetadata: FieldsMetadataServiceSetup;
}

export interface FieldsMetadataClientStartExports {
  fieldsMetadata: FieldsMetadataServiceStart;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldsMetadataClientSetupDeps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldsMetadataClientStartDeps {}

export type FieldsMetadataClientCoreSetup = CoreSetup<
  FieldsMetadataClientStartDeps,
  FieldsMetadataClientStartExports
>;
export type FieldsMetadataClientCoreStart = CoreStart;
export type FieldsMetadataClientPluginClass = PluginClass<
  FieldsMetadataClientSetupExports,
  FieldsMetadataClientStartExports,
  FieldsMetadataClientSetupDeps,
  FieldsMetadataClientStartDeps
>;

export type FieldsMetadataClientStartServicesAccessor =
  FieldsMetadataClientCoreSetup['getStartServices'];
export type FieldsMetadataClientStartServices =
  ReturnType<FieldsMetadataClientStartServicesAccessor>;
