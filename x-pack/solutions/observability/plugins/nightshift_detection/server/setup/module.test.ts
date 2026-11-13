/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Container } from 'inversify';
import { of } from 'rxjs';
import { coreMock, loggingSystemMock } from '@kbn/core/server/mocks';
import { cloudMock } from '@kbn/cloud-plugin/server/mocks';
import { licensingMock } from '@kbn/licensing-plugin/server/mocks';
import { Logger, OnSetup, OnStart, PluginSetup, PluginStart } from '@kbn/core-di';
import { CoreSetup, CoreStart, PluginInitializer } from '@kbn/core-di-server';
import { module } from '..';
import { AvailabilityService } from '../lib/availability/availability_service';
import { DetectionEngineSystemClient, EngineDataClient } from '../lib/engine/es_client_tokens';
import { EngineRunner } from '../lib/engine/run_engine';
import { EnabledSources, RunContext } from '../lib/engine/tokens';
import { DetectionAccountService } from '../lib/service_account/detection_account';
import { DetectionSetupService } from '../lib/service_account/setup_service';
import { DetectionSignalStore } from '../lib/signals/signal_store';
import { StateStore } from '../lib/state/state_store';
import { StrategyCatalog } from '../lib/strategies/strategy_catalog';

function createContainer({ withCloud }: { withCloud: boolean }) {
  const core = coreMock.createStart();
  core.featureFlags.getBooleanValue$.mockReturnValue(of(true));

  const container = new Container({ defaultScope: 'Singleton' });
  container.bind(CoreStart('elasticsearch')).toConstantValue(core.elasticsearch);
  container.bind(CoreStart('featureFlags')).toConstantValue(core.featureFlags);
  container.bind(Logger).toConstantValue(loggingSystemMock.createLogger());
  container.bind(CoreStart('pricing')).toConstantValue(core.pricing);
  container.bind(CoreStart('security')).toConstantValue(core.security);
  container.bind(CoreSetup('security')).toConstantValue(coreMock.createSetup().security);
  container
    .bind(PluginInitializer('env'))
    .toConstantValue(coreMock.createPluginInitializerContext().env);
  container.bind(PluginStart('spaces')).toConstantValue({});
  container.bind(PluginStart('licensing')).toConstantValue(licensingMock.createStart());
  if (withCloud) {
    container.bind(PluginSetup('cloud')).toConstantValue(cloudMock.createSetup());
  }
  // What the `_tick` route binds for each tick.
  container
    .bind(RunContext)
    .toConstantValue({ spaceId: 'default', runId: 'run-1', scheduledMinute: 0 });
  container.bind(EnabledSources).toConstantValue({ list: async () => [] });
  container.bind(EngineDataClient).toConstantValue(core.elasticsearch.client.asInternalUser);
  container.load(module);

  return { container, core };
}

describe('nightshift detection module', () => {
  // A new binding in the module goes in this list, so a missing dependency fails here and not
  // at Kibana start.
  it('resolves every token the module binds', () => {
    const { container, core } = createContainer({ withCloud: true });

    container.get(AvailabilityService);
    container.get(StrategyCatalog);
    container.get(EngineRunner);
    container.get(DetectionSignalStore);
    container.get(StateStore);
    container.get(DetectionAccountService);
    container.get(DetectionSetupService);
    container.getAll(OnSetup);
    // The module itself binds an OnStart hook next to the plugin's, so ask for all of them.
    container.getAll(OnStart);
    // D11: engine indices are written as kibana_system, never as the requesting user.
    expect(container.get(DetectionEngineSystemClient)).toBe(
      core.elasticsearch.client.asInternalUser
    );
  });

  it('resolves the availability service when the cloud plugin is disabled', () => {
    const { container } = createContainer({ withCloud: false });

    container.get(AvailabilityService);
  });
});
