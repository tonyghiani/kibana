/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EcsFlat } from '@elastic/ecs';
import {
  FieldName,
  TEcsFields,
  EcsFieldName,
  FieldMetadata,
  IntegrationFieldName,
  IntegrationFieldMetadata,
} from '../../../common';
import { IFieldsMetadataClient } from './types';

export class FieldsMetadataClient implements IFieldsMetadataClient {
  constructor() {}

  getEcsFieldByName<TFieldName extends FieldName>(fieldName: TFieldName) {
    return (
      this.isEcsFieldName(fieldName) ? EcsFlat[fieldName] : undefined
    ) as TFieldName extends EcsFieldName ? TEcsFields[TFieldName] : undefined;
  }

  // getIntegrationFieldByName(fieldName: IntegrationFieldName): IntegrationFieldMetadata | undefined {
  //   return undefined;
  // }

  isEcsFieldName(fieldName: FieldName): fieldName is EcsFieldName {
    return fieldName in EcsFlat;
  }

  // TODO: once TS v5 is in place, update this generic with better inference using a const parameter: https://github.com/microsoft/TypeScript/pull/51865
  find({
    fieldNames,
  }: {
    fieldNames?: FieldName[];
  } = {}): Record<FieldName, FieldMetadata> | TEcsFields {
    if (!fieldNames) {
      return EcsFlat;
    }

    const res = fieldNames.reduce((fieldsMetadata, fieldName) => {
      const field = this.getEcsFieldByName(fieldName);

      if (field) {
        fieldsMetadata[fieldName] = field;
      }

      return fieldsMetadata;
    }, {} as Record<FieldName, FieldMetadata>);

    return res;
  }
}
