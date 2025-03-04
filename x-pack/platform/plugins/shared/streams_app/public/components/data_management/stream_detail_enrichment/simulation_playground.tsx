/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo, useState } from 'react';
import { i18n } from '@kbn/i18n';
import {
  EuiEmptyPrompt,
  EuiFlexItem,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
  useEuiTheme,
} from '@elastic/eui';
import {
  IngestStreamGetResponse,
  WiredStreamGetResponse,
  isWiredStreamGetResponse,
} from '@kbn/streams-schema';
import { css } from '@emotion/react';
import { ProcessorOutcomePreview } from './processor_outcome_preview';
import { TableColumn, UseProcessingSimulatorReturn } from './hooks/use_processing_simulator';
import { SchemaEditor } from '../schema_editor';
import { SchemaField } from '../schema_editor/types';
import { AssetImage } from '../../asset_image';

interface SimulationPlaygroundProps {
  definition: IngestStreamGetResponse;
  columns: TableColumn[];
  isLoading: UseProcessingSimulatorReturn['isLoading'];
  simulation: UseProcessingSimulatorReturn['simulation'];
  filteredSamples: UseProcessingSimulatorReturn['filteredSamples'];
  selectedDocsFilter: UseProcessingSimulatorReturn['selectedDocsFilter'];
  setSelectedDocsFilter: UseProcessingSimulatorReturn['setSelectedDocsFilter'];
  onRefreshSamples: UseProcessingSimulatorReturn['refreshSamples'];
}

export const SimulationPlayground = (props: SimulationPlaygroundProps) => {
  const {
    definition,
    columns,
    isLoading,
    simulation,
    filteredSamples,
    onRefreshSamples,
    setSelectedDocsFilter,
    selectedDocsFilter,
  } = props;

  const tabs = {
    dataPreview: {
      name: i18n.translate(
        'xpack.streams.streamDetailView.managementTab.enrichment.simulationPlayground.dataPreview',
        { defaultMessage: 'Data preview' }
      ),
    },
    ...(isWiredStreamGetResponse(definition) && {
      detectedFields: {
        name: i18n.translate(
          'xpack.streams.streamDetailView.managementTab.enrichment.simulationPlayground.detectedFields',
          { defaultMessage: 'Detected fields' }
        ),
      },
    }),
  } as const;

  const [selectedTabId, setSelectedTabId] = useState<keyof typeof tabs>('dataPreview');

  return (
    <>
      <EuiFlexItem grow={false}>
        <EuiTabs bottomBorder={false}>
          {Object.entries(tabs).map(([tabId, tab]) => (
            <EuiTab
              key={tabId}
              isSelected={selectedTabId === tabId}
              onClick={() => setSelectedTabId(tabId as keyof typeof tabs)}
            >
              {tab.name}
            </EuiTab>
          ))}
        </EuiTabs>
      </EuiFlexItem>
      <EuiSpacer size="m" />
      {selectedTabId === 'dataPreview' && (
        <ProcessorOutcomePreview
          columns={columns}
          isLoading={isLoading}
          simulation={simulation}
          filteredSamples={filteredSamples}
          onRefreshSamples={onRefreshSamples}
          selectedDocsFilter={selectedDocsFilter}
          setSelectedDocsFilter={setSelectedDocsFilter}
        />
      )}
      {selectedTabId === 'detectedFields' && isWiredStreamGetResponse(definition) && (
        <DetectedFieldsEditor
          definition={definition}
          isLoading={isLoading}
          simulation={simulation}
        />
      )}
    </>
  );
};

interface DetectedFieldsEditorProps {
  definition: WiredStreamGetResponse;
  isLoading: boolean;
  simulation: UseProcessingSimulatorReturn['simulation'];
}

const DetectedFieldsEditor = ({ definition, isLoading, simulation }: DetectedFieldsEditorProps) => {
  const { euiTheme } = useEuiTheme();

  const fields = useMemo(() => {
    const simulationFields = simulation?.detected_fields ?? [];

    const schemaFields: SchemaField[] = simulationFields.map((field) => {
      // Detected fields already inherited
      if ('from' in field) {
        return {
          name: field.name,
          type: field.type,
          format: field.format,
          parent: field.from,
          status: 'inherited',
        };
      }
      // Detected fields already mapped
      if ('type' in field) {
        return {
          name: field.name,
          type: field.type,
          format: field.format,
          parent: definition.stream.name,
          status: 'mapped',
        };
      }
      // Detected fields still unmapped
      return {
        name: field.name,
        parent: definition.stream.name,
        status: 'unmapped',
      };
    });

    return schemaFields.sort(compareFieldsByStatus);
  }, [definition, simulation]);

  const hasFields = fields.length > 0;

  if (!hasFields) {
    return (
      <EuiEmptyPrompt
        titleSize="xs"
        icon={<AssetImage type="noResults" />}
        body={
          <p>
            {i18n.translate(
              'xpack.streams.streamDetailView.managementTab.enrichment.simulationPlayground.detectedFields.noResults.content',
              {
                defaultMessage:
                  'No fields were detected during the simulation. You can add fields manually in the Schema Editor.',
              }
            )}
          </p>
        }
      />
    );
  }

  const unmapField = (fieldName: string) => {};

  const updateField = (field: SchemaField) => {};

  const refreshFields = () => {};

  return (
    <>
      <EuiText
        component="p"
        color="subdued"
        size="xs"
        css={css`
          margin-bottom: ${euiTheme.size.base};
        `}
      >
        {i18n.translate(
          'xpack.streams.streamDetailView.managementTab.enrichment.simulationPlayground.detectedFieldsHeadline',
          { defaultMessage: 'You can review and adjust saved fields further in the Schema Editor.' }
        )}
      </EuiText>
      <SchemaEditor
        defaultColumns={['name', 'type', 'format', 'status']}
        fields={fields}
        isLoading={isLoading}
        stream={definition.stream}
        onFieldUnmap={unmapField}
        onFieldUpdate={updateField}
        onRefreshData={refreshFields}
        withTableActions
      />
    </>
  );
};

const statusOrder = { inherited: 0, mapped: 1, unmapped: 2 };
const compareFieldsByStatus = (curr: SchemaField, next: SchemaField) => {
  return statusOrder[curr.status] - statusOrder[next.status];
};
