/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { injectable } from 'inversify';
import type { IKibanaResponse, KibanaRequest, KibanaResponseFactory } from '@kbn/core/server';
import type { RouteHandler } from '@kbn/core-di-server';
import type { SpacesPluginStart } from '@kbn/spaces-plugin/server';
import type { AvailabilityService } from '../lib/availability/availability_service';
import { EngineHttpError } from '../lib/errors/engine_http_error';

/**
 * Shared edge of the engine's routes: a 404 when Nightshift is not available, and typed engine
 * failures turned into responses. Anything else is rethrown for Core to answer with a 500.
 */
@injectable()
export abstract class BaseEngineRoute<TBody = unknown> implements RouteHandler {
  constructor(
    protected readonly request: KibanaRequest<unknown, unknown, TBody>,
    protected readonly response: KibanaResponseFactory,
    private readonly availability: AvailabilityService,
    private readonly spaces: SpacesPluginStart
  ) {}

  /** The route's work. Runs only when the engine is available. */
  protected abstract execute(): Promise<IKibanaResponse>;

  public async handle(): Promise<IKibanaResponse> {
    try {
      if (!(await this.availability.isAvailable())) {
        throw new EngineHttpError('Nightshift detection is not available.', 404);
      }

      return await this.execute();
    } catch (error) {
      if (error instanceof EngineHttpError) {
        return this.response.customError({
          statusCode: error.statusCode,
          body: { message: error.message },
        });
      }

      throw error;
    }
  }

  /** The space the request is made in. */
  protected getSpaceId(): string {
    return this.spaces.spacesService.getSpaceId(this.request);
  }
}
