/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { PluginConfigDescriptor } from '@kbn/core/server';
import { schema } from '@kbn/config-schema';

export interface ConfigType {
  maxResultsSize: number;
}

export const config: PluginConfigDescriptor<ConfigType> = {
  schema: schema.object({
    maxResultsSize: schema.number({ defaultValue: 5 }),
  }),
};
