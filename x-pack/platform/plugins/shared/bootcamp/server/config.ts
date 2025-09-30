/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { PluginConfigDescriptor } from '@kbn/core/server';

export interface BootcampConfig {
  dashboards: {
    maxSearchResults: number;
  };
}

export const config: PluginConfigDescriptor<BootcampConfig> = {
  schema: schema.object({
    dashboards: schema.object({
      maxSearchResults: schema.number({ defaultValue: 3 }),
    }),
  }),
};
