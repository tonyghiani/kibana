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
import { useMemo, type PropsWithChildren } from 'react';
import React from 'react';
import type { BootcampPublicPluginStart, BootcampPublicStart } from '../types';

export interface BootcampKibanaContext {
  core: CoreStart;
  plugins: BootcampPublicPluginStart;
  params: AppMountParameters;
  myServices: BootcampPublicStart;
}

export function useKibana(): BootcampKibanaContext {
  return useUntypedKibana<BootcampKibanaContext>().services;
}

interface BootcampAppContextProviderProps {
  coreStart: CoreStart;
  pluginsStart: BootcampPublicPluginStart;
  params: AppMountParameters;
  myServices: BootcampPublicStart;
}

export function BootcampAppContextProvider({
  children,
  coreStart,
  pluginsStart,
  params,
  myServices,
}: PropsWithChildren<BootcampAppContextProviderProps>) {
  const servicesForContext = useMemo(() => {
    return {
      core: coreStart,
      plugins: pluginsStart,
      params,
      myServices,
    };
  }, [coreStart, pluginsStart, params, myServices]);

  return <KibanaContextProvider services={servicesForContext}>{children}</KibanaContextProvider>;
}
