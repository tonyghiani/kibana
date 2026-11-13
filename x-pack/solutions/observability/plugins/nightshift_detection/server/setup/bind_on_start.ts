/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { OnStart } from '@kbn/core-di';
import type { ContainerModuleLoadOptions } from 'inversify';
import { FallbackSignalStore } from '../lib/signals/fallback_signal_store';
import { StrategyCatalog } from '../lib/strategies/strategy_catalog';

/** Start-time work of the plugin: later phases add their initialisation here. */
export function bindOnStart({ bind }: ContainerModuleLoadOptions): void {
  // Resolving the catalog here makes a duplicate strategy id fail at start rather than at the
  // first tick.
  bind(OnStart).toResolvedValue(
    (_catalog: StrategyCatalog, signalStore: FallbackSignalStore) => async () => {
      // In the background: Elasticsearch may be slow or unavailable at start, and a failure here
      // must not stop Kibana. `ensureReady` logs it and the first write retries it.
      signalStore.ensureReady().catch(() => {});
    },
    [StrategyCatalog, FallbackSignalStore]
  );
}
