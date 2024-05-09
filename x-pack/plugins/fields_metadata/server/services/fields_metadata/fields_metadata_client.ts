/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EcsFlat } from '@elastic/ecs';
import { EcsFieldName, TEcsFlat } from '../../../common';
import { IFieldsMetadataClient } from './types';

export class FieldsMetadataClient implements IFieldsMetadataClient {
  constructor() {}

  getByName<TFieldName extends EcsFieldName>(fieldName: TFieldName): TEcsFlat[TFieldName] {
    return EcsFlat[fieldName];
  }

  find<TFieldName extends EcsFieldName>({ fieldNames }: { fieldNames?: TFieldName[] }) {
    if (!fieldNames || fieldNames.length === 0) {
      return EcsFlat;
    }

    return fieldNames.reduce((fieldsMetadata, fieldName) => {
      const field = this.getByName(fieldName);

      if (field) {
        fieldsMetadata[fieldName] = field;
      }

      return fieldsMetadata;
    }, {} as Record<TFieldName, TEcsFlat[TFieldName]>);
  }
}
