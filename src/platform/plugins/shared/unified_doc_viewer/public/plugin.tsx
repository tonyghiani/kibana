/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import type { CoreSetup, Plugin } from '@kbn/core/public';
import { i18n } from '@kbn/i18n';
import { DocViewsRegistry } from '@kbn/unified-doc-viewer';
import { EuiDelayRender, EuiSkeletonText } from '@elastic/eui';
import { createGetterSetter, Storage } from '@kbn/kibana-utils-plugin/public';
import { DataPublicPluginStart } from '@kbn/data-plugin/public';
import { FieldFormatsStart } from '@kbn/field-formats-plugin/public';
import { CoreStart } from '@kbn/core/public';
import { dynamic } from '@kbn/shared-ux-utility';
import { FieldsMetadataPublicStart } from '@kbn/fields-metadata-plugin/public';
import { SharePluginStart } from '@kbn/share-plugin/public';
import type { UnifiedDocViewerServices } from './types';

export const [getUnifiedDocViewerServices, setUnifiedDocViewerServices] =
  createGetterSetter<UnifiedDocViewerServices>('UnifiedDocViewerServices');

const fallback = (
  <EuiDelayRender delay={300}>
    <EuiSkeletonText />
  </EuiDelayRender>
);

const LazyDocViewerTable = dynamic(() => import('./components/doc_viewer_table'), { fallback });
const LazySourceViewer = dynamic(() => import('./components/doc_viewer_source'), { fallback });

export interface UnifiedDocViewerSetup {
  registry: DocViewsRegistry;
}

export interface UnifiedDocViewerStart {
  registry: DocViewsRegistry;
}

export interface UnifiedDocViewerStartDeps {
  data: DataPublicPluginStart;
  fieldFormats: FieldFormatsStart;
  fieldsMetadata: FieldsMetadataPublicStart;
  share: SharePluginStart;
}

export class UnifiedDocViewerPublicPlugin
  implements Plugin<UnifiedDocViewerSetup, UnifiedDocViewerStart, {}, UnifiedDocViewerStartDeps>
{
  private docViewsRegistry = new DocViewsRegistry();

  public setup(core: CoreSetup<UnifiedDocViewerStartDeps, UnifiedDocViewerStart>) {
    this.docViewsRegistry.add({
      id: 'doc_view_table',
      title: i18n.translate('unifiedDocViewer.docViews.table.tableTitle', {
        defaultMessage: 'Table',
      }),
      order: 10,
      component: (props) => {
        return <LazyDocViewerTable {...props} />;
      },
    });

    this.docViewsRegistry.add({
      id: 'doc_view_source',
      title: i18n.translate('unifiedDocViewer.docViews.json.jsonTitle', {
        defaultMessage: 'JSON',
      }),
      order: 20,
      component: ({ hit, dataView, textBasedHits, decreaseAvailableHeightBy }) => {
        return (
          <LazySourceViewer
            index={hit.raw._index}
            id={hit.raw._id ?? hit.id}
            dataView={dataView}
            textBasedHits={textBasedHits}
            decreaseAvailableHeightBy={decreaseAvailableHeightBy}
            onRefresh={() => {}}
          />
        );
      },
    });

    return {
      registry: this.docViewsRegistry,
    };
  }

  public start(core: CoreStart, deps: UnifiedDocViewerStartDeps) {
    const { analytics, uiSettings } = core;
    const { data, fieldFormats, fieldsMetadata, share } = deps;
    const storage = new Storage(localStorage);
    const unifiedDocViewer = {
      registry: this.docViewsRegistry,
    };
    const services = {
      analytics,
      data,
      fieldFormats,
      fieldsMetadata,
      storage,
      uiSettings,
      unifiedDocViewer,
      share,
      core,
    };
    setUnifiedDocViewerServices(services);
    return unifiedDocViewer;
  }
}
