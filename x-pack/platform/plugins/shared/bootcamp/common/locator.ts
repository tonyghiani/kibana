/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { LocatorDefinition } from '@kbn/share-plugin/common';
import type { SerializableRecord } from '@kbn/utility-types';

interface BootcampLocatorParams extends SerializableRecord {
  dashboardId?: string;
}

export class BootcampLocatorDefinition implements LocatorDefinition<BootcampLocatorParams> {
  public readonly id = 'BOOTCAMP_LOCATOR';

  public readonly getLocation = async (params: BootcampLocatorParams) => {
    const path = params.dashboardId ? `/dashboards/${params.dashboardId}` : '/';

    return {
      app: 'bootcamp',
      path,
      state: {},
    };
  };
}
