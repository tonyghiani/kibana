/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { SavedObjectsFindResult } from '@kbn/core/server';
import type { BootcampBackendLibs } from '../types';
import type { DashboardSavedObjectAttributes } from '../saved_objects/dashboard_saved_object';
import { BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE } from '../saved_objects/dashboard_saved_object';

export const registerFindDashboardRoute = ({ router, logger, config }: BootcampBackendLibs) => {
  router.get(
    {
      path: '/internal/bootcamp/dashboards',
      validate: {
        query: schema.object({
          search: schema.maybe(schema.string()),
        }),
      },
      security: {
        authz: {
          requiredPrivileges: ['bootcamp_read'],
        },
      },
    },
    async (ctx, req, res) => {
      logger.info(`Finding dashboards!`);
      const { savedObjects, uiSettings } = await ctx.core;

      const { search } = req.query;

      const perPage =
        (await uiSettings.client.get('bootcamp:max_results_size')) ?? config.maxResultsSize;

      try {
        const savedObjectsResponse = await savedObjects.client.find<DashboardSavedObjectAttributes>(
          {
            type: BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE,
            search: search ? `*${search}*` : undefined,
            searchFields: ['title', 'description'],
            page: 1,
            perPage,
          }
        );

        // Never forward the saved_objects to the client, extract only necessary fields
        const dashboards = savedObjectsResponse.saved_objects.map(parseDashboardSO);

        return res.ok({
          body: {
            dashboards,
          },
        });
      } catch (error) {
        return res.customError({
          statusCode: 500,
          body: {
            message: error.message,
          },
        });
      }
    }
  );
};

const parseDashboardSO = (savedObject: SavedObjectsFindResult<DashboardSavedObjectAttributes>) => {
  return {
    title: savedObject.attributes.title,
    description: savedObject.attributes.description,
  };
};
