/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ContainerModuleLoadOptions } from 'inversify';
import { FallbackSignalStore } from '../lib/signals/fallback_signal_store';
import { DetectionSignalStore } from '../lib/signals/signal_store';

/**
 * Binds the signal store to the fallback data stream. Once Alerting v2 can take engine signals
 * through its external signal path (kibana#304859), a `.rule-events` store replaces this
 * binding and the fallback store goes away.
 */
export function bindSignals({ bind }: ContainerModuleLoadOptions): void {
  bind(FallbackSignalStore).toSelf().inSingletonScope();
  bind(DetectionSignalStore).toService(FallbackSignalStore);
}
