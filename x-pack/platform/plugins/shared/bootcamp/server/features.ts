/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { DEFAULT_APP_CATEGORIES } from '@kbn/core/server';
import type { FeaturesPluginSetup } from '@kbn/features-plugin/server';
import { BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE } from './saved_objects/dashboard_saved_object';

export function registerBootcampFeatures(features?: FeaturesPluginSetup) {
  if (!features) return;

  features.registerKibanaFeature({
    id: 'bootcamp',
    name: 'Bootcamp',
    description: 'Bootcamp features',
    category: DEFAULT_APP_CATEGORIES.management,
    app: [],
    privileges: {
      all: {
        api: ['read_bootcamp_dashboards', 'create_bootcamp_dashboards'],
        savedObject: {
          all: [BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE],
          read: [],
        },
        ui: ['read', 'write'],
      },
      read: {
        api: ['read_bootcamp_dashboards'],
        savedObject: {
          all: [],
          read: [BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE],
        },
        ui: ['read'],
      },
    },
  });
}
