/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters } from '@kbn/core/public';
import { DEFAULT_APP_CATEGORIES, type CoreStart } from '@kbn/core/public';
import type {
  BootcampClientCoreSetup,
  BootcampClientPluginClass,
  BootcampPublicPluginSetup,
  BootcampPublicPluginStart,
  BootcampPublicSetup,
} from './types';
import { BootcampDashboardsService } from './services/bootcamp_dashboards_service';
import { BootcampLocator } from '../common/locator';

export class BootcampPlugin implements BootcampClientPluginClass {
  setup(
    coreSetup: BootcampClientCoreSetup,
    plugins: BootcampPublicPluginSetup
  ): BootcampPublicSetup {
    plugins.share.url.locators.create(new BootcampLocator());

    coreSetup.application.register({
      id: 'bootcamp',
      title: 'Bootcamp',
      category: DEFAULT_APP_CATEGORIES.observability,
      appRoute: '/app/bootcamp',
      euiIconType: 'logoObservability',
      async mount(params: AppMountParameters) {
        const { renderApp } = await import('./application');
        const [coreStart, pluginsStart, myServices] = await coreSetup.getStartServices();

        return renderApp(coreStart, pluginsStart, myServices, params);
      },
    });

    return {};
  }

  start(coreStart: CoreStart, plugins: BootcampPublicPluginStart) {
    const dashboardsService = new BootcampDashboardsService(coreStart.http);

    return {
      dashboardsService,
    };
  }
}
