/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { MachineImplementationsFrom, ActorRefFrom } from 'xstate5';
import { assign, and, enqueueActions, setup, sendTo, assertEvent } from 'xstate5';
import { getPlaceholderFor } from '@kbn/xstate-utils';
import type { Streams } from '@kbn/streams-schema';
import { isSchema, routingDefinitionListSchema } from '@kbn/streams-schema';
import { ALWAYS_CONDITION } from '@kbn/streamlang';
import { isEmpty } from 'lodash';
import type {
  StreamRoutingContext,
  StreamRoutingEvent,
  StreamRoutingInput,
  StreamRoutingServiceDependencies,
} from './types';
import {
  createUpsertStreamActor,
  createStreamFailureNofitier,
  createStreamSuccessNofitier,
  createForkStreamActor,
  createDeleteStreamActor,
} from './stream_actors';
import { routingConverter } from '../../utils';
import type { RoutingDefinitionWithUIAttributes } from '../../types';
import { selectCurrentPartition } from './selectors';
import {
  createRoutingSamplesMachineImplementations,
  routingSamplesMachine,
} from './routing_samples_state_machine';
import type { PartitionSuggestion } from './suggestions_actors';
import {
  createSuggestionsFailureNofitier,
  createSuggestionsGeneratorActor,
} from './suggestions_actors';

export type StreamRoutingActorRef = ActorRefFrom<typeof streamRoutingMachine>;

