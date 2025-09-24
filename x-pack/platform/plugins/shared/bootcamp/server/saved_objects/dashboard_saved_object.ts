/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { SavedObjectsType } from '@kbn/core/server';

export const BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE = 'bootcamp-dashboard';

export interface DashboardSavedObjectAttributes {
  title: string;
  description: string;
}

export const dashboardSavedObjectType: SavedObjectsType<DashboardSavedObjectAttributes> = {
  name: BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE,
  hidden: false,
  namespaceType: 'multiple-isolated',
  mappings: {
    properties: {
      title: { type: 'text' },
      description: { type: 'text' },
    },
  },
};
