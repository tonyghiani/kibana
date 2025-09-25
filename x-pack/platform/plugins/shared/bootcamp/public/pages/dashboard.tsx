/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiPageTemplate, EuiText } from '@elastic/eui';
import React from 'react';

export const DashboardPage = () => {
  return (
    <EuiPageTemplate.Section>
      <EuiText>Welcome! This page will show a dashboard.</EuiText>
    </EuiPageTemplate.Section>
  );
};

// eslint-disable-next-line import/no-default-export
export default DashboardPage;
