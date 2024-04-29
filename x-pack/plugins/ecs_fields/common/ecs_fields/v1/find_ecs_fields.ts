/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { jsonRt } from '@kbn/io-ts-utils';
import * as rt from 'io-ts';
import { ecsFieldNameRT } from '../types';

export const findEcsFieldsRequestQueryRT = rt.exact(
  rt.partial({
    fieldNames: jsonRt.pipe(rt.array(ecsFieldNameRT)),
  })
);

export const findEcsFieldsResponsePayloadRT = rt.type({
  fields: rt.record(ecsFieldNameRT, rt.UnknownRecord),
});

export type FindEcsFieldsRequestQuery = rt.TypeOf<typeof findEcsFieldsRequestQueryRT>;
export type FindEcsFieldsResponsePayload = rt.TypeOf<typeof findEcsFieldsResponsePayloadRT>;
