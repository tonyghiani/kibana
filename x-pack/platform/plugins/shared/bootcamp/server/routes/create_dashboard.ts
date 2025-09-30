/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { SavedObject } from '@kbn/core/server';
import type { BootcampDashboardSavedObjectAttributes } from '../saved_objects/dashboard_saved_object_type';
import { BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE } from '../saved_objects/dashboard_saved_object_type';
import type { BootcampServerLibs } from '../types';

export const registerCreateDashboardRoute = (libs: BootcampServerLibs) => {
  const { router } = libs;

  router.post(
    {
      path: '/internal/bootcamp/dashboards',
      validate: {
        body: schema.object({
          title: schema.string({ maxLength: 50 }),
          description: schema.string({ maxLength: 1000 }),
        }),
      },
      security: {
        authz: {
          requiredPrivileges: ['create_dashboards'],
        },
      },
    },
    async (context, request, response) => {
      const { title, description } = request.body;

      try {
        const { savedObjects } = await context.core;

        const dashboard = await savedObjects.client.create(BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE, {
          title,
          description,
        });

        return response.created({ body: { dashboard: parseDashboardSO(dashboard) } });
      } catch (error) {
        if (true) {
          return response.forbidden({
            body: { message: 'You do not have permission to create dashboards' },
          });
        }

        return response.customError({
          statusCode: 500,
          body: { message: 'Failed to create dashboard' },
        });
      }
    }
  );
};

const parseDashboardSO = (dashboard: SavedObject<BootcampDashboardSavedObjectAttributes>) => {
  const { title, description } = dashboard.attributes;
  return { title, description };
};
