import { waitFor, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Button, renderWithIntl, TestForm } from '@folio/stripes-erm-testing';

import { FieldArray } from 'react-final-form-arrays';
import RelatedAgreementsFieldArray from '../RelatedAgreementsFieldArray';

import translationsProperties from '../../../../test/helpers';

const onSubmit = jest.fn();

jest.mock('../RelatedAgreementField', () => () => <div>RelatedAgreementField</div>);

const relatedAgreements = [
  {
    id: '6bcca40d-138c-4c51-b7f5-235fb02552a6',
    note: 'test note 1',
    agreement: {
      id: 'f591806e-fe8c-4b16-a3cb-8cccc180d82b',
      name: 'AM ag 1',
      agreementStatus: {
        id: '2c91809c7ba954b5017ba95c586a0035',
        value: 'active',
        label: 'Active'
      },
      startDate: '2021-09-02',
      endDate: null
    },
    type: 'supersedes'
  },
  {
    id: 'ac2fde6e-a6a2-4df5-b244-8d803382d2d5',
    note: 'test note 2',
    agreement: {
      id: 'b958c1be-54f5-4f3d-9131-4255cd21b109',
      name: 'AM ag 3',
      agreementStatus: {
        id: '2c91809c7ba954b5017ba95c58630034',
        value: 'in_negotiation',
        label: 'In negotiation'
      },
      startDate: '2021-09-18',
      endDate: null
    },
    type: 'provides_post-cancellation_access_for'
  }
];

describe('RelatedAgreementsFieldArray', () => {
  describe('render with empty initial values', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{}}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={RelatedAgreementsFieldArray}
            name="relatedAgreements"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders empty field', () => {
      const { getByText } = renderComponent;
      expect(getByText('No related agreements for this agreement')).toBeInTheDocument();
    });

    it('clicking the add button renders the relatedAgreement field', async () => {
      const { getByText } = renderComponent;
      await waitFor(async () => {
        await Button('Add related agreement').click();
      });

      await expect(getByText('RelatedAgreementField')).toBeInTheDocument();
    });


    it('adding/removing fields using the add/remove works as expected', async () => {
      const { getByRole, queryAllByTestId } = renderComponent;
      const addButton = Button('Add related agreement');

      await addButton.exists();
      await waitFor(async () => {
        await addButton.click();
      });
      expect(queryAllByTestId(/relatedAgreementsFieldArray\[\d+\]/i).length).toEqual(1);

      await waitFor(async () => {
        await addButton.click();
      });
      expect(queryAllByTestId(/relatedAgreementsFieldArray\[\d+\]/i).length).toEqual(2);

      const trashButton = getByRole('button', { name: 'Remove related agreement 2' });
      await waitFor(async () => {
        await userEvent.click(trashButton);
      });

      expect(queryAllByTestId(/relatedAgreementsFieldArray\[\d+\]/i).length).toEqual(1);
    });
  });

  describe('rendering with initial values set', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{ relatedAgreements }}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={RelatedAgreementsFieldArray}
            name="relatedAgreements"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders expected number of fields', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/relatedAgreementsFieldArray\[.*\]/).length).toEqual(relatedAgreements.length);
    });

    it('renders the expected relationship summary in each field', () => {
      const { getByTestId } = renderComponent;
      expect(within(getByTestId('relatedAgreementsFieldArray[0]')).getByText(/"AM ag 1" supersedes the agreement being created/)).toBeInTheDocument();
      expect(within(getByTestId('relatedAgreementsFieldArray[1]')).getByText(/"AM ag 3" provides post-cancellation access for the agreement being created/)).toBeInTheDocument();
    });

    it('renders the expected note in each field', () => {
      const { getByTestId } = renderComponent;
      expect(within(getByTestId('relatedAgreementsFieldArray[0]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 1');
      expect(within(getByTestId('relatedAgreementsFieldArray[1]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 2');
    });
  });
});
