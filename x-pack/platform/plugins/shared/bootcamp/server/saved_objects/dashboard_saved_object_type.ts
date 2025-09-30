/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { SavedObjectsType } from '@kbn/core/server';

export const BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE = 'bootcamp_dashboard';

export interface BootcampDashboardSavedObjectAttributes {
  title: string;
  description: string;
}

export const dashboardSavedObjectType: SavedObjectsType<BootcampDashboardSavedObjectAttributes> = {
  name: BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE,
  hidden: false,
  namespaceType: 'multiple-isolated',
  mappings: {
    properties: {
      title: { type: 'keyword' },
      description: { type: 'text' },
    },
  },
};
