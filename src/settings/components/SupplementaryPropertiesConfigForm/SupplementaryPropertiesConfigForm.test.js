import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Pane, PaneHeader } from '@folio/stripes-testing';
import { screen } from '@testing-library/react';
import translationsProperties from '../../../../test/helpers';
import SupplementaryPropertiesConfigForm from './SupplementaryPropertiesConfigForm';

jest.mock('@folio/stripes-erm-components', () => ({
    ...jest.requireActual('@folio/stripes-erm-components'),
    CustomPropertiesConfigListFieldArray: () => <div>CustomPropertiesConfigListFieldArray</div>,
}));

const onSubmit = jest.fn();
const onDelete = jest.fn();
const onSave = jest.fn();

const initialValues = {
'customProperties': '[]'
};

const form = {
'batch': 'ƒ batch() {}',
'blur': 'ƒ blur() {}',
'change': 'ƒ change() {}',
'destroyOnUnregister': false,
'focus': 'ƒ focus() {}',
'mutators': {
    'setCustomPropertyValue': () => {},
    'insert': () => {},
    'concat': () => {},
    'move': () => {},
    'pop': () => {},
    'push': () => {},
    'remove': () => {},
    'removeBatch': () => {},
    'shift': () => {},
    'swap': () => {},
    'unshift': () => {},
    'update':() => {},
},
'getFieldState': 'ƒ getFieldState() {}',
'getRegisteredFields': 'ƒ getRegisteredFields() {}',
'getState': 'ƒ getState() {}',
'initialize': 'ƒ initialize() {}',
'isValidationPaused': 'ƒ isValidationPaused() {}',
'pauseValidation': 'ƒ pauseValidation() {}',
'registerField': 'ƒ registerField() {}',
'reset': 'ƒ reset() {}',
'resetFieldState': 'ƒ resetFieldState() {}',
'restart': 'ƒ restart() {}',
'resumeValidation': 'ƒ resumeValidation() {}',
'setConfig': 'ƒ setConfig() {}',
'submit': 'ƒ () {}',
'subscribe': 'ƒ subscribe() {}'
};

const match = {
    'path': '/settings/erm/supplementaryProperties',
    'url': '/settings/erm/supplementaryProperties',
    'isExact': true,
    'params': '{}'
};

const pickLists = [
    {
      'label': 'AgreementRelationship.Type',
      'value': '2c91809c7d1384e1017d138c232c0018'
    },
    {
      'label': 'DocumentAttachment.AtType',
      'value': '2c91809c7d1384e1017d138c235e0023'
    },
    {
      'label': 'Global.Yes_No',
      'value': '2c91809c7d1384e1017d138c22700002'
    },
    {
      'label': 'IdentifierOccurrence.Status',
      'value': '2c91809c7d1384e1017d138c2d910044'
    },
    {
      'label': 'InternalContact.Role',
      'value': '2c91809c7d1384e1017d138c23b10036'
    },
    {
      'label': 'LicenseAmendmentStatus.Status',
      'value': '2c91809c7d1384e1017d138c2348001e'
    },
    {
      'label': 'PersistentJob.Result',
      'value': '2c91809c7d1384e1017d138c236f0027'
    },
    {
      'label': 'PersistentJob.Status',
      'value': '2c91809c7d1384e1017d138c2385002c'
    },
    {
      'label': 'Pkg.Type',
      'value': '2c91809c7d1384e1017d138c23170014'
    },
    {
      'label': 'RemoteLicenseLink.Status',
      'value': '2c91809c7d1384e1017d138c23c9003b'
    },
    {
      'label': 'StringTemplate.Context',
      'value': '2c91809c7d1384e1017d138c23de003f'
    },
    {
      'label': 'SubscriptionAgreement.AgreementStatus',
      'value': 'c24481538c9ae1a14b9b17c6849dcaa4'
    },
    {
      'label': 'SubscriptionAgreement.AgreementType',
      'value': '2c91809c7d1384e1017d138c228f0005'
    },
    {
      'label': 'SubscriptionAgreement.ReasonForClosure',
      'value': '8f8fe6a4e0016aa08ff1dc38c7d44117'
    },
    {
      'label': 'SubscriptionAgreement.RenewalPriority',
      'value': '2c91809c7d1384e1017d138c22aa0009'
    },
    {
      'label': 'SubscriptionAgreementOrg.Role',
      'value': '2c91809c7d1384e1017d138c22210000'
    },
    {
      'label': 'TitleInstance.PublicationType',
      'value': '2c91809c7d1384e1017d138c2d330042'
    },
    {
      'label': 'TitleInstance.SubType',
      'value': '2c91809c7d1384e1017d138c23980030'
    },
    {
      'label': 'TitleInstance.Type',
      'value': '2c91809c7d1384e1017d138c23a40033'
    }
  ];

describe('SupplementaryPropertiesConfigForm', () => {
  let renderComponent;
  beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <SupplementaryPropertiesConfigForm
            form={form}
            initialValues={initialValues}
            match={match}
            onDelete={onDelete}
            onSave={onSave}
            onSubmit={onSubmit}
            pickLists={pickLists}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays the supplementary properties pane title', async () => {
        screen.debug();
      await Pane('Supplementary properties').is({ visible: true });
    });

    test('displays the supplementary properties pane header', async () => {
      await PaneHeader('Supplementary properties').is({ visible: true });
    });

    test('renders the supplementary properties subtitle', () => {
      const { getByText } = renderComponent;
      expect(getByText('2 saved supplementary properties')).toBeInTheDocument();
    });

    test('renders the SuppressFromDiscoveryFields component', () => {
      const { getByText } = renderComponent;
      expect(getByText('CustomPropertiesConfigListFieldArray')).toBeInTheDocument();
    });
  });
