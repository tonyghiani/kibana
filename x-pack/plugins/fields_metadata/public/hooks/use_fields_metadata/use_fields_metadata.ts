/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useState, useEffect, useCallback, useReducer } from 'react';
import { FindFieldsMetadataResponsePayload } from '../../../common/latest';
import { FieldMetadata, FieldName } from '../../../common';
import { FieldsMetadataServiceStart } from '../../services/fields_metadata';

interface Error {
  message: string;
  // Add more properties as needed
}

interface UseFieldsMetadataFactoryDeps {
  fieldsMetadataService: FieldsMetadataServiceStart;
}

interface Params {
  fieldNames: FieldName[];
}

type UseFieldsMetadataState = { loading: boolean } & (
  | {
      fieldsMetadata: undefined;
      error: null;
    }
  | {
      fieldsMetadata: FindFieldsMetadataResponsePayload['fieldsMetadata'];
      error: null;
    }
  | {
      fieldsMetadata: undefined;
      error: Error;
    }
);

const initialState = {
  error: null,
  fieldsMetadata: undefined,
  loading: false,
};

const reducer = (
  prev: UseFieldsMetadataState,
  action: Partial<UseFieldsMetadataState>
): UseFieldsMetadataState => ({ ...prev, ...action });

export const createUseFieldsMetadataHook = ({
  fieldsMetadataService,
}: UseFieldsMetadataFactoryDeps) => {
  return ({ fieldNames }: Params): UseFieldsMetadataState => {
    const [{ error, fieldsMetadata, loading }, setState] = useReducer(reducer, initialState);

    const retrieveFieldsMetadata = useCallback(async () => {
      setState({ loading: true });
      try {
        const response = await fieldsMetadataService.client.find({ fieldNames });

        setState({
          fieldsMetadata: response.fieldsMetadata,
          error: null,
        });
      } catch (err) {
        setState({
          fieldsMetadata: undefined,
          error: err as Error,
        });
      } finally {
        setState({ loading: false });
      }
    }, [fieldNames]);

    useEffect(() => {
      retrieveFieldsMetadata();
    }, [retrieveFieldsMetadata]);

    return { fieldsMetadata, loading, error };
  };
};
