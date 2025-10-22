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
import type { BootcampDashboard } from '../../common/types';
import { useDashboards } from '../hooks/use_dashboards';
import { useKibana } from '../hooks/use_kibana';

export const HomePage = () => {
  const { plugins } = useKibana();
  const { dashboards, error, loading } = useDashboards();

  const locator = plugins.share.url.locators.get('BOOTCAMP_LOCATOR');

  const navigateToDashboard = locator
    ? (dashboardId: string) => locator.navigate({ dashboardId })
    : undefined;

  const columns: EuiBasicTableColumn<BootcampDashboard>[] = [
    {
      field: 'title',
      name: i18n.translate('xpack.bootcamp.home.dashboardsTable.columnTitle', {
        defaultMessage: 'Title',
      }),
      render: (_, dashboard) => {
        return navigateToDashboard ? (
          <EuiLink onClick={() => navigateToDashboard(dashboard.title)}>{dashboard.title}</EuiLink>
        ) : (
          dashboard.title
        );
      },
    },
    {
      field: 'author',
      name: i18n.translate('xpack.bootcamp.home.dashboardsTable.columnAuthor', {
        defaultMessage: 'Author',
      }),
    },
  ];

  if (loading || !dashboards) {
    return <EuiLoadingSpinner />;
  }

  if (error) {
    return <EuiText>{error.message}</EuiText>;
  }

  return (
    <EuiPageTemplate.Section>
      <EuiText component="p">Dashboard listing page!</EuiText>
      <EuiSpacer />
      <EuiBasicTable columns={columns} items={dashboards} responsiveBreakpoint={false} />
    </EuiPageTemplate.Section>
  );
};

// eslint-disable-next-line import/no-default-export
export default HomePage;
