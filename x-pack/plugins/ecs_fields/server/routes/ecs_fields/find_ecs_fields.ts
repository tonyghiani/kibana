/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createValidationFunction } from '../../../common/runtime_types';
import { FIND_ECS_FIELDS_URL } from '../../../common/ecs_fields';
import * as ecsFieldsV1 from '../../../common/ecs_fields/v1';
import { EcsFieldsBackendLibs } from '../../lib/shared_types';

export const initFindEcsFieldsRoute = ({ router, getStartServices }: EcsFieldsBackendLibs) => {
  router.versioned
    .get({
      access: 'internal',
      path: FIND_ECS_FIELDS_URL,
    })
    .addVersion(
      {
        version: '1',
        validate: {
          request: {
            query: createValidationFunction(ecsFieldsV1.findEcsFieldsRequestQueryRT),
          },
        },
      },
      async (_requestContext, request, response) => {
        const { fieldNames } = request.query as ecsFieldsV1.FindEcsFieldsRequestQuery;
        const { ecsFields } = (await getStartServices())[2];
        const ecsFieldsClient = ecsFields.getClient();

        try {
          const fields = ecsFieldsClient.find({ fieldNames });

          return response.ok({
            body: ecsFieldsV1.findEcsFieldsResponsePayloadRT.encode({ fields }),
          });
        } catch (error) {
          return response.customError({
            statusCode: error.statusCode ?? 500,
            body: {
              message: error.message ?? 'An unexpected error occurred',
            },
          });
        }
      }
    );
};
