/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { inject, injectable } from 'inversify';
import type { IKibanaResponse, KibanaRequest, KibanaResponseFactory } from '@kbn/core/server';
import type { RouteSecurity } from '@kbn/core-http-server';
import { PluginStart } from '@kbn/core-di';
import { Request, Response } from '@kbn/core-di-server';
import { NIGHTSHIFT_API_PRIVILEGES } from '@kbn/nightshift-shared';
import type { SpacesPluginStart } from '@kbn/spaces-plugin/server';
import { AvailabilityService } from '../lib/availability/availability_service';
import { DetectionSetupService } from '../lib/service_account/setup_service';
import { BaseEngineRoute } from './base_engine_route';
import { SERVICE_ACCOUNT_API_PATH } from './constants';

/** Reports how the current space is set up: the account it runs as, and whether the user may set it up. */
@injectable()
export class GetServiceAccountStatusRoute extends BaseEngineRoute {
  static method = 'get' as const;
  static path = SERVICE_ACCOUNT_API_PATH;
  static security: RouteSecurity = {
    authz: { requiredPrivileges: [NIGHTSHIFT_API_PRIVILEGES.read] },
  };
  static options = {
    access: 'internal' as const,
    summary: 'Get the detection engine service account setup of this space',
    description:
      'Returns the account the space runs as, or null when it is not set up, the role the account must hold and whether the current user can set the space up.',
  };
  static validate = false as const;

  constructor(
    @inject(Request) request: KibanaRequest,
    @inject(Response) response: KibanaResponseFactory,
    @inject(AvailabilityService) availability: AvailabilityService,
    @inject(PluginStart<SpacesPluginStart>('spaces')) spaces: SpacesPluginStart,
    @inject(DetectionSetupService) private readonly setup: DetectionSetupService
  ) {
    super(request, response, availability, spaces);
  }

  protected async execute(): Promise<IKibanaResponse> {
    const status = await this.setup.getStatus({
      request: this.request,
      spaceId: this.getSpaceId(),
    });

    return this.response.ok({ body: status });
  }
}
