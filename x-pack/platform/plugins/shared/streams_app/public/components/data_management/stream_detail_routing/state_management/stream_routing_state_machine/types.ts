/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreStart } from '@kbn/core/public';
import type { APIReturnType, StreamsRepositoryClient } from '@kbn/streams-plugin/public/api';
import type { Streams } from '@kbn/streams-schema';
import type { DataPublicPluginStart } from '@kbn/data-plugin/public';
import type { TimefilterHook } from '@kbn/data-plugin/public/query/timefilter/use_timefilter';
import type { Condition } from '@kbn/streamlang';
import type { RoutingDefinition } from '@kbn/streams-schema';
import type { Observable } from 'rxjs';
import type { StreamsTelemetryClient } from '../../../../../telemetry/client';
import type { RoutingDefinitionWithUIAttributes } from '../../types';
import type { DocumentMatchFilterOptions } from '.';
import type { RoutingSamplesContext } from './routing_samples_state_machine';

export interface StreamRoutingServiceDependencies {
  forkSuccessNofitier: (streamName: string) => void;
  refreshDefinition: () => void;
  streamsRepositoryClient: StreamsRepositoryClient;
  timeState$: TimefilterHook['timeState$'];
  core: CoreStart;
  data: DataPublicPluginStart;
  telemetryClient: StreamsTelemetryClient;
}

export interface StreamRoutingInput {
  definition: Streams.WiredStream.GetResponse;
}

export interface StreamRoutingContext {
  currentPartitionId: string | null;
  definition: Streams.WiredStream.GetResponse;
  initialRouting: RoutingDefinitionWithUIAttributes[];
  routing: RoutingDefinitionWithUIAttributes[];
  suggestedPartitionId: string | null;
  suggestions: PartitionSuggestion[];
}

export type StreamRoutingEvent =
  | { type: 'stream.received'; definition: Streams.WiredStream.GetResponse }
  | { type: 'partition.cancel' }
  | { type: 'partition.change'; partition: Partial<RoutingDefinitionWithUIAttributes> }
  | { type: 'partition.create' }
  | { type: 'partition.edit'; id: string }
  | { type: 'partition.fork'; partition?: RoutingDefinition }
  | { type: 'partition.reorder'; routing: RoutingDefinitionWithUIAttributes[] }
  | { type: 'partition.remove' }
  | { type: 'partition.save' }
  | { type: 'routingSamples.setDocumentMatchFilter'; filter: DocumentMatchFilterOptions }
  | { type: 'routingSamples.setSelectedPreview'; preview: RoutingSamplesContext['selectedPreview'] }
  | { type: 'suggestion.generate'; connectorId: string }
  | { type: 'suggestion.review'; id: string }
  | { type: 'suggestion.fork'; partition?: RoutingDefinition }
  | { type: 'suggestion.cancel' }
  | {
      type: 'suggestion.preview';
      condition: Condition;
      name: string;
      index: number;
      toggle?: boolean;
    };

type UnwrapObservable<T> = T extends Observable<infer U> ? U : never;
export type PartitionsSuggestionsResponse = UnwrapObservable<
  APIReturnType<'POST /internal/streams/{name}/_suggest_partitions'>
>;

export type PartitionSuggestion = PartitionsSuggestionsResponse['partitions'][number];
