/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ErrorActorEvent } from 'xstate5';
import { fromPromise } from 'xstate5';
import type { errors as esErrors } from '@elastic/elasticsearch';
import type { IToasts } from '@kbn/core/public';
import { i18n } from '@kbn/i18n';
import { lastValueFrom } from 'rxjs';
import { getFormattedError } from '../../../../../util/errors';
import type { PartitionsSuggestionsResponse, StreamRoutingServiceDependencies } from './types';
import { getAbsoluteTimestamps } from './utils';

export interface PartitionsSuggestionsInput {
  streamName: string;
  connectorId: string;
}

/**
 * Suggestions generator actor factory
 * This actor is used to generate suggestions for a stream's partitions
 */
export function createSuggestionsGeneratorActor({
  data,
  streamsRepositoryClient,
}: Pick<StreamRoutingServiceDependencies, 'streamsRepositoryClient' | 'data'>) {
  return fromPromise<PartitionsSuggestionsResponse, PartitionsSuggestionsInput>(
    ({ input, signal }) => {
      const { start, end } = getAbsoluteTimestamps(data);

      // The only reason we're streaming the response here is to avoid timeout issues prevalent with long-running requests to LLMs.
      // There is only ever going to be a single event emitted so we can safely use `lastValueFrom`.
      return lastValueFrom(
        streamsRepositoryClient.stream('POST /internal/streams/{name}/_suggest_partitions', {
          signal,
          params: {
            path: { name: input.streamName },
            body: {
              connector_id: input.connectorId,
              start,
              end,
            },
          },
        })
      );
    }
  );
}

/**
 * Notifier factories
 */
export const createSuggestionsFailureNofitier =
  ({ toasts }: { toasts: IToasts }) =>
  (params: { event: unknown }) => {
    const event = params.event as ErrorActorEvent<esErrors.ResponseError, string>;
    const formattedError = getFormattedError(event.error);
    toasts.addError(formattedError, {
      title: i18n.translate('xpack.streams.failedToGenerateSuggestions', {
        defaultMessage: 'Failed to generate suggestions',
      }),
      toastMessage: formattedError.message,
      toastLifeTimeMs: 5000,
    });
  };
