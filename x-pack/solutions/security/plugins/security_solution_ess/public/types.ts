/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  PluginSetup as SecuritySolutionPluginSetup,
  PluginStart as SecuritySolutionPluginStart,
} from '@kbn/security-solution-plugin/public';
import type { LicensingPluginStart } from '@kbn/licensing-plugin/public';
import type { NavigationPublicPluginStart } from '@kbn/navigation-plugin/public';
import type { ManagementStart } from '@kbn/management-plugin/public';
import type { CloudStart } from '@kbn/cloud-plugin/public';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SecuritySolutionEssPluginSetup {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SecuritySolutionEssPluginStart {}

export interface SecuritySolutionEssPluginSetupDeps {
  securitySolution: SecuritySolutionPluginSetup;
}

export interface SecuritySolutionEssPluginStartDeps {
  securitySolution: SecuritySolutionPluginStart;
  licensing: LicensingPluginStart;
  navigation: NavigationPublicPluginStart;
  management: ManagementStart;
  cloud: CloudStart;
}