export const streamRoutingMachine = setup({
  types: {
    input: {} as StreamRoutingInput,
    context: {} as StreamRoutingContext,
    events: {} as StreamRoutingEvent,
  },
  actors: {
    deleteStream: getPlaceholderFor(createDeleteStreamActor),
    forkStream: getPlaceholderFor(createForkStreamActor),
    upsertStream: getPlaceholderFor(createUpsertStreamActor),
    generateSuggestions: getPlaceholderFor(createSuggestionsGeneratorActor),
    routingSamplesMachine: getPlaceholderFor(() => routingSamplesMachine),
  },
  actions: {
    notifyStreamSuccess: getPlaceholderFor(createStreamSuccessNofitier),
    notifyStreamFailure: getPlaceholderFor(createStreamFailureNofitier),
    notifySuggestionsFailure: getPlaceholderFor(createSuggestionsFailureNofitier),
    refreshDefinition: () => {},
    addPartition: assign(({ context }) => {
      const newPartition = routingConverter.toUIDefinition({
        destination: `${context.definition.stream.name}.child`,
        where: ALWAYS_CONDITION,
        status: 'enabled',
        isNew: true,
      });

      return {
        currentPartitionId: newPartition.id,
        routing: [...context.routing, newPartition],
      };
    }),
    patchPartition: assign(
      ({ context }, params: { partition: Partial<RoutingDefinitionWithUIAttributes> }) => ({
        routing: context.routing.map((partition) =>
          partition.id === context.currentPartitionId
            ? { ...partition, ...params.partition }
            : partition
        ),
      })
    ),
    reorderRouting: assign((_, params: { routing: RoutingDefinitionWithUIAttributes[] }) => ({
      routing: params.routing,
    })),
    resetRoutingChanges: assign(({ context }) => ({
      currentPartitionId: null,
      routing: context.initialRouting,
    })),
    setupRouting: assign((_, params: { definition: Streams.WiredStream.GetResponse }) => {
      const routing = params.definition.stream.ingest.wired.routing.map(
        routingConverter.toUIDefinition
      );

      return {
        currentPartitionId: null,
        initialRouting: routing,
        routing,
      };
    }),
    storeCurrentPartitionId: assign(
      (_, params: { id: StreamRoutingContext['currentPartitionId'] }) => ({
        currentPartitionId: params.id,
      })
    ),
    storeDefinition: assign((_, params: { definition: Streams.WiredStream.GetResponse }) => ({
      definition: params.definition,
    })),
    storeSuggestions: assign((_, params: { suggestions: PartitionSuggestion[] }) => ({
      suggestions: params.suggestions,
    })),
    removeSuggestion: assign(({ context }, params: { name: string }) => ({
      suggestions: context.suggestions.filter((suggestion) => suggestion.name !== params.name),
    })),
    storeSuggestedPartitionId: assign(
      (_, params: { id: StreamRoutingContext['suggestedPartitionId'] }) => ({
        suggestedPartitionId: params.id,
      })
    ),
    resetSuggestedPartitionId: assign(() => ({
      suggestedPartitionId: null,
    })),
  },
  guards: {
    canForkStream: and(['hasManagePrivileges', 'isValidRouting']),
    canReorderPartitions: and(['hasManagePrivileges', 'hasMultiplePartitions']),
    canUpdateStream: and(['hasManagePrivileges', 'isValidRouting']),
    hasMultiplePartitions: ({ context }) => context.routing.length > 1,
    hasManagePrivileges: ({ context }) => context.definition.privileges.manage,
    hasSimulatePrivileges: ({ context }) => context.definition.privileges.simulate,
    hasSuggestions: (_, params: { partitions: PartitionSuggestion[] }) =>
      !isEmpty(params.partitions),
    isAlreadyEditing: ({ context }, params: { id: string }) =>
      context.currentPartitionId === params.id,
    isValidRouting: ({ context }) =>
      isSchema(routingDefinitionListSchema, context.routing.map(routingConverter.toAPIDefinition)),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCcD2BXALgSwHZQGVNkwBDAWwDo9sdSAbbALzygGIBtABgF1FQADqli1sqXPxAAPRACZZATkoA2AIwAWABwL1sgKybZG1bIA0IAJ6IAzKr2V1XLgs3WA7Jq7uFb5QF8-czQsViISCkpwiAs2WGIyKhIAYzBsADdIbj4kECERHHFJGQRVBS5ZSh9y8uU9PWtrPTdzKwRZdWVKTWVZQz0FOx7ZNz0AoIwcfDCEyLJo6gh6MDZgyagAJXQlyiTwzDAsyTzRQpzi9V1KPWUFAe1Pa2UevRbEVVLOrmv39W9DdTGIFWoXiESiFgWSxWE1Ym22kFohxyxwKEjONk09lkQ00vgMei4yk0rxKhK4lDcdzc1gGqlqdkBwKmoMScwh2EWyyZGy2YFmqGQEDAyCRgmEJzRoGKAFpVNYuuo3HYdKpCQplE5iZY3rIuOpKIpugomnpdN0AYEgTDmeFWaR5rsyGsAHJgADucL5SQAFqR8KxoSF8J6dn6UvRRblxaiim8vJouho9HLNJjk8p1CSbhUCXTGj51WprIzrYQWbN7RDHaQXe6Qz6-VAA9z6778AdeEdo2JJdI3o8lNZ1Ap3Lj2t0ta0iRVbCPDO9rJ4TCWg2XbRWHXtWK6Pbydm2m-hA2sQwjMJGUT3YyUMzm9L1hh03PpVCTKaoHNcDI0NNiRyu1mmME2R2Ld8B3VtG2bUsQwAMwFABrC9u1OKU41+FRHBpW5qWUIdM21Uk9QpDV500Ewbn-S1uSAu1Nydbc6z3eDkAQgMIHEPk8DSVAEL5FiENogBBJJMAFZD8ivdEEGpD8enKNxFMcZ8BjfYdKBpJpFEJG4mlUACQXXcFQIY8CmO2ASA2FNBkEoAR6BrFiqAE4TRPEztkRQ3tilVHwHGpLRVBGWx3jMQjtHsJofFqU03EVTQLXGVdaI3CEz1hPcG39I8W0yvYO2yMVJNQvsSkaTolQ8Wd3gSkcSVC-UPF1OpFRcPVi2o0sUuM9Lg0yg9oNXeswzACMPKKiVr0MeVXD1dV3D0lx6tNckOgUXUjC+dp5AMm0Zh6iBRD67YssPdhcpOg8Cq7YrvLeNxnEoPUCWxZQ4sVRd6rehMLmfDQuA8e9Rk65LywOo6eUuqCcpgvczwkybpLsIwHFUWbzX0Wd6pChwCwUh7XCaXa132kDeshr0Bphoa4cO89VEKqNbuvIKOieoldB6X5+n0erfiUfouA0dx3jnNxie6sm6YyqHsvO2HthIchUAyBGYyRoLOkcbp3Cedb1HqPn2hUP8Ae2g2EolsGpYhyC5ePGW+VgUhVfGpnEbQkoPgNXodF6AxdEeerfHJVVuiFgHbhMcWQcA63K0ocmQyVlXHbYDjcC43AeL4yghSWfZXLEkU3cvErikaNwunI-n4rUIKXkIkwLie75hcpf4raMm2Tz3FO0jT6yBTshzMCcvPRrAQuWRE4u1akz2TEUfy6gDnRasnN56i12bCXkWRGkMLvSYTpO93QAQIBrNOM6znO+Qv2BhUwIv3MZsu7oQSuDSCw+LnKRUFxg76EoHYU0Pg6RaHXsfYCp9pbHQfpfa+CC2BD1svZRyAoqCP2fq-Eu78vIs3kAmciGhfB-SGF9IcVxGh6QzN8PUMC6IQhIAKIUyBHawH5IKYUg1e6KzAGw4U89y79h6D7awAMCRaCHAoEkzVyRxV-v0OUdJ9Kx0MifeYrCeEcIQVwnR7C+GO1DLgcMIjP4Eh+joY0NIYqmkbq0XUQUnoAIaLoAGHQmGpW4UY-RvjeHU34U7F211PLMyRl8ckTxhw6BuAlRQyh5ENCrpRcoi40Z4UYRovasDtGCN0ZwygF8r5x1tOnTi1Bs68UQU-ZAL8Z5uXwTdD2pVA5XHXs+A+9Rky-HkUYTopR1ClEeIqL43jjKGMCRTLhJTkEkwoKg5ANkR6YOQNggQdSGm2lnm-Fp6tF6qnJLqDwHclRAMIvIR6AwMkJSVO4AIlpcCoCFPAHINEWT7IXqVWUj07nKmGWqDUr4m4t3oWUDwPhXDWHaN4mgdBGAsHwF80RbQ6RdCeEYIKQVPDDmsMkioSYyg3LRnmYGSUylaNaBNA5Py1AKiVP0QFNxgUkkXFXWcjgfAjHvOMnJCzmGQjACiz++glBqjuG1R4zwSQJQTD0P6DR1TkRjhSzReSqxgSgBBXkIrrxKnJF8LQwx9CeF6CSe8H5yIjluPoYZosJkgWrLWXcsszp6qRv7BwQxKTbVxORWVGgHANB+KmLa6i1W5MFc6xirr+KIVYB6z2IwExGsMM+Aw5RN4IG0PKOoeELiY2-AoR1cDba6vCa04oNwq4G3Ws+fM1I5FN01v5bmdqPH+H5ZLMtwT9zQygEm0qdJ5AaV9QYXwBtxzLRHBpGxdR1QE1VVaUG3de0mP7o7IdxQRgVCqvXOVcU9TY1VJUd6e94wDFLfMM+2w5nBO3YgOK9g60msbTSYOjwVBcExPofQ1JTSaGvSwgpfiZmPoQLpCkcVfC-qFsMfFTd5oGmGcaHl7hhyyGAwEvRMycOJsrbSnyki80UUUC4GkQ4kmXLId6-ouIyjOEkeSldlKNX4f8fe9V5AINxXlEpWDvLo6IacScroZR3AwphZSU0jy-BAA */
  id: 'routingStream',
  context: ({ input }) => ({
    currentPartitionId: null,
    definition: input.definition,
    initialRouting: [],
    routing: [],
    suggestedPartitionId: null,
    suggestions: [],
  }),
  initial: 'initializing',
  states: {
    initializing: {
      always: 'ready',
    },
    ready: {
      id: 'ready',
      type: 'parallel',
      entry: [
        { type: 'setupRouting', params: ({ context }) => ({ definition: context.definition }) },
      ],
      on: {
        'stream.received': {
          target: '#ready',
          actions: [{ type: 'storeDefinition', params: ({ event }) => event }],
          reenter: true,
        },
        'routingSamples.setDocumentMatchFilter': {
          actions: enqueueActions(({ enqueue, event }) => {
            enqueue.sendTo('routingSamplesMachine', {
              type: 'routingSamples.setDocumentMatchFilter',
              filter: event.filter,
            });
          }),
        },
        'suggestion.preview': {
          target: '#idle',
          actions: enqueueActions(({ enqueue, event }) => {
            enqueue.sendTo('routingSamplesMachine', {
              type: 'routingSamples.setSelectedPreview',
              preview: event.toggle
                ? { type: 'suggestion', name: event.name, index: event.index }
                : undefined,
            });
            enqueue.sendTo('routingSamplesMachine', {
              type: 'routingSamples.updateCondition',
              condition: event.toggle ? event.condition : undefined,
            });
            enqueue.sendTo('routingSamplesMachine', {
              type: 'routingSamples.setDocumentMatchFilter',
              filter: 'matched',
            });
          }),
        },
      },
      invoke: {
        id: 'routingSamplesMachine',
        src: 'routingSamplesMachine',
        input: ({ context }) => ({
          definition: context.definition,
          documentMatchFilter: 'matched',
        }),
      },
      states: {
        partitions: {
          id: 'partitions',
          initial: 'idle',
          states: {
            idle: {
              id: 'idle',
              on: {
                'partition.create': {
                  guard: 'hasSimulatePrivileges',
                  target: 'creatingPartition',
                },
                'partition.edit': {
                  guard: 'hasManagePrivileges',
                  target: 'editingPartition',
                  actions: [{ type: 'storeCurrentPartitionId', params: ({ event }) => event }],
                },
                'partition.reorder': {
                  guard: 'canReorderPartitions',
                  target: 'reorderingPartitions',
                  actions: [{ type: 'reorderRouting', params: ({ event }) => event }],
                },
              },
            },
            creatingPartition: {
              id: 'creatingPartition',
              entry: [
                { type: 'addPartition' },
                sendTo('routingSamplesMachine', {
                  type: 'routingSamples.setSelectedPreview',
                  preview: { type: 'createStream' },
                }),
                sendTo('routingSamplesMachine', {
                  type: 'routingSamples.updateCondition',
                  condition: { always: {} },
                }),
              ],
              exit: [
                { type: 'resetRoutingChanges' },
                sendTo('routingSamplesMachine', {
                  type: 'routingSamples.setSelectedPreview',
                  preview: undefined,
                }),
                sendTo('routingSamplesMachine', {
                  type: 'routingSamples.updateCondition',
                  condition: undefined,
                }),
                sendTo('routingSamplesMachine', {
                  type: 'routingSamples.setDocumentMatchFilter',
                  filter: 'matched',
                }),
              ],
              initial: 'changing',
              states: {
                changing: {
                  on: {
                    'partition.cancel': {
                      target: '#idle',
                      actions: [
                        { type: 'resetRoutingChanges' },
                        sendTo('routingSamplesMachine', {
                          type: 'routingSamples.setDocumentMatchFilter',
                          filter: 'matched',
                        }),
                      ],
                    },
                    'partition.change': {
                      actions: enqueueActions(({ enqueue, event }) => {
                        enqueue({ type: 'patchPartition', params: { partition: event.partition } });

                        // Trigger samples collection only on condition change
                        if (event.partition.where) {
                          enqueue.sendTo('routingSamplesMachine', {
                            type: 'routingSamples.updateCondition',
                            condition: event.partition.where,
                          });
                        }
                      }),
                    },
                    'partition.edit': {
                      guard: 'hasManagePrivileges',
                      target: '#editingPartition',
                      actions: [{ type: 'storeCurrentPartitionId', params: ({ event }) => event }],
                    },
                    'partition.fork': {
                      guard: 'canForkStream',
                      target: 'forking',
                    },
                  },
                },
                forking: {
                  invoke: {
                    id: 'forkStreamActor',
                    src: 'forkStream',
                    input: ({ context }) => {
                      const currentPartition = selectCurrentPartition(context);

                      return {
                        definition: context.definition,
                        where: currentPartition.where,
                        destination: currentPartition.destination,
                        status: currentPartition.status,
                      };
                    },
                    onDone: {
                      target: '#idle',
                      actions: [{ type: 'refreshDefinition' }],
                    },
                    onError: {
                      target: 'changing',
                      actions: [{ type: 'notifyStreamFailure' }],
                    },
                  },
                },
              },
            },
            editingPartition: {
              id: 'editingPartition',
              initial: 'changing',
              entry: [
                sendTo('routingSamplesMachine', {
                  type: 'routingSamples.setSelectedPreview',
                  preview: { type: 'updateStream' },
                }),
              ],
              exit: [{ type: 'resetRoutingChanges' }],
              states: {
                changing: {
                  on: {
                    'partition.create': {
                      guard: 'hasSimulatePrivileges',
                      target: '#creatingPartition',
                    },
                    'partition.cancel': {
                      target: '#idle',
                      actions: [
                        { type: 'resetRoutingChanges' },
                        sendTo('routingSamplesMachine', {
                          type: 'routingSamples.setDocumentMatchFilter',
                          filter: 'matched',
                        }),
                      ],
                    },
                    'partition.change': {
                      actions: [{ type: 'patchPartition', params: ({ event }) => event }],
                    },
                    'partition.edit': [
                      {
                        guard: { type: 'isAlreadyEditing', params: ({ event }) => event },
                        target: '#idle',
                        actions: [{ type: 'storeCurrentPartitionId', params: { id: null } }],
                      },
                      {
                        actions: [
                          { type: 'storeCurrentPartitionId', params: ({ event }) => event },
                        ],
                      },
                    ],
                    'partition.remove': {
                      guard: 'hasManagePrivileges',
                      target: 'removingPartition',
                    },
                    'partition.save': {
                      guard: 'canUpdateStream',
                      target: 'updatingPartition',
                    },
                  },
                },
                removingPartition: {
                  invoke: {
                    id: 'deleteStreamActor',
                    src: 'deleteStream',
                    input: ({ context }) => ({
                      name: selectCurrentPartition(context).destination,
                    }),
                    onDone: {
                      target: '#idle',
                      actions: [{ type: 'refreshDefinition' }],
                    },
                    onError: {
                      target: 'changing',
                    },
                  },
                },
                updatingPartition: {
                  invoke: {
                    id: 'upsertStreamActor',
                    src: 'upsertStream',
                    input: ({ context }) => ({
                      definition: context.definition,
                      routing: context.routing.map(routingConverter.toAPIDefinition),
                    }),
                    onDone: {
                      target: '#idle',
                      actions: [{ type: 'notifyStreamSuccess' }, { type: 'refreshDefinition' }],
                    },
                    onError: {
                      target: 'changing',
                      actions: [{ type: 'notifyStreamFailure' }],
                    },
                  },
                },
              },
            },
            reorderingPartitions: {
              id: 'reorderingPartitions',
              initial: 'reordering',
              entry: [
                sendTo('routingSamplesMachine', {
                  type: 'routingSamples.setSelectedPreview',
                  preview: { type: 'updateStream' },
                }),
              ],
              states: {
                reordering: {
                  on: {
                    'partition.reorder': {
                      actions: [{ type: 'reorderRouting', params: ({ event }) => event }],
                    },
                    'partition.cancel': {
                      target: '#idle',
                      actions: [{ type: 'resetRoutingChanges' }],
                    },
                    'partition.save': {
                      guard: 'canUpdateStream',
                      target: 'updatingStream',
                    },
                  },
                },
                updatingStream: {
                  invoke: {
                    id: 'upsertStreamActor',
                    src: 'upsertStream',
                    input: ({ context }) => ({
                      definition: context.definition,
                      routing: context.routing.map(routingConverter.toAPIDefinition),
                    }),
                    onDone: {
                      target: '#idle',
                      actions: [{ type: 'notifyStreamSuccess' }, { type: 'refreshDefinition' }],
                    },
                    onError: {
                      target: 'reordering',
                      actions: [{ type: 'notifyStreamFailure' }],
                    },
                  },
                },
              },
            },
          },
        },
        suggestions: {
          id: 'suggestions',
          initial: 'hidden',
          states: {
            hidden: {
              on: {
                'suggestion.generate': {
                  target: 'loading',
                },
              },
            },
            loading: {
              invoke: {
                id: 'generateSuggestionsActor',
                src: 'generateSuggestions',
                input: ({ context, event }) => {
                  assertEvent(event, 'suggestion.generate');
                  return {
                    streamName: context.definition.stream.name,
                    connectorId: event.connectorId,
                  };
                },
                onDone: [
                  {
                    guard: { type: 'hasSuggestions', params: ({ event }) => event.output },
                    target: 'listingSuggestions',
                    actions: [
                      {
                        type: 'storeSuggestions',
                        params: ({ event }) => ({ suggestions: event.output.partitions }),
                      },
                    ],
                  },
                  {
                    target: 'noSuggestions',
                  },
                ],
                onError: {
                  target: 'noSuggestions',
                  actions: [{ type: 'notifySuggestionsFailure' }],
                },
              },
            },
            listingSuggestions: {
              id: 'listingSuggestions',
              initial: 'reviewing',
              states: {
                idle: {
                  on: {
                    'suggestion.review': {
                      target: 'reviewing',
                      actions: [
                        { type: 'storeSuggestedPartitionId', params: ({ event }) => event },
                      ],
                    },
                  },
                },
                reviewing: {
                  on: {
                    'suggestion.fork': {
                      guard: 'canForkStream',
                      target: 'forking',
                    },
                    'suggestion.cancel': {
                      target: 'idle',
                      actions: [{ type: 'resetSuggestedPartitionId' }],
                    },
                  },
                },
                forking: {
                  invoke: {
                    id: 'forkStreamActor',
                    src: 'forkStream',
                    input: ({ context, event }) => {
                      assertEvent(event, 'suggestion.fork');

                      const { partition } = event;
                      if (!partition) {
                        throw new Error('No routing partition to fork');
                      }

                      return {
                        definition: context.definition,
                        destination: partition.destination,
                        where: partition.where,
                        status: 'enabled',
                      };
                    },
                    onDone: {
                      target: 'idle',
                      actions: [
                        { type: 'refreshDefinition' },
                        { type: 'resetSuggestedPartitionId' },
                      ],
                    },
                    onError: {
                      target: 'reviewing',
                      actions: [{ type: 'notifyStreamFailure' }],
                    },
                  },
                },
              },
            },
            noSuggestions: {
              on: {
                'suggestion.generate': {
                  target: 'loading',
                },
              },
            },
          },
        },
      },
    },
  },
});

export const createStreamRoutingMachineImplementations = ({
  refreshDefinition,
  streamsRepositoryClient,
  core,
  data,
  timeState$,
  forkSuccessNofitier,
  telemetryClient,
}: StreamRoutingServiceDependencies): MachineImplementationsFrom<typeof streamRoutingMachine> => ({
  actors: {
    deleteStream: createDeleteStreamActor({ streamsRepositoryClient }),
    forkStream: createForkStreamActor({
      streamsRepositoryClient,
      forkSuccessNofitier,
      telemetryClient,
    }),
    upsertStream: createUpsertStreamActor({ streamsRepositoryClient }),
    generateSuggestions: createSuggestionsGeneratorActor({
      data,
      streamsRepositoryClient,
    }),
    routingSamplesMachine: routingSamplesMachine.provide(
      createRoutingSamplesMachineImplementations({
        data,
        timeState$,
      })
    ),
  },
  actions: {
    refreshDefinition,
    notifyStreamSuccess: createStreamSuccessNofitier({
      toasts: core.notifications.toasts,
    }),
    notifyStreamFailure: createStreamFailureNofitier({
      toasts: core.notifications.toasts,
    }),
    notifySuggestionsFailure: createSuggestionsFailureNofitier({
      toasts: core.notifications.toasts,
    }),
  },
});
