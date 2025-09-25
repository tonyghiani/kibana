/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiPageTemplate } from '@elastic/eui';
import { Route, Routes } from '@kbn/shared-ux-router';
import { dynamic } from '@kbn/shared-ux-utility';

const HomePage = dynamic(() => import('../pages/home'));
const DashboardPage = dynamic(() => import('../pages/dashboard'));

export const BootcampApp = () => {
  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header pageTitle="Bootcamp" />
      <Routes>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboard/:dashboardId" component={DashboardPage} />
      </Routes>
    </EuiPageTemplate>
  );
};
