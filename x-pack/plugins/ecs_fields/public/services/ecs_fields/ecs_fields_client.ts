/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { HttpStart } from '@kbn/core/public';
import {
  FindEcsFieldsRequestQuery,
  findEcsFieldsRequestQueryRT,
  FindEcsFieldsResponsePayload,
  findEcsFieldsResponsePayloadRT,
} from '../../../common/latest';
import { FIND_ECS_FIELDS_URL } from '../../../common/ecs_fields';
import { decodeOrThrow } from '../../../common/runtime_types';
import { IEcsFieldsClient } from './types';

export class EcsFieldsClient implements IEcsFieldsClient {
  constructor(private readonly http: HttpStart) {}

  public async find({
    fieldNames,
  }: FindEcsFieldsRequestQuery): Promise<FindEcsFieldsResponsePayload> {
    const query = findEcsFieldsRequestQueryRT.encode({ fieldNames });

    const response = await this.http
      .get(FIND_ECS_FIELDS_URL, { query, version: '1' })
      .catch((error) => {
        throw new Error(`Failed to fetch ecs fields ${fieldNames?.join() ?? ''}: ${error}`);
      });

    const data = decodeOrThrow(
      findEcsFieldsResponsePayloadRT,
      (message: string) =>
        new Error(`Failed to decode ecs fields ${fieldNames?.join() ?? ''}: ${message}"`)
    )(response);

    return data;
  }
}
