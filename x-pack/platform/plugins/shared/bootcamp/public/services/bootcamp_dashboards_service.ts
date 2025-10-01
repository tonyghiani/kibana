/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { HttpSetup } from '@kbn/core/public';
import type { BootcampDashboard } from '../../common/types';

export interface GetDashbaordsResponse {
  dashboards: BootcampDashboard[];
}

export class BootcampDashboardsService {
  constructor(private readonly http: HttpSetup) {}

  async getDashboards() {
    const response = await this.http.get<GetDashbaordsResponse>('/internal/bootcamp/dashboards');

    return response.dashboards;
  }
}
