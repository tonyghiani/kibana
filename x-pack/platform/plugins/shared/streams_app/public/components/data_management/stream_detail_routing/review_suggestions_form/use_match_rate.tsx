/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Streams } from '@kbn/streams-schema';
import { useMemo } from 'react';
import { useActor } from '@xstate5/react';
import { createConsoleInspector } from '@kbn/xstate-utils';
import type { ReviewSuggestionsInputs } from './use_review_suggestions_form';
import { useKibana } from '../../../../hooks/use_kibana';
import { createDocumentsCountCollectorActor } from '../state_management/stream_routing_state_machine/routing_samples_state_machine';

const consoleInspector = createConsoleInspector();

export const useMatchRate = (
  definition: Streams.WiredStream.GetResponse,
  partition: ReviewSuggestionsInputs['suggestions'][number]
) => {
  const { data } = useKibana().dependencies.start;

  const actorLogic = useMemo(
    () => createDocumentsCountCollectorActor({ data }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, partition.condition, definition] // Actor restarts when these change
  );

  const [snapshot] = useActor(actorLogic, {
    input: {
      condition: partition.condition,
      definition,
    },
    inspect: consoleInspector,
  });

  return {
    value: snapshot.status === 'done' ? snapshot.context : undefined,
    loading: snapshot.status === 'active',
  };
};
