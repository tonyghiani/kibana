/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { IRouter } from '@kbn/core/server';
import type { ILicenseState } from '../../../../lib';
import type { AlertingRequestHandlerContext } from '../../../../types';
import { INTERNAL_BASE_ALERTING_API_PATH } from '../../../../types';
import { verifyAccessAndContext } from '../../../lib';
import { API_PRIVILEGES } from '../../../../../common';
import { transformQueryDelaySettingsToResponseV1 } from '../../transforms';
import type { GetQueryDelaySettingsResponseV1 } from '../../../../../common/routes/rules_settings/apis/get';

export const getQueryDelaySettingsRoute = (
  router: IRouter<AlertingRequestHandlerContext>,
  licenseState: ILicenseState
) => {
  router.get(
    {
      path: `${INTERNAL_BASE_ALERTING_API_PATH}/rules/settings/_query_delay`,
      validate: {},
      security: {
        authz: {
          requiredPrivileges: [`${API_PRIVILEGES.READ_QUERY_DELAY_SETTINGS}`],
        },
      },
      options: {
        access: 'internal',
      },
    },
    router.handleLegacyErrors(
      verifyAccessAndContext(licenseState, async function (context, req, res) {
        const rulesSettingsClient = (await context.alerting).getRulesSettingsClient();
        const queryDelaySettings = await rulesSettingsClient.queryDelay().get();
        const response: GetQueryDelaySettingsResponseV1 =
          transformQueryDelaySettingsToResponseV1(queryDelaySettings);

        return res.ok(response);
      })
    )
  );
};
