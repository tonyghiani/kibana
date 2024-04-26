/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EcsFlat } from '@elastic/ecs';
import { EcsFieldName, TEcsFlat } from '../../../common';
import { IEcsFieldsClient } from './types';

export class EcsFieldsClient implements IEcsFieldsClient {
  constructor() {}

  getByName<TFieldName extends EcsFieldName>(fieldName: TFieldName): TEcsFlat[TFieldName] {
    return EcsFlat[fieldName];
  }

  find<TFieldName extends EcsFieldName>({ fieldNames }: { fieldNames?: TFieldName[] }) {
    if (!fieldNames || fieldNames.length === 0) {
      return EcsFlat;
    }

    return fieldNames.reduce((ecsFields, fieldName) => {
      const field = this.getByName(fieldName);

      if (field) {
        ecsFields[fieldName] = field;
      }

      return ecsFields;
    }, {} as Record<TFieldName, TEcsFlat[TFieldName]>);
  }
}
