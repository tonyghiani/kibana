/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { httpServerMock } from '@kbn/core/server/mocks';
import type { WorkflowsExtensionsServerPluginStart } from '@kbn/workflows-extensions/server';
import type { WorkflowsServerPluginSetup } from '@kbn/workflows-management-plugin/server';
import { DetectionWorkflowInstaller } from './detection_workflow_installer';

function createInstaller({ runAs }: { runAs: string | undefined }) {
  const install = jest.fn(async () => {});
  const updateWorkflow = jest.fn(async () => {});
  const workflowsExtensions = {
    getClient: async () => ({ managedWorkflows: { install } }),
  } as unknown as WorkflowsExtensionsServerPluginStart;
  const workflowsManagement = {
    management: {
      getWorkflow: async () => ({ definition: { settings: { run_as: runAs } } }),
      getClient: () => ({ getWorkflow: async () => ({ enabled: false }) }),
      updateWorkflow,
    },
  } as unknown as WorkflowsServerPluginSetup;

  return {
    installer: new DetectionWorkflowInstaller(workflowsExtensions, workflowsManagement),
    install,
    updateWorkflow,
  };
}

const PARAMS = {
  request: httpServerMock.createKibanaRequest(),
  spaceId: 'default',
  serviceAccountId: 'account-1',
};

describe('DetectionWorkflowInstaller', () => {
  it('installs the workflow for the space bound to the account and turns it on', async () => {
    const { installer, install, updateWorkflow } = createInstaller({ runAs: 'account-1' });

    await installer.install(PARAMS);

    expect(install).toHaveBeenCalledWith(
      'nightshiftDetection',
      'system-nightshift-detection-engine',
      {
        spaceId: 'default',
        workflowIdSuffix: 'default',
        values: { serviceAccountId: 'account-1' },
      }
    );
    expect(updateWorkflow).toHaveBeenCalledWith(
      'system-nightshift-detection-engine-default',
      { enabled: true },
      'default',
      PARAMS.request
    );
  });

  it('fails with 500 when the installed workflow does not run as the account', async () => {
    const { installer } = createInstaller({ runAs: 'account-0' });

    await expect(installer.install(PARAMS)).rejects.toMatchObject({ statusCode: 500 });
  });
});
