/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import DETECTION_ENGINE_YAML from './detection_engine.yaml';
import { defineBoundWorkflow } from '../../define_bound_workflow';

export const NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID = 'system-nightshift-detection-engine';

/**
 * The space's detection engine tick, installed per space and bound to the detection engine
 * service account. It calls `POST /internal/nightshift/detection/_tick` every minute as that
 * account, so the tick reads customer data with the account's role.
 */
export const NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW = defineBoundWorkflow({
  id: NIGHTSHIFT_DETECTION_ENGINE_WORKFLOW_ID,
  pluginId: 'nightshiftDetection',
  yaml: DETECTION_ENGINE_YAML,
  version: 1,
});
