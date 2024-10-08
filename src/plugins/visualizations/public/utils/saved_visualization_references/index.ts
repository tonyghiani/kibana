/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export { extractControlsReferences, injectControlsReferences } from './controls_references';
export { extractTimeSeriesReferences, injectTimeSeriesReferences } from './timeseries_references';

export {
  extractReferences,
  injectReferences,
  serializeReferences,
  deserializeReferences,
  convertSavedObjectAttributesToReferences,
} from './saved_visualization_references';
