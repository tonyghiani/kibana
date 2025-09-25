/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters } from '@kbn/core/public';
import type { CoreStart } from '@kbn/core/public';
import {
  KibanaContextProvider,
  useKibana as useUntypedKibana,
} from '@kbn/kibana-react-plugin/public';
import React, { useMemo, type PropsWithChildren } from 'react';
import type { BootcampPublicStart, BootcampPublicStartDeps } from '../types';

export interface BootcampKibanaContext {
  appParams: AppMountParameters;
  core: CoreStart;
  services: BootcampPublicStartDeps & BootcampPublicStart;
}

export const useKibana = (): BootcampKibanaContext =>
  useUntypedKibana<BootcampKibanaContext>().services;

export function BootcampAppContextProvider({
  appParams,
  core,
  services,
  children,
}: PropsWithChildren<BootcampKibanaContext>) {
  const servicesForContext = useMemo(() => {
    return {
      appParams,
      core,
      services,
    };
  }, [appParams, core, services]);

  return <KibanaContextProvider services={servicesForContext}>{children}</KibanaContextProvider>;
}
