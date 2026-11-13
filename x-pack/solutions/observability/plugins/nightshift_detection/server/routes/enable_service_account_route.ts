/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import { inject, injectable } from 'inversify';
import type { IKibanaResponse, KibanaRequest, KibanaResponseFactory } from '@kbn/core/server';
import type { RouteSecurity } from '@kbn/core-http-server';
import { PluginStart } from '@kbn/core-di';
import { Request, Response } from '@kbn/core-di-server';
import type { SpacesPluginStart } from '@kbn/spaces-plugin/server';
import type { DetectionEngineEnableBody } from '../../common/service_account';
import { AvailabilityService } from '../lib/availability/availability_service';
import { DetectionSetupService } from '../lib/service_account/setup_service';
import { BaseEngineRoute } from './base_engine_route';
import { SERVICE_ACCOUNT_API_PATH } from './constants';

// Ids are opaque: `kibana/<name>` on stateful, a generated id on Serverless.
const SERVICE_ACCOUNT_ID_MAX_LENGTH = 1024;

/** Sets the current space up to run the detection engine as the given service account. */
@injectable()
export class EnableServiceAccountRoute extends BaseEngineRoute<DetectionEngineEnableBody> {
  static method = 'post' as const;
  static path = `${SERVICE_ACCOUNT_API_PATH}/_enable`;
  // Binding is authorized by Elasticsearch against manage_security. Route privileges cannot
  // express a cluster privilege, so the setup service checks it and the route only needs a user.
  static security: RouteSecurity = {
    authz: {
      enabled: false,
      reason:
        'Delegates to Elasticsearch and Core, which require manage_security for workload binding',
    },
  };
  static options = {
    access: 'internal' as const,
    summary: 'Set up the detection engine in this space to run as its service account',
    description:
      'Binds the deployment-wide detection service account to this space. Requires the manage_security cluster privilege and an existing role for the account; the engine never creates the role.',
  };
  static validate = {
    request: {
      body: schema.object({
        serviceAccountId: schema.string({ minLength: 1, maxLength: SERVICE_ACCOUNT_ID_MAX_LENGTH }),
      }),
    },
  };

  constructor(
    @inject(Request) request: KibanaRequest<unknown, unknown, DetectionEngineEnableBody>,
    @inject(Response) response: KibanaResponseFactory,
    @inject(AvailabilityService) availability: AvailabilityService,
    @inject(PluginStart<SpacesPluginStart>('spaces')) spaces: SpacesPluginStart,
    @inject(DetectionSetupService) private readonly setup: DetectionSetupService
  ) {
    super(request, response, availability, spaces);
  }

  protected async execute(): Promise<IKibanaResponse> {
    const result = await this.setup.enable({
      request: this.request,
      spaceId: this.getSpaceId(),
      serviceAccountId: this.request.body.serviceAccountId,
    });

    return this.response.ok({ body: result });
  }
}
