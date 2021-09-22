import React from 'react';
import { waitFor } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { Field } from 'react-final-form';
import userEvent from '@testing-library/user-event';
import AgreementLineField from './AgreementLineField';
import translationsProperties from '../../../test/helpers';

jest.mock('../BasketSelector', () => () => <div>BasketSelector</div>);
jest.mock('../EResourceLink', () => () => <div>EResourceLink</div>);
jest.mock('../EResourceCount', () => () => <div>EResourceCount</div>);
jest.mock('../EResourceProvider', () => () => <div>EResourceProvider</div>);
jest.mock('../CoverageFieldArray', () => () => <div>CoverageFieldArray</div>);
jest.mock('../POLinesFieldArray', () => () => <div>POLinesFieldArray</div>);

const onSubmit = jest.fn();

const data = {
    'input': {
      'name': 'items[0]',
      'value': {
        'id': '3f5d18c0-f299-4afe-b26c-8254ac279f18',
        'activeFrom': '2021-09-02',
        'activeTo': '2021-09-30',
        'note': 'note'
      },
      'onBlur': () => {},
      'onChange': () => {},
      'onFocus': () => {},
    },
    'meta': {
      'active': false,
      'data': '{}',
      'dirty': false,
      'dirtySinceLastSubmit': false,
      'initial': {
        'id': '3f5d18c0-f299-4afe-b26c-8254ac279f18',
        'activeFrom': '2021-09-02',
        'activeTo': '2021-09-30',
        'note': 'note'
      },
      'invalid': false,
      'modified': false,
      'modifiedSinceLastSubmit': false,
      'pristine': true,
      'submitFailed': false,
      'submitSucceeded': false,
      'submitting': false,
      'touched': false,
      'valid': true,
      'validating': false,
      'visited': false
    },
    'basket': [],
    'index': 0,
    'onDelete': () => {},
    'onResourceSelected': () => {},
    'poLines': [],
    'resource': {
      'id': '3f5d18c0-f299-4afe-b26c-8254ac279f18',
      'type': 'external',
      'description': 'description',
      'authority': 'EKB-PACKAGE',
      'reference': '287-1647',
      'explanation': null,
      'startDate': '2021-09-02',
      'endDate': '2021-09-30',
      'activeFrom': '2021-09-02',
      'activeTo': '2021-09-30',
      'contentUpdated': null,
      'haveAccess': true,
      'suppressFromDiscovery': true,
      'note': 'note',
      'tags': '[]',
      'owner': {
        'id': '15e449d1-7cdb-4577-8919-34d77711f41f',
        'cancellationDeadline': '2021-09-26',
        'isPerpetual': {
          'id': '2c91809c7c0b2cce017c0b34d0440008',
          'value': 'yes',
          'label': 'Yes'
        },
        'name': 'MR agr test',
        'orgs': [],
        'externalLicenseDocs': [],
        'outwardRelationships': [],
        'customProperties': {},
        'contacts': [],
        'tags': [],
        'inwardRelationships': [],
        'renewalPriority': {
          'id': '2c91809c7c0b2cce017c0b34d0720010',
          'value': 'for_review',
          'label': 'For review'
        },
        'endDate': '2021-09-30',
        'startDate': '2021-09-01',
        'linkedLicenses': [],
        'docs': [],
        'periods': [
          '{cancellationDeadline: "2021-09-26", endDate: "2021…}'
        ],
        'usageDataProviders': [],
        'agreementStatus': {
          'id': '2c91809c7c0b2cce017c0b34d0cb0018',
          'value': 'active',
          'label': 'Active'
        },
        'supplementaryDocs': [],
        'description': 'Agreement line description',
        'items': [
          '{id: "3f5d18c0-f299-4afe-b26c-8254ac279f18"}'
        ],
        'alternateNames': []
      },
      'customCoverage': false,
      'reference_object': {
        'label': 'I-Revues',
        'type': 'Package',
        'provider': 'Institut National de l’Information Scientifique et Technique : INIST-CNRS',
        'titleCount': 52,
        'selectedCount': 0,
        'contentType': 'Aggregated Full Text',
        'providerName': 'Institut National de l’Information Scientifique et Technique : INIST-CNRS'
      }
    }
  };

  describe('AgreementLineField', () => {
    let renderComponent;
    describe('renders expected fields with no initial values', () => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <Field
            component={AgreementLineField}
            name="resource"
            resource={{}}
          />
        </TestForm>,
        translationsProperties
      );

      test('renders the BasketSelector component', () => {
        const { getByText } = renderComponent;
        expect(getByText('BasketSelector')).toBeInTheDocument();
      });
    });

    describe('renders expected fields/values with initial values set', () => {
        test('renders expected fields', () => {
            const { getByTestId, getByRole } = renderWithIntl(
              <TestForm initialValues={{ data }} onSubmit={onSubmit}>
                <AgreementLineField
                  index={0}
                  input={{ name:'resource' }}
                  meta={data.meta}
                  resource={data.resource}
                />
              </TestForm>,
          translationsProperties
        );

        expect(getByTestId('AgreementLineField')).toBeInTheDocument();
        expect(getByRole('textbox', { name: /active from/i })).toBeInTheDocument();
        expect(getByRole('textbox', { name: /active to/i })).toBeInTheDocument();
        expect(getByRole('textbox', { name: /note/i })).toBeInTheDocument();
      });

      test('date validation fires for invalid end date', async () => {
        const { getAllByText, queryByText, getByRole } = renderWithIntl(
          <TestForm initialValues={{ data }} onSubmit={onSubmit}>
            <AgreementLineField
              index={0}
              input={{ name:'resource' }}
              meta={data.meta}
              resource={data.resource}
            />
          </TestForm>,
      translationsProperties
    );

    userEvent.type(getByRole('textbox', { name: /active from/i }), '01/01/2021');
    userEvent.type(getByRole('textbox', { name: /active to/i }), '01/01/2002');

    await waitFor(() => expect(getAllByText(/End date must be after the start date./i)?.[0]).toBeInTheDocument());

    userEvent.clear(getByRole('textbox', { name: /active to/i }));
    userEvent.type(getByRole('textbox', { name: /active to/i }), '01/01/2022');
    await waitFor(() => expect(queryByText(/End date must be after the start date./i)).not.toBeInTheDocument());
   });
  });
});
