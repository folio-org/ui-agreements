import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import SupplementaryPropertiesConfigRoute from './SupplementaryPropertiesConfigRoute';

jest.mock('../components/SupplementaryPropertiesConfigForm', () => () => <div>SupplementaryPropertiesConfigForm</div>);

const supplementaryProperties = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [],
  'successfulMutations': [],
  'failedMutations': [{
    'resource': 'supplementaryProperties',
    'module': '@folio/agreements',
    'throwErrors': false,
    'type': 'POST',
    'message': '{"total":3,"errors":[{"code":"nullable","object":"com.k_int.web.toolkit.custprops.CustomPropertyDefinition","i18n_code":"com.k_int.web.toolkit.custprops.CustomPropertyDefinition.name.nullable","message":"Property [name] of class [class com.k_int.web.toolkit.custprops.CustomPropertyDefinition] cannot be null"},{"code":"nullable","object":"com.k_int.web.toolkit.custprops.CustomPropertyDefinition","i18n_code":"com.k_int.web.toolkit.custprops.CustomPropertyDefinition.type.nullable","message":"Proper...',
    'httpStatus': 422
  }],
  'pendingMutations': [],
  'loadedAt': 'Wed Dec 01 2021 11:03:09 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/custprops?sort=id%3Bdesc',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'supplementaryProperties',
  'module': '@folio/agreements',
  'throwErrors': false
};

const pickLists = {
  'hasLoaded': true,
  'isPending': false,
  'failed': false,
  'records': [
    '{desc: "AgreementRelationship.Type", id: "2c91809c7…}',
    '{desc: "DocumentAttachment.AtType", id: "2c91809c7d…}',
    '{desc: "Global.Yes_No", id: "2c91809c7d73aa7c017d73…}',
    '{desc: "IdentifierOccurrence.Status", id: "2c91809c…}',
    '{desc: "InternalContact.Role", id: "2c91809c7d73aa7…}',
    '{desc: "LicenseAmendmentStatus.Status", id: "2c9180…}',
    '{desc: "PersistentJob.Result", id: "2c91809c7d73aa7…}',
    '{desc: "PersistentJob.Status", id: "2c91809c7d73aa7…}',
    '{desc: "Pkg.Type", id: "2c91809c7d73aa7c017d73b1911…}',
    '{desc: "RemoteLicenseLink.Status", id: "2c91809c7d7…}',
    '{desc: "StringTemplate.Context", id: "2c91809c7d73a…}',
    '{desc: "SubscriptionAgreement.AgreementStatus", id:…}',
    '{desc: "SubscriptionAgreement.AgreementType", id: "…}',
    '{desc: "SubscriptionAgreement.ReasonForClosure", id…}',
    '{desc: "SubscriptionAgreement.RenewalPriority", id:…}',
    '{desc: "SubscriptionAgreementOrg.Role", id: "2c9180…}',
    '{desc: "TitleInstance.PublicationType", id: "2c9180…}',
    '{desc: "TitleInstance.SubType", id: "2c91809c7d73aa…}',
    '{desc: "TitleInstance.Type", id: "2c91809c7d73aa7c0…}'
  ],
  'successfulMutations': [],
  'failedMutations': [],
  'pendingMutations': [],
  'loadedAt': 'Wed Dec 01 2021 11:03:09 GMT+0000 (Greenwich Mean Time)',
  'url': 'https://folio-snapshot-okapi.dev.folio.org/erm/refdata?perPage=100&sort=desc%3Basc',
  'headers': 'Headers(undefined) {"content-type" => "application/json;charset=UTF-8"}',
  'httpStatus': 200,
  'other': {
    'totalRecords': null
  },
  'resource': 'pickLists',
  'module': '@folio/agreements',
  'throwErrors': true
};

const props = {
  resources: {
    supplementaryProperties,
    pickLists
  },
  mutator: {
    supplementaryProperties: {
      DELETE: jest.fn(),
      POST: jest.fn(),
      PUT: jest.fn(),
      cancel: jest.fn(),
    },
    pickLists: {
      DELETE: jest.fn(),
      POST: jest.fn(),
      PUT: jest.fn(),
      cancel: jest.fn(),
    },
  }
};

describe('SupplementaryPropertiesConfigRoute', () => {
  describe('renders the SupplementaryPropertiesConfigRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <SupplementaryPropertiesConfigRoute {...props} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the SupplementaryPropertiesConfigForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('SupplementaryPropertiesConfigForm')).toBeInTheDocument();
    });
  });
});
