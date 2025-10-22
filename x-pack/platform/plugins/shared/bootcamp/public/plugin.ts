/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters } from '@kbn/core/public';
import {
  DEFAULT_APP_CATEGORIES,
  type CoreSetup,
  type CoreStart,
  type Plugin,
} from '@kbn/core/public';
import type {
  BootcampPublicPluginSetupDeps,
  BootcampPublicPluginStartDeps,
  BootcampPublicSetup,
  BootcampPublicStart,
} from './types';
import { BootcampDashboardService } from './services/dashboard_service';
import { BootcampLocatorDefinition } from '../common/locator';

export class BootcampPlugin
  implements
    Plugin<
      BootcampPublicSetup,
      BootcampPublicStart,
      BootcampPublicPluginSetupDeps,
      BootcampPublicPluginStartDeps
    >
{
  public setup(
    core: CoreSetup<BootcampPublicPluginStartDeps, BootcampPublicStart>,
    plugins: BootcampPublicPluginSetupDeps
  ): BootcampPublicSetup {
    plugins.share.url.locators.create(new BootcampLocatorDefinition());

    core.application.register({
      id: 'bootcamp',
      title: 'Bootcamp',
      category: DEFAULT_APP_CATEGORIES.kibana,
      appRoute: '/app/bootcamp',
      mount: async (params: AppMountParameters) => {
        const { renderApp } = await import('./application');

        const [coreStart, pluginsStart, myServices] = await core.getStartServices();

        return renderApp(coreStart, pluginsStart, myServices, params);
      },
    });

    return {};
  }

  public start(core: CoreStart, plugins: BootcampPublicPluginStartDeps): BootcampPublicStart {
    const dashboardService = new BootcampDashboardService(core.http);

    return {
      dashboardService,
    };
  }
}
