/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { BootcampBackendLibs } from '../types';
import { BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE } from '../saved_objects/dashboard_saved_object';

export const registerCreateDashboardRoute = ({ router, logger }: BootcampBackendLibs) => {
  router.post(
    {
      path: '/internal/bootcamp/dashboards',
      validate: {
        body: schema.object({
          title: schema.string({ maxLength: 100 }),
          description: schema.maybe(schema.string({ maxLength: 1000 })),
        }),
      },
      security: {
        authz: {
          requiredPrivileges: ['bootcamp_write'],
        },
      },
    },
    async (ctx, req, res) => {
      logger.info(`Creating dashboard!`);
      const { savedObjects } = await ctx.core;

      const { title, description } = req.body;

      const resultResponse = await savedObjects.client.create(
        BOOTCAMP_DASHBOARD_SAVED_OBJECT_TYPE,
        {
          title,
          description,
        }
      );

      return res.ok({
        body: {
          resultResponse,
        },
      });
    }
  );
};
