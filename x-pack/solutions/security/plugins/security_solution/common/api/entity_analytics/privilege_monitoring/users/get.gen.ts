/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Privileged User Monitoring API
 *   version: 2023-10-31
 */

import { z } from '@kbn/zod';

import { MonitoredUserDoc } from './common.gen';

export type GetPrivMonUserRequestParams = z.infer<typeof GetPrivMonUserRequestParams>;
export const GetPrivMonUserRequestParams = z.object({
  id: z.string(),
});
export type GetPrivMonUserRequestParamsInput = z.input<typeof GetPrivMonUserRequestParams>;

export type GetPrivMonUserResponse = z.infer<typeof GetPrivMonUserResponse>;
export const GetPrivMonUserResponse = MonitoredUserDoc;
