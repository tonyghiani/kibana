/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import useAsyncFn from 'react-use/lib/useAsyncFn';
import { useEffect } from 'react';
import { useKibana } from './use_kibana';

export const useDashboards = () => {
  const { services } = useKibana();

  const { dashboardService } = services;

  const [{ value, error, loading }, fetchDashboards] = useAsyncFn(
    () => dashboardService.getDashboards(),
    []
  );

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  return { dashboards: value, error, loading, fetchDashboards };
};
