/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import {
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiText,
  EuiBadge,
  EuiButtonIcon,
  useEuiTheme,
  EuiToolTip,
} from '@elastic/eui';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { i18n } from '@kbn/i18n';
import { isDescendantOf, isRoutingEnabled } from '@kbn/streams-schema';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useStreamsAppRouter } from '../../../hooks/use_streams_app_router';
import { ConditionPanel } from '../shared';
import type { RoutingDefinitionWithUIAttributes } from './types';

function VerticalRule() {
  const { euiTheme } = useEuiTheme();
  const CentralizedContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${euiTheme.size.xs};
  `;

  const Border = styled.div`
    height: 20px;
    border-right: ${euiTheme.border.thin};
  `;

  return (
    <CentralizedContainer>
      <Border />
    </CentralizedContainer>
  );
}

export function IdleRoutingStreamEntry({
  availableStreams,
  draggableProvided,
  isEditingEnabled,
  onEditIconClick,
  partition,
  totalRoutingRules,
  isEditMode,
}: {
  availableStreams: string[];
  draggableProvided: DraggableProvided;
  isEditingEnabled: boolean;
  onEditIconClick: (id: string) => void;
  partition: RoutingDefinitionWithUIAttributes;
  totalRoutingRules: number;
  isEditMode: boolean;
}) {
  const { euiTheme } = useEuiTheme();
  const router = useStreamsAppRouter();

  const childrenCount = availableStreams.filter((stream) =>
    isDescendantOf(partition.destination, stream)
  ).length;

  return (
    <EuiPanel
      hasShadow={false}
      hasBorder
      data-test-subj={`partition-${partition.destination}`}
      className={css`
        overflow: hidden;
        .streamsDragHandle {
          transition: margin-left ${euiTheme.animation.normal};
          padding: ${euiTheme.size.s} 0;
          margin-left: -${euiTheme.size.xl};
        }
        &:hover .streamsDragHandle {
          margin-left: 0;
        }
        padding: ${euiTheme.size.m} 16px;
        border-radius: ${euiTheme.size.s};
      `}
    >
      <EuiFlexGroup direction="column" gutterSize="none">
        <EuiFlexGroup
          justifyContent="flexStart"
          gutterSize="xs"
          alignItems="center"
          responsive={false}
        >
          {totalRoutingRules > 1 && !isEditMode && (
            <EuiFlexItem grow={false}>
              <EuiPanel
                className="streamsDragHandle"
                color="transparent"
                paddingSize="s"
                data-test-subj={`routingRuleDragHandle-${partition.destination}`}
                {...draggableProvided.dragHandleProps}
                aria-label={i18n.translate(
                  'xpack.streams.idleRoutingStreamEntry.euiPanel.dragHandleLabel',
                  { defaultMessage: 'Drag Handle' }
                )}
              >
                <EuiIcon type="grabOmnidirectional" />
              </EuiPanel>
            </EuiFlexItem>
          )}
          <EuiLink
            href={router.link('/{key}/management/{tab}', {
              path: { key: partition.destination, tab: 'partitioning' },
            })}
            data-test-subj="streamsAppRoutingStreamEntryButton"
          >
            <EuiText size="m">
              <h6>{partition.destination}</h6>
            </EuiText>
          </EuiLink>

          <EuiFlexGroup
            justifyContent="flexEnd"
            gutterSize="xs"
            alignItems="center"
            responsive={false}
          >
            {!isRoutingEnabled(partition.status) && (
              <>
                <EuiBadge color="subdued">
                  {i18n.translate('xpack.streams.streamDetailRouting.disabled', {
                    defaultMessage: 'Disabled',
                  })}
                </EuiBadge>
                <VerticalRule />
              </>
            )}
            {childrenCount > 0 && (
              <>
                <EuiToolTip
                  content={i18n.translate(
                    'xpack.streams.streamDetailRouting.numberChildrenTooltip',
                    {
                      defaultMessage: 'Number of child streams',
                    }
                  )}
                >
                  <EuiBadge color="hollow">{`+${childrenCount}`}</EuiBadge>
                </EuiToolTip>
                <VerticalRule />
              </>
            )}
            <EuiButtonIcon
              data-test-subj={`routingRuleEditButton-${partition.destination}`}
              iconType="pencil"
              disabled={!isEditingEnabled}
              onClick={() => onEditIconClick(partition.id)}
              aria-label={i18n.translate('xpack.streams.streamDetailRouting.edit', {
                defaultMessage: 'Edit',
              })}
            />
          </EuiFlexGroup>
        </EuiFlexGroup>
        <EuiFlexItem
          grow={false}
          className={css`
            overflow: hidden;
            padding: ${euiTheme.size.xs} 0px;
          `}
        >
          <ConditionPanel condition={partition.where} />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
}
