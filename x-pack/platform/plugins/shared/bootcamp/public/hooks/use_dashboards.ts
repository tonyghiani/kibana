/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import useAsync from 'react-use/lib/useAsync';
import { useKibana } from './use_kibana';

export function useDashboards() {
  const { myServices } = useKibana();

  const {
    value: dashboards,
    error,
    loading,
  } = useAsync(() => myServices.dashboardService.fetchDashboards(), []);

  return {
    dashboards,
    error,
    loading,
  };
}
