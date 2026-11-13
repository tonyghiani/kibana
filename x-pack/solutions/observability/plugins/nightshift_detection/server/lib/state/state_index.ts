/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { estypes } from '@elastic/elasticsearch';
import type { ElasticsearchClient, Logger } from '@kbn/core/server';
import { Logger as CoreLogger } from '@kbn/core-di';
import { isResponseError } from '@kbn/es-errors';
import { mappings } from '@kbn/es-mappings';
import { inject, injectable } from 'inversify';
import { DetectionEngineSystemClient } from '../engine/es_client_tokens';

/** The engine's state index: a regular hidden index, not a data stream, because documents are updated in place. */
export const STATE_INDEX_NAME = '.nightshift-detection_engine-state';

/** Bump it whenever the mappings change; the mapping is then updated in place on next use. */
export const STATE_INDEX_VERSION = 1;

/** Mappings of the state index at {@link STATE_INDEX_VERSION}. */
export const STATE_INDEX_MAPPINGS: estypes.MappingTypeMapping = {
  // Not dynamic: only the fields below are searchable, `doc` is stored as it is.
  dynamic: false,
  properties: {
    kind: mappings.keyword(),
    key: mappings.keyword(),
    space_id: mappings.keyword(),
    updated_at: mappings.date(),
    doc: { type: 'object', enabled: false },
  },
  _meta: { version: STATE_INDEX_VERSION },
};

function isAlreadyExistsError(error: unknown): boolean {
  return isResponseError(error) && error.body?.error?.type === 'resource_already_exists_exception';
}

/** Creates the state index on first use and upgrades its mappings. */
@injectable()
export class StateIndex {
  private ready: Promise<void> | undefined;

  constructor(
    @inject(DetectionEngineSystemClient) private readonly esClient: ElasticsearchClient,
    @inject(CoreLogger) private readonly logger: Logger
  ) {}

  /** Resolves once the index exists with the current mapping. Cheap after the first call. */
  public ensureReady(): Promise<void> {
    if (!this.ready) {
      // A failed install is forgotten, so the next call retries it.
      this.ready = this.install().catch((error) => {
        this.ready = undefined;
        throw error;
      });
    }

    return this.ready;
  }

  private async install(): Promise<void> {
    if (!(await this.esClient.indices.exists({ index: STATE_INDEX_NAME }))) {
      try {
        await this.esClient.indices.create({
          index: STATE_INDEX_NAME,
          // Shard and replica counts are left to the cluster: Serverless rejects them.
          settings: { 'index.hidden': true },
          mappings: STATE_INDEX_MAPPINGS,
        });
        return;
      } catch (error) {
        // Two Kibana nodes can race to create the index; the loser falls through to the check.
        if (!isAlreadyExistsError(error)) {
          throw error;
        }
      }
    }

    await this.upgradeMappingIfBehind();
  }

  private async upgradeMappingIfBehind(): Promise<void> {
    const current = await this.esClient.indices.getMapping({ index: STATE_INDEX_NAME });
    const installed = Object.values(current)[0]?.mappings?._meta?.version;

    if (typeof installed === 'number' && installed >= STATE_INDEX_VERSION) {
      return;
    }

    try {
      // Additive changes only; a breaking mapping change needs a new index name.
      await this.esClient.indices.putMapping({
        index: STATE_INDEX_NAME,
        properties: STATE_INDEX_MAPPINGS.properties,
        dynamic: STATE_INDEX_MAPPINGS.dynamic,
        _meta: STATE_INDEX_MAPPINGS._meta,
      });
    } catch (error) {
      // The Kibana system user cannot change mappings of an index it does not manage. The
      // mapping is not dynamic, so new fields are still stored, only not searchable.
      if (!(isResponseError(error) && error.statusCode === 403)) {
        throw error;
      }

      this.logger.warn(
        `Could not update the mapping of ${STATE_INDEX_NAME} to version ${STATE_INDEX_VERSION}: the Kibana system user lacks the manage privilege on it`
      );
    }
  }
}
