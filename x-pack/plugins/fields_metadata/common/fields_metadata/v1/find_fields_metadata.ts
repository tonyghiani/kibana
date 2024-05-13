/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { jsonRt } from '@kbn/io-ts-utils';
import * as rt from 'io-ts';
import { ecsFlatRT, fieldMetadataRT } from '../types';

export const findFieldsMetadataRequestQueryRT = rt.exact(
  rt.partial({
    fieldNames: jsonRt.pipe(rt.array(rt.string)),
  })
);

export const findFieldsMetadataResponsePayloadRT = rt.type({
  fieldsMetadata: rt.record(rt.string, ecsFlatRT),
});

export type FindFieldsMetadataRequestQuery = rt.TypeOf<typeof findFieldsMetadataRequestQueryRT>;
export type FindFieldsMetadataResponsePayload = rt.TypeOf<
  typeof findFieldsMetadataResponsePayloadRT
>;
