/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters, CoreStart } from '@kbn/core/public';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@kbn/shared-ux-router';
import { BootcampApp } from './bootcamp_app';
import type { BootcampPublicPluginStart, BootcampPublicStart } from '../types';
import { BootcampAppContextProvider } from '../hooks/use_kibana';

export function renderApp(
  coreStart: CoreStart,
  pluginsStart: BootcampPublicPluginStart,
  myServices: BootcampPublicStart,
  params: AppMountParameters
) {
  const { element, history } = params;

  ReactDOM.render(
    <BootcampAppContextProvider
      coreStart={coreStart}
      pluginsStart={pluginsStart}
      params={params}
      myServices={myServices}
    >
      <Router history={history}>
        <BootcampApp />
      </Router>
    </BootcampAppContextProvider>,
    element
  );

  return () => {
    ReactDOM.unmountComponentAtNode(element);
  };
}
