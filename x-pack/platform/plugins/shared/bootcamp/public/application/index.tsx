/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters, CoreStart } from '@kbn/core/public';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router } from '@kbn/shared-ux-router';
import type { BootcampPublicPluginStartDeps, BootcampPublicStart } from '../types';
import { BootCampApp } from './bootcamp_app';
import { BootcampAppContextProvider } from '../hooks/use_kibana';

export function renderApp(
  coreStart: CoreStart,
  pluginsStart: BootcampPublicPluginStartDeps,
  myServices: BootcampPublicStart,
  params: AppMountParameters
) {
  const { element, history } = params;

  ReactDOM.render(
    <BootcampAppContextProvider
      core={coreStart}
      params={params}
      plugins={pluginsStart}
      myServices={myServices}
    >
      <Router history={history}>
        <BootCampApp />
      </Router>
    </BootcampAppContextProvider>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
}
