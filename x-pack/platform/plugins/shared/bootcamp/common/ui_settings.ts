/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { UiSettingsParams } from '@kbn/core/server';

export const BOOTCAMP_MAX_SEARCH_RESULTS_SETTING = 'bootcamp:maxSearchResults';

export const UI_SETTINGS: Record<string, UiSettingsParams> = {
  [BOOTCAMP_MAX_SEARCH_RESULTS_SETTING]: {
    name: 'Bootcamp max search results',
    value: 3,
    type: 'number',
    description: 'Maximum number of search results to display',
    schema: schema.number(),
  },
};
