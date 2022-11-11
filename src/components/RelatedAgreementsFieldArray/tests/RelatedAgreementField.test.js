
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Field } from 'react-final-form';
import { KeyValue } from '@folio/stripes-testing';
import RelatedAgreementField from '../RelatedAgreementField';

import translationsProperties from '../../../../test/helpers';

const onAgreementSelected = jest.fn();
const onSubmit = jest.fn();

const agreement = {
  'id': 'd1947d28-5008-4d07-8712-23a9f909bf39',
  'name': 'AM ag 2',
  'agreementStatus': {
    'id': '2c91809c7ba954b5017ba95c58560032',
    'value': 'draft',
    'label': 'Draft'
  },
  'startDate': '2021-09-17',
  'endDate': '2021-09-19',
};

describe('RelatedAgreementField', () => {
  let renderComponent;
  describe('renders expected fields with no initial values', () => {
    renderComponent = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MemoryRouter>
          <Field
            agreement={{}}
            component={RelatedAgreementField}
            name="agreement"
            onAgreementSelected={onAgreementSelected}
            validate={() => { }}
          />
        </MemoryRouter>
      </TestForm>,
      translationsProperties
    );

    it('renders the default message', () => {
      const { getByText } = renderComponent;
      expect(getByText('Link an agreement to get started')).toBeInTheDocument();
    });
  });

  describe('renders expected fields/values with initial values set', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={{ agreement }} onSubmit={onSubmit}>
          <MemoryRouter>
            <Field
              agreement={agreement}
              component={RelatedAgreementField}
              name="agreement"
              onAgreementSelected={onAgreementSelected}
              validate={() => { }}
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    it('renders expected values', async () => {
      await KeyValue('Start date').has({ value: '9/17/2021' });
      await KeyValue('End date').has({ value: '9/19/2021' });
      await KeyValue('Status').has({ value: 'Draft' });
    });
  });
});
