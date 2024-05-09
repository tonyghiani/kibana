/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as rt from 'io-ts';
import { EcsFlat } from '@elastic/ecs';

export type TEcsFlat = typeof EcsFlat;

export const ecsFieldNameRT = rt.keyof(EcsFlat);

export type EcsFieldName = rt.TypeOf<typeof ecsFieldNameRT>;
