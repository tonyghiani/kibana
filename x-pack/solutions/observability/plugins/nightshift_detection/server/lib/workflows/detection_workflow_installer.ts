/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { inject, injectable } from 'inversify';
import type { KibanaRequest } from '@kbn/core/server';
import { PluginSetup, PluginStart } from '@kbn/core-di';
import { NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID } from '@kbn/workflows/managed';
import type { WorkflowsExtensionsServerPluginStart } from '@kbn/workflows-extensions/server';
import type { WorkflowsServerPluginSetup } from '@kbn/workflows-management-plugin/server';
import { EngineHttpError } from '../errors/engine_http_error';
import { getStatusCode } from '../errors/get_status_code';

/** Owner id of the managed workflows the engine installs; the workflow definition names it too. */
export const DETECTION_ENGINE_WORKFLOW_OWNER = 'nightshiftDetection';

/** Installs the engine's bound workflow in a space, checks it is bound, and turns it on. */
@injectable()
export class DetectionWorkflowInstaller {
  constructor(
    @inject(PluginStart<WorkflowsExtensionsServerPluginStart>('workflowsExtensions'))
    private readonly workflowsExtensions: WorkflowsExtensionsServerPluginStart,
    @inject(PluginSetup<WorkflowsServerPluginSetup>('workflowsManagement'))
    private readonly workflowsManagement: WorkflowsServerPluginSetup
  ) {}

  /** The id of the workflow document installed in a space. */
  private static getDocumentId(spaceId: string): string {
    return `${NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID}-${spaceId}`;
  }

  /**
   * Installs the workflow bound to `serviceAccountId` with the caller's request, because binding a
   * workflow to an account needs the caller's `manage_security`, which the workflows plugin
   * enforces. Installing again with another account rebinds the workflow.
   *
   * @throws EngineHttpError when the install fails, or when the installed workflow does not run as
   * the account.
   */
  public async install({
    request,
    spaceId,
    serviceAccountId,
  }: {
    request: KibanaRequest;
    spaceId: string;
    serviceAccountId: string;
  }): Promise<void> {
    const client = await this.workflowsExtensions.getClient(request);

    try {
      await client.managedWorkflows.install(
        DETECTION_ENGINE_WORKFLOW_OWNER,
        NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID,
        { spaceId, workflowIdSuffix: spaceId, values: { serviceAccountId } }
      );
    } catch (error) {
      // Keep the status of the workflows plugin: a 403 or 400 is not fixed by calling again.
      const statusCode = getStatusCode(error) ?? 500;
      const retry = statusCode >= 500 ? ' Call _enable again to retry.' : '';
      throw new EngineHttpError(
        `Installing workflow [${NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID}] failed: ${
          error instanceof Error ? error.message : String(error)
        }.${retry}`,
        statusCode
      );
    }

    // Installing is best-effort in the workflows plugin, so check the workflow ended up bound to
    // the account instead of answering for one that was never installed.
    const documentId = DetectionWorkflowInstaller.getDocumentId(spaceId);
    const document = await this.workflowsManagement.management.getWorkflow(
      documentId,
      spaceId,
      request
    );

    if (document?.definition?.settings?.run_as !== serviceAccountId) {
      throw new EngineHttpError(
        `Setting up space [${spaceId}] did not bind [${NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID}] to [${serviceAccountId}]. Call _enable again to retry.`,
        500
      );
    }

    await this.enable({ request, spaceId });
  }

  private async enable({
    request,
    spaceId,
  }: {
    request: KibanaRequest;
    spaceId: string;
  }): Promise<void> {
    const documentId = DetectionWorkflowInstaller.getDocumentId(spaceId);
    const existing = await this.workflowsManagement.management
      .getClient(request)
      .getWorkflow(documentId, spaceId);

    if (existing && existing.enabled !== true) {
      await this.workflowsManagement.management.updateWorkflow(
        documentId,
        { enabled: true },
        spaceId,
        request
      );
    }
  }
}
