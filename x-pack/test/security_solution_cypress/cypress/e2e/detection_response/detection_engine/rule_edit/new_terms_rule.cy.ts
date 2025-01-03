/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { getNewTermsRule } from '../../../../objects/rule';

import {
  SUPPRESS_FOR_DETAILS,
  DEFINITION_DETAILS,
  SUPPRESS_MISSING_FIELD,
  SUPPRESS_BY_DETAILS,
} from '../../../../screens/rule_details';

import {
  ALERT_SUPPRESSION_DURATION_UNIT_INPUT,
  ALERT_SUPPRESSION_DURATION_VALUE_INPUT,
  ALERT_SUPPRESSION_FIELDS,
  ALERT_SUPPRESSION_MISSING_FIELDS_SUPPRESS,
} from '../../../../screens/create_new_rule';

import { createRule } from '../../../../tasks/api_calls/rules';

import { RULES_MANAGEMENT_URL } from '../../../../urls/rules_management';
import { getDetails } from '../../../../tasks/rule_details';
import { deleteAlertsAndRules } from '../../../../tasks/api_calls/common';
import { login } from '../../../../tasks/login';

import { editFirstRule } from '../../../../tasks/alerts_detection_rules';

import { saveEditedRule } from '../../../../tasks/edit_rule';
import {
  selectAlertSuppressionPerRuleExecution,
  selectDoNotSuppressForMissingFields,
} from '../../../../tasks/create_new_rule';
import { visit } from '../../../../tasks/navigation';

const SUPPRESS_BY_FIELDS = ['agent.hostname', 'agent.type'];

const rule = getNewTermsRule();

// Skip in MKI due to flake
describe(
  'Detection rules, New terms, Edit',
  {
    tags: ['@ess', '@serverless', '@skipInServerlessMKI'],
  },
  () => {
    beforeEach(() => {
      login();
      deleteAlertsAndRules();
    });

    describe('with suppression configured', () => {
      beforeEach(() => {
        createRule({
          ...rule,
          alert_suppression: {
            group_by: SUPPRESS_BY_FIELDS,
            duration: { value: 20, unit: 'm' },
            missing_fields_strategy: 'suppress',
          },
        });
      });

      it('displays suppress options correctly on edit form and allows its editing', () => {
        visit(RULES_MANAGEMENT_URL);
        editFirstRule();

        // check saved suppression settings
        cy.get(ALERT_SUPPRESSION_DURATION_VALUE_INPUT)
          .should('be.enabled')
          .should('have.value', 20);
        cy.get(ALERT_SUPPRESSION_DURATION_UNIT_INPUT)
          .should('be.enabled')
          .should('have.value', 'm');
        cy.get(ALERT_SUPPRESSION_FIELDS).should('contain', SUPPRESS_BY_FIELDS.join(''));
        cy.get(ALERT_SUPPRESSION_MISSING_FIELDS_SUPPRESS).should('be.checked');

        selectDoNotSuppressForMissingFields();
        selectAlertSuppressionPerRuleExecution();

        saveEditedRule();

        cy.get(DEFINITION_DETAILS).within(() => {
          getDetails(SUPPRESS_BY_DETAILS).should('have.text', SUPPRESS_BY_FIELDS.join(''));
          getDetails(SUPPRESS_FOR_DETAILS).should('have.text', 'One rule execution');
          getDetails(SUPPRESS_MISSING_FIELD).should(
            'have.text',
            'Do not suppress alerts for events with missing fields'
          );
        });
      });
    });
  }
);
