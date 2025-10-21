/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { BootcampServerLibs } from '../types';
import type { DashboardSavedObjectAttributes } from '../saved_objects/dashboard_saved_object';
import { BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE } from '../saved_objects/dashboard_saved_object';
import { extractDashboardAttributes } from '../utils/dashboard_utils';

export function registerCreateDashboardRoute(libs: BootcampServerLibs) {
  const { router, logger } = libs;

  router.post(
    {
      path: '/internal/bootcamp/dashboards',
      validate: {
        body: schema.object({
          title: schema.string({ maxLength: 100 }),
          author: schema.string(),
        }),
      },
      options: {
        access: 'internal',
      },
      security: {
        authz: {
          requiredPrivileges: ['create_bootcamp_dashboards'],
        },
      },
    },
    async (context, request, response) => {
      const { title, author } = request.body;

      const { savedObjects } = await context.core;

      try {
        const createdDashboardSavedObject =
          await savedObjects.client.create<DashboardSavedObjectAttributes>(
            BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE,
            {
              title,
              author,
            }
          );

        return response.created({
          body: {
            dashboard: extractDashboardAttributes(createdDashboardSavedObject),
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
