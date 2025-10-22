/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiPageTemplate } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { Route, Routes } from '@kbn/shared-ux-router';
import { dynamic } from '@kbn/shared-ux-utility';
import React from 'react';

const HomePage = dynamic(() => import('../pages/home'));
const DashboardPage = dynamic(() =>
  import('../pages/dashboard').then((mod) => ({ default: mod.DashboardPage }))
);

export function BootCampApp() {
  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        pageTitle={i18n.translate('xpack.bootcamp.app.pageTitle', { defaultMessage: 'Bootcamp' })}
        description={i18n.translate('xpack.bootcamp.app.pageDescription', {
          defaultMessage: 'Bootcamp for new hired engineers (nice folks!)',
        })}
      />
      <Routes>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboards/:dashboardId" exact component={DashboardPage} />
      </Routes>
    </EuiPageTemplate>
  );
}
