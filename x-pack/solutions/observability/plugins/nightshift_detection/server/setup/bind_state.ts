/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ContainerModuleLoadOptions } from 'inversify';
import { ElasticsearchStateStore } from '../lib/state/elasticsearch_state_store';
import { StateIndex } from '../lib/state/state_index';
import { StateStore } from '../lib/state/state_store';

/** Binds the state index and the store on it. Tests bind their own `StateStore`. */
export function bindState({ bind }: ContainerModuleLoadOptions): void {
  bind(StateIndex).toSelf().inSingletonScope();
  bind(StateStore).to(ElasticsearchStateStore).inSingletonScope();
}
