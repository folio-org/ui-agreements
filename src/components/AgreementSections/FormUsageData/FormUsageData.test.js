import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion, Button, KeyValue } from '@folio/stripes-testing';
import FormUsageData from './FormUsageData';

import translationsProperties from '../../../../test/helpers';

const onSubmit = jest.fn();

const initialValues = {
  'id': '65ee6cb0-5fc0-4736-94ab-72caf7792a72',
  'dateCreated': '2021-07-29T17:01:02Z',
  'name': 'am ag 1',
  'orgs': [],
  'externalLicenseDocs': [],
  'outwardRelationships': [],
  'customProperties': {},
  'contacts': [],
  'tags': [],
  'lastUpdated': '2021-07-29T17:01:02Z',
  'inwardRelationships': [],
  'startDate': '2021-07-30',
  'linkedLicenses': [],
  'docs': [],
  'periods': [
    {
      'id': 'efd70dae-1d98-41cb-813d-5f3dee20161d',
      'startDate': '2021-07-30',
      'owner': {
        'id': '65ee6cb0-5fc0-4736-94ab-72caf7792a72'
      },
      'periodStatus': 'next'
    }
  ],
  'usageDataProviders': [
    {
      'id': '2c9180b97af05157017af33657ba004a',
      'remoteId': '9362de60-f8b2-4073-bee3-01fa5fc8462f',
      'remoteId_object': {
        'id': '9362de60-f8b2-4073-bee3-01fa5fc8462f',
        'label': 'Alexander Street Press',
        'harvestingConfig': {
          'harvestingStatus': 'active',
          'harvestVia': 'aggregator',
          'aggregator': {
            'id': '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
            'name': 'German National Statistics Server',
            'vendorCode': 'ALEXS'
          },
          'reportRelease': 4,
          'requestedReports': [
            'JR5',
            'JR1'
          ],
          'harvestingStart': '2015-01'
        },
        'sushiCredentials': {
          'customerId': '0000000',
          'requestorId': 'electronic@lib.opentown.edu',
          'requestorMail': 'electronic@lib.optentown.edu'
        },
        'hasFailedReport': 'no',
        'reportErrorCodes': [],
        'reportTypes': [],
        'notes': 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
        'metadata': {
          'createdDate': '2021-07-29T03:32:01.982+00:00',
          'updatedDate': '2021-07-29T03:32:01.982+00:00'
        }
      },
      'owner': {
        'id': '65ee6cb0-5fc0-4736-94ab-72caf7792a72'
      }
    }
  ],
  'agreementStatus': 'active',
  'supplementaryDocs': [],
  'endDate': null,
  'cancellationDeadline': null,
  'alternateNames': [],
  'relatedAgreements': []
};

describe('FormUsageData', () => {
  describe('with no initial values', () => {
    beforeEach(() => {
      renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormUsageData />
        </TestForm>, translationsProperties
      );
    });

    test('renders the Usage data accordion', async () => {
      await Accordion('Usage data').exists();
    });

    test('renders the Add usage date provider button', async () => {
      await Button('Add usage data provider').exists();
    });
  });

  describe('with initial values', () => {
    beforeEach(() => {
      renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormUsageData />
        </TestForm>, translationsProperties
      );
    });

    test('renders the expected usage data provider', async () => {
      await KeyValue('Name').has({ value: 'Alexander Street Press' });
    });
  });
});
