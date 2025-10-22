/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { AppMountParameters, CoreStart } from '@kbn/core/public';
import {
  KibanaContextProvider,
  useKibana as useUntypedKibana,
} from '@kbn/kibana-react-plugin/public';
import type { PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import type { BootcampPublicPluginStartDeps, BootcampPublicStart } from '../types';

interface BootcampAppContext {
  core: CoreStart;
  plugins: BootcampPublicPluginStartDeps;
  myServices: BootcampPublicStart;
  params: AppMountParameters;
}

export function useKibana(): BootcampAppContext {
  return useUntypedKibana<BootcampAppContext>().services;
}

export function BootcampAppContextProvider({
  core,
  plugins,
  myServices,
  params,
  children,
}: PropsWithChildren<BootcampAppContext>) {
  const services = useMemo(
    () => ({
      core,
      plugins,
      myServices,
      params,
    }),
    [core, plugins, myServices, params]
  );

  return <KibanaContextProvider services={services}>{children}</KibanaContextProvider>;
}
