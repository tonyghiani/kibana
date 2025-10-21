/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import { BOOTCAMP_MAX_SEARCH_RESULTS_SETTING } from '@kbn/bootcamp-plugin/common/ui_settings';
import type { BootcampServerLibs } from '../types';
import type { DashboardSavedObjectAttributes } from '../saved_objects/dashboard_saved_object';
import { BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE } from '../saved_objects/dashboard_saved_object';
import { extractDashboardAttributes } from '../utils/dashboard_utils';

export function registerFindDashboardRoute(libs: BootcampServerLibs) {
  const { router, logger, config } = libs;

  router.get(
    {
      path: '/internal/bootcamp/dashboards',
      validate: {
        query: schema.object({
          search: schema.maybe(schema.string({ minLength: 2 })),
        }),
      },
      security: {
        authz: {
          requiredPrivileges: ['read_bootcamp_dashboards'],
        },
      },
      options: {
        access: 'internal',
      },
    },
    async (context, request, response) => {
      const { search } = request.query;

      const { savedObjects, uiSettings } = await context.core;

      try {
        const maxSearchResultUISetting = await uiSettings.client.get<number>(
          BOOTCAMP_MAX_SEARCH_RESULTS_SETTING
        );

        const dashboardSavedObjects =
          await savedObjects.client.find<DashboardSavedObjectAttributes>({
            type: BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE,
            search: search ? `*${search}*` : undefined,
            searchFields: ['title'],
            perPage: maxSearchResultUISetting ?? config.dashboards.maxSearchResults,
          });

        const dashboards = dashboardSavedObjects.saved_objects.map(extractDashboardAttributes);

        return response.ok({
          body: {
            dashboards,
          },
        });
      } catch (error) {
        // Handle error cases

        return response.customError({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );
}
