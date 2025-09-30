/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { SavedObjectsFindResponse } from '@kbn/core/server';
import { BOOTCAMP_MAX_SEARCH_RESULTS_SETTING } from '../../common/ui_settings';
import type { BootcampDashboardSavedObjectAttributes } from '../saved_objects/dashboard_saved_object_type';
import { BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE } from '../saved_objects/dashboard_saved_object_type';
import type { BootcampServerLibs } from '../types';

export const registerFindDashboardsRoute = (libs: BootcampServerLibs) => {
  const { logger, router, config } = libs;

  router.get(
    {
      path: '/internal/bootcamp/dashboards',
      validate: {
        query: schema.object({
          search: schema.maybe(schema.string({ maxLength: 10 })),
        }),
      },
      options: {
        access: 'internal',
      },
      security: {
        authz: {
          requiredPrivileges: ['read_dashboards'],
        },
      },
    },
    async (context, request, response) => {
      const { search } = request.query;

      try {
        const { savedObjects, uiSettings } = await context.core;

        const perPage =
          (await uiSettings.client.get<number>(BOOTCAMP_MAX_SEARCH_RESULTS_SETTING)) ??
          config.dashboards.maxSearchResults;

        const savedObjectsResponse =
          await savedObjects.client.find<BootcampDashboardSavedObjectAttributes>({
            type: BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE,
            search: search ? `*${search}*` : undefined,
            searchFields: ['description'],
            perPage,
            page: 1,
          });

        return response.ok({ body: { dashboards: parseDashboardListSO(savedObjectsResponse) } });
      } catch (error) {
        logger.info(`Failed to find dashboards: ${error.message}`);
        return response.customError({
          statusCode: 500,
          body: { message: 'Failed to find dashboards' },
        });
      }
    }
  );
};

const parseDashboardListSO = (
  savedObjectsResponse: SavedObjectsFindResponse<BootcampDashboardSavedObjectAttributes>
) => {
  const dashboards = savedObjectsResponse.saved_objects.map((dashboardSO) => {
    const { title, description } = dashboardSO.attributes;
    return { title, description };
  });

  return dashboards;
};
