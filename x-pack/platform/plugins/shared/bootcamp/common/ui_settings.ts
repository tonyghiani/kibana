/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { UiSettingsParams } from '@kbn/core/server';

export const BOOTCAMP_MAX_SEARCH_RESULTS_SETTING = 'bootcamp:maxSearchResults';

export const BOOTCAMP_UI_SETTINGS: Record<string, UiSettingsParams> = {
  [BOOTCAMP_MAX_SEARCH_RESULTS_SETTING]: {
    name: 'Bootcamp Max Search Results',
    value: 5,
    type: 'number',
    description:
      'The maximum number of search results to return for the bootcamp dashboard search.',
    schema: schema.number(),
  },
};
