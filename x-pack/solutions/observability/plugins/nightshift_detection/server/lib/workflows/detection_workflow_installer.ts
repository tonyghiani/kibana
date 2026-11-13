/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { inject, injectable } from 'inversify';
import type { Logger } from '@kbn/core/server';
import type { KibanaRequest } from '@kbn/core/server';
import { Logger as CoreLogger, PluginSetup, PluginStart } from '@kbn/core-di';
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
    private readonly workflowsManagement: WorkflowsServerPluginSetup,
    @inject(CoreLogger) private readonly logger: Logger
  ) {}

  /** The id of the workflow document installed in a space. */
  private static getDocumentId(spaceId: string): string {
    return `${NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID}-${spaceId}`;
  }

  /**
   * Installs the engine's workflow in a space, bound to `serviceAccountId`:
   * 1. Install it with the caller's request, because binding a workflow to an account needs the
   *    caller's `manage_security`, which the workflows plugin enforces. Installing again with
   *    another account rebinds the workflow.
   * 2. Check it runs as the account, because installing is best-effort in the workflows plugin.
   * 3. Turn it on.
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
    await this.installWorkflow({ request, spaceId, serviceAccountId });
    const enabled = await this.assertBoundTo({ request, spaceId, serviceAccountId });
    await this.setEnabled({ request, spaceId, isEnabled: enabled });
  }

  /**
   * Turns the workflow off, for a setup that failed after installing it. It is best effort: a
   * failure is logged, since the setup error that led here is the one to report.
   */
  public async disable({
    request,
    spaceId,
  }: {
    request: KibanaRequest;
    spaceId: string;
  }): Promise<void> {
    try {
      await this.workflowsManagement.management.updateWorkflow(
        DetectionWorkflowInstaller.getDocumentId(spaceId),
        { enabled: false },
        spaceId,
        request
      );
    } catch (error) {
      this.logger.warn(
        `Could not turn off the detection engine workflow of space ${spaceId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async installWorkflow({
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
  }

  /** Returns whether the installed workflow is already on. */
  private async assertBoundTo({
    request,
    spaceId,
    serviceAccountId,
  }: {
    request: KibanaRequest;
    spaceId: string;
    serviceAccountId: string;
  }): Promise<boolean> {
    const document = await this.workflowsManagement.management.getWorkflow(
      DetectionWorkflowInstaller.getDocumentId(spaceId),
      spaceId,
      request
    );

    if (document?.definition?.settings?.run_as !== serviceAccountId) {
      throw new EngineHttpError(
        `Setting up space [${spaceId}] did not bind [${NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID}] to [${serviceAccountId}]. Call _enable again to retry.`,
        500
      );
    }

    return document.enabled === true;
  }

  private async setEnabled({
    request,
    spaceId,
    isEnabled,
  }: {
    request: KibanaRequest;
    spaceId: string;
    isEnabled: boolean;
  }): Promise<void> {
    if (!isEnabled) {
      await this.workflowsManagement.management.updateWorkflow(
        DetectionWorkflowInstaller.getDocumentId(spaceId),
        { enabled: true },
        spaceId,
        request
      );
    }
  }
}
