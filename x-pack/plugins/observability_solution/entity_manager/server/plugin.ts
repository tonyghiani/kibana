/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { firstValueFrom } from 'rxjs';
import {
  Plugin,
  CoreSetup,
  RequestHandlerContext,
  CoreStart,
  PluginInitializerContext,
  PluginConfigDescriptor,
  Logger,
  KibanaRequest,
} from '@kbn/core/server';
import { installEntityManagerTemplates } from './lib/manage_index_templates';
import { setupRoutes } from './routes';
import {
  EntityManagerPluginSetupDependencies,
  EntityManagerPluginStartDependencies,
  EntityManagerServerSetup,
} from './types';
import { EntityManagerConfig, configSchema, exposeToBrowserConfig } from '../common/config';
import { entityDefinition, EntityDiscoveryApiKeyType } from './saved_objects';
import { upgradeBuiltInEntityDefinitions } from './lib/entities/upgrade_entity_definition';
import { builtInDefinitions } from './lib/entities/built_in';
import { EntityClient } from './lib/entity_client';

export type EntityManagerServerPluginSetup = ReturnType<EntityManagerServerPlugin['setup']>;
export type EntityManagerServerPluginStart = ReturnType<EntityManagerServerPlugin['start']>;

export const config: PluginConfigDescriptor<EntityManagerConfig> = {
  schema: configSchema,
  exposeToBrowser: exposeToBrowserConfig,
};

export class EntityManagerServerPlugin
  implements
    Plugin<
      EntityManagerServerPluginSetup,
      EntityManagerServerPluginStart,
      EntityManagerPluginSetupDependencies,
      EntityManagerPluginStartDependencies
    >
{
  public config: EntityManagerConfig;
  public logger: Logger;
  public server?: EntityManagerServerSetup;

  constructor(context: PluginInitializerContext<EntityManagerConfig>) {
    this.config = context.config.get();
    this.logger = context.logger.get();
  }

  public setup(core: CoreSetup, plugins: EntityManagerPluginSetupDependencies) {
    core.savedObjects.registerType(entityDefinition);
    core.savedObjects.registerType(EntityDiscoveryApiKeyType);
    plugins.encryptedSavedObjects.registerType({
      type: EntityDiscoveryApiKeyType.name,
      attributesToEncrypt: new Set(['apiKey']),
      attributesToIncludeInAAD: new Set(['id', 'name']),
    });

    const router = core.http.createRouter();

    this.server = {
      config: this.config,
      logger: this.logger,
    } as EntityManagerServerSetup;

    setupRoutes<RequestHandlerContext>({
      router,
      logger: this.logger,
      server: this.server,
      getScopedClient: async ({ request }: { request: KibanaRequest }) => {
        const [coreStart] = await core.getStartServices();
        const esClient = coreStart.elasticsearch.client.asScoped(request).asCurrentUser;
        const soClient = coreStart.savedObjects.getScopedClient(request);
        return new EntityClient({ esClient, soClient, logger: this.logger });
      },
    });

    return {};
  }

  public start(core: CoreStart, plugins: EntityManagerPluginStartDependencies) {
    if (this.server) {
      this.server.core = core;
      this.server.isServerless = core.elasticsearch.getCapabilities().serverless;
      this.server.security = plugins.security;
      this.server.encryptedSavedObjects = plugins.encryptedSavedObjects;
    }

    const esClient = core.elasticsearch.client.asInternalUser;

    installEntityManagerTemplates({ esClient, logger: this.logger })
      .then(async () => {
        // the api key validation requires a check against the cluster license
        // which is lazily loaded. we ensure it gets loaded before the update
        await firstValueFrom(plugins.licensing.license$);
        const { success } = await upgradeBuiltInEntityDefinitions({
          definitions: builtInDefinitions,
          server: this.server!,
        });

        if (success) {
          this.logger.info('Builtin definitions were successfully upgraded');
        }
      })
      .catch((err) => this.logger.error(err));

    return {};
  }

  public stop() {}
}
