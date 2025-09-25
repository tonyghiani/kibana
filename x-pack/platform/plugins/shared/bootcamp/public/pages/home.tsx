/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { EuiBasicTableColumn } from '@elastic/eui';
import { EuiLoadingSpinner, EuiText, EuiLink, EuiPageTemplate, EuiBasicTable } from '@elastic/eui';
import React from 'react';
import type { BootcampLocatorParams } from '../../common/locator';
import type { BootcampDashboard } from '../../common/types';
import { useDashboards } from '../hooks/use_dashboards';
import { useKibana } from '../hooks/use_kibana';

export const HomePage = () => {
  const { services } = useKibana();
  const { dashboards, error, loading } = useDashboards();

  const locator = services.share.url.locators.get<BootcampLocatorParams>('BOOTCAMP_LOCATOR');

  const navigateToDashboard = locator
    ? (dashboard: BootcampDashboard) => locator.navigate({ dashboardId: dashboard.title })
    : undefined;

  if (!dashboards || loading) {
    return <EuiLoadingSpinner />;
  }

  if (error) {
    return <EuiText>Error loading dashboards</EuiText>;
  }

  const columns: Array<EuiBasicTableColumn<BootcampDashboard>> = [
    {
      field: 'title',
      name: 'Title',
      render: (_, dashboard) =>
        navigateToDashboard ? (
          <EuiLink onClick={() => navigateToDashboard(dashboard)}>{dashboard.title}</EuiLink>
        ) : (
          <EuiText>{dashboard.title}</EuiText>
        ),
    },
    {
      field: 'description',
      name: 'Description',
    },
  ];

  return (
    <EuiPageTemplate.Section>
      <EuiText>Welcome! This page will show items from our API.</EuiText>
      <EuiBasicTable items={dashboards} columns={columns} responsiveBreakpoint={false} />
    </EuiPageTemplate.Section>
  );
};

// eslint-disable-next-line import/no-default-export
export default HomePage;
