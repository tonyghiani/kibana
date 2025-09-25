/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters } from '@kbn/core/public';
import { DEFAULT_APP_CATEGORIES } from '@kbn/core/public';
import type {
  BootcampClientCoreSetup,
  BootcampClientCoreStart,
  BootcampClientPluginClass,
  BootcampPublicSetupDeps,
} from './types';
import { BootcampDashboardService } from './services/bootcamp_dashboard_service';
import { BootcampLocatorDefinition } from '../common/locator';

export class BootcampPlugin implements BootcampClientPluginClass {
  public setup(core: BootcampClientCoreSetup, plugins: BootcampPublicSetupDeps) {
    plugins.share.url.locators.create(new BootcampLocatorDefinition());

    core.application.register({
      id: 'bootcamp',
      title: 'Bootcamp',
      category: DEFAULT_APP_CATEGORIES.kibana,
      appRoute: '/app/bootcamp',
      mount: async (params: AppMountParameters) => {
        const { renderApp } = await import('./application');
        const [coreStart, pluginsStart, depsStart] = await core.getStartServices();
        return renderApp(coreStart, pluginsStart, depsStart, params);
      },
    });

    return {};
  }

  public start(core: BootcampClientCoreStart) {
    const dashboardService = new BootcampDashboardService(core.http);

    return {
      dashboardService,
    };
  }
}
