/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect, useMemo } from 'react';
import { createActorContext, useSelector } from '@xstate5/react';
import { createConsoleInspector } from '@kbn/xstate-utils';
import type { RoutingDefinition } from '@kbn/streams-schema';
import {
  streamRoutingMachine,
  createStreamRoutingMachineImplementations,
} from './stream_routing_state_machine';
import type { StreamRoutingInput, StreamRoutingServiceDependencies } from './types';
import type { RoutingDefinitionWithUIAttributes } from '../../types';
import type {
  DocumentMatchFilterOptions,
  RoutingSamplesActorRef,
  RoutingSamplesActorSnapshot,
} from './routing_samples_state_machine';

const consoleInspector = createConsoleInspector();

const StreamRoutingContext = createActorContext(streamRoutingMachine);

export const useStreamsRoutingSelector = StreamRoutingContext.useSelector;
export const useStreamsRoutingActorRef = StreamRoutingContext.useActorRef;

export type StreamRoutingEvents = ReturnType<typeof useStreamRoutingEvents>;

export const useStreamRoutingEvents = () => {
  const service = StreamRoutingContext.useActorRef();

  return useMemo(
    () => ({
      cancelChanges: () => {
        service.send({ type: 'partition.cancel' });
      },
      changePartition: (partition: Partial<RoutingDefinitionWithUIAttributes>) => {
        service.send({ type: 'partition.change', partition });
      },
      createPartition: () => {
        service.send({ type: 'partition.create' });
      },
      removePartition: async () => {
        service.send({ type: 'partition.remove' });
      },
      reorderPartitions: (routing: RoutingDefinitionWithUIAttributes[]) => {
        service.send({ type: 'partition.reorder', routing });
      },
      editPartition: (id: string) => {
        service.send({ type: 'partition.edit', id });
      },
      forkStream: async (partition?: RoutingDefinition) => {
        service.send({ type: 'partition.fork', partition });
      },
      saveChanges: () => {
        service.send({ type: 'partition.save' });
      },
      setDocumentMatchFilter: (filter: DocumentMatchFilterOptions) => {
        service.send({ type: 'routingSamples.setDocumentMatchFilter', filter });
      },
      reviewPartitionSuggestion: (id: string) => {
        service.send({ type: 'suggestion.review', id });
      },
    }),
    [service]
  );
};

export const StreamRoutingContextProvider = ({
  children,
  definition,
  ...deps
}: React.PropsWithChildren<StreamRoutingServiceDependencies & StreamRoutingInput>) => {
  return (
    <StreamRoutingContext.Provider
      logic={streamRoutingMachine.provide(createStreamRoutingMachineImplementations(deps))}
      options={{
        id: 'streamRouting',
        inspect: consoleInspector,
        input: {
          definition,
        },
      }}
    >
      <ListenForDefinitionChanges definition={definition}>{children}</ListenForDefinitionChanges>
    </StreamRoutingContext.Provider>
  );
};

const ListenForDefinitionChanges = ({
  children,
  definition,
}: React.PropsWithChildren<StreamRoutingInput>) => {
  const service = StreamRoutingContext.useActorRef();

  useEffect(() => {
    service.send({ type: 'stream.received', definition });
  }, [definition, service]);

  return children;
};

export const useStreamSamplesRef = () => {
  return useStreamsRoutingSelector(
    (state) => state.children.routingSamplesMachine as RoutingSamplesActorRef | undefined
  );
};

export const useStreamSamplesSelector = <T,>(
  selector: (snapshot: RoutingSamplesActorSnapshot) => T
): T => {
  const routingSamplesRef = useStreamSamplesRef();

  if (!routingSamplesRef) {
    throw new Error(
      'useStreamSamplesSelector must be used within a StreamEnrichmentContextProvider'
    );
  }

  return useSelector(routingSamplesRef, selector);
};
