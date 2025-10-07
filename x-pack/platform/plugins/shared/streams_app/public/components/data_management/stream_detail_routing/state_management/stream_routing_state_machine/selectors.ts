/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createSelector } from 'reselect';
import { flattenObject } from '@kbn/object-utils';
import type { FlattenRecord } from '@kbn/streams-schema';
import type { StreamRoutingContext } from './types';
import type { RoutingSamplesContext } from './routing_samples_state_machine';

/**
 * Selects the set of dotted fields that are not supported by the current simulation.
 */
export const selectCurrentPartition = createSelector(
  [
    (context: StreamRoutingContext) => context.routing,
    (context: StreamRoutingContext) => context.currentPartitionId,
  ],
  (routing, currentPartitionId) => {
    const currentPartition = routing.find((rule) => rule.id === currentPartitionId);

    if (!currentPartition) {
      throw new Error('Current routing rule not found');
    }

    return currentPartition;
  }
);

/**
 * Selects the documents used for the data preview table.
 */
export const selectPreviewDocuments = createSelector(
  [(context: RoutingSamplesContext) => context.documents],
  (documents) => {
    return documents.map((doc) => flattenObject(doc)) as FlattenRecord[];
  }
);
