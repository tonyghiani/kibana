/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters } from '@kbn/core/public';
import ReactDOM from 'react-dom';
import React from 'react';
import { Router } from '@kbn/shared-ux-router';
import type {
  BootcampClientCoreStart,
  BootcampPublicStart,
  BootcampPublicStartDeps,
} from '../types';
import { BootcampAppContextProvider } from '../hooks/use_kibana';
import { BootcampApp } from './bootcamp_app';

export const renderApp = (
  coreStart: BootcampClientCoreStart,
  pluginsStart: BootcampPublicStartDeps,
  depsStart: BootcampPublicStart,
  params: AppMountParameters
) => {
  const { element, history } = params;

  ReactDOM.render(
    <BootcampAppContextProvider
      appParams={params}
      core={coreStart}
      services={{ ...pluginsStart, ...depsStart }}
    >
      <Router history={history}>
        <BootcampApp />
      </Router>
    </BootcampAppContextProvider>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
