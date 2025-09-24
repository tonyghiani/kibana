/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { UiSettingsParams } from '@kbn/core/server';
import { schema } from '@kbn/config-schema';

export const UI_SETTINGS: Record<string, UiSettingsParams> = {
  'bootcamp:max_results_size': {
    name: 'Max results size',
    value: 10,
    type: 'number',
    category: ['observability'],
    description: 'The maximum number of results to return',
    schema: schema.number(),
    solutionViews: ['classic'],
  },
};
