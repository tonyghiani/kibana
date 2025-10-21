/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { SavedObject } from '@kbn/core/server';
import type { DashboardSavedObjectAttributes } from '../saved_objects/dashboard_saved_object';

export function extractDashboardAttributes(
  dashboardSavedObject: SavedObject<DashboardSavedObjectAttributes>
) {
  const { title, author } = dashboardSavedObject.attributes;
  return {
    title,
    author,
  };
}
