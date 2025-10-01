/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { EuiBasicTableColumn } from '@elastic/eui';
import {
  EuiBasicTable,
  EuiLink,
  EuiLoadingSpinner,
  EuiPageTemplate,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import React from 'react';
import { i18n } from '@kbn/i18n';
import type { BootcampLocatorParams } from '../../common/locator';
import type { BootcampDashboard } from '../../common/types';
import { useDashboards } from '../hooks/use_dashboards';
import { useKibana } from '../hooks/use_kibana';

export function HomePage() {
  const { plugins } = useKibana();
  const { dashboards, loading } = useDashboards();

  const dashboardLocator =
    plugins.share.url.locators.get<BootcampLocatorParams>('BOOTCAMP_LOCATOR');

  const navigateToDashboard = dashboardLocator
    ? (dashboardId: string) => dashboardLocator.navigate({ dashboardId })
    : undefined;

  const columns: EuiBasicTableColumn<BootcampDashboard>[] = [
    {
      field: 'title',
      name: i18n.translate('xpack.bootcamp.homePage.titleLabel', {
        defaultMessage: 'Title',
      }),
      render: (_, dashboard) =>
        navigateToDashboard ? (
          <EuiLink onClick={() => navigateToDashboard(dashboard.title)}>{dashboard.title}</EuiLink>
        ) : (
          dashboard.title
        ),
    },
    {
      field: 'description',
      name: i18n.translate('xpack.bootcamp.homePage.descriptionLabel', {
        defaultMessage: 'Description',
      }),
    },
  ];

  return (
    <EuiPageTemplate.Section>
      <EuiText>Welcome to the Bootcamp dashboards list!</EuiText>
      <EuiSpacer />
      {loading || !dashboards ? (
        <EuiLoadingSpinner />
      ) : (
        <EuiBasicTable columns={columns} items={dashboards} responsiveBreakpoint={false} />
      )}
    </EuiPageTemplate.Section>
  );
}

// eslint-disable-next-line import/no-default-export
export default HomePage;
