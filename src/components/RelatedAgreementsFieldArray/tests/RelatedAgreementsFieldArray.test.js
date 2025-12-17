import { waitFor, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Button, renderWithIntl, TestForm } from '@folio/stripes-erm-testing';

import { FieldArray } from 'react-final-form-arrays';
import RelatedAgreementsFieldArray from '../RelatedAgreementsFieldArray';
import { focusByIdWhenReady } from '../../utilities';
import { relatedAgreements } from '../../../../test/jest';
import translationsProperties from '../../../../test/helpers';

const onSubmit = jest.fn();

jest.mock('../../utilities', () => ({
  focusByIdWhenReady: jest.fn(),
}));

jest.mock('../RelatedAgreementField', () => (props) => (
  <div>
    <div>RelatedAgreementField</div>
    <button
      onClick={() => props.onAgreementSelected({ id: 'selected-agreement-id', name: 'Selected' })}
      type="button"
    >
      Select agreement
    </button>
  </div>
));


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

    test('calling onAgreementSelected focuses the trigger button id for that card', async () => {
      const { getByRole } = renderComponent;

      await waitFor(async () => {
        await Button('Add related agreement').click();
      });

      await waitFor(async () => {
        await userEvent.click(getByRole('button', { name: 'Select agreement' }));
      });

      expect(focusByIdWhenReady).toHaveBeenCalledWith('ra-agreement-0-find-agreement-btn');
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
      await waitFor(async () => {
        expect(getByText('RelatedAgreementField')).toBeInTheDocument();
      });
    });


    it('adding/removing fields using the add/remove works as expected', async () => {
      const { getByRole, queryAllByTestId } = renderComponent;
      const addButton = Button('Add related agreement');

      await addButton.exists();
      await waitFor(async () => {
        await addButton.click();
      });
      await waitFor(async () => {
        expect(queryAllByTestId(/relatedAgreementsFieldArray\[\d+\]/i).length).toEqual(1);
      });

      await waitFor(async () => {
        await addButton.click();
      });
      await waitFor(async () => {
        expect(queryAllByTestId(/relatedAgreementsFieldArray\[\d+\]/i).length).toEqual(2);
      });

      const trashButton = getByRole('button', { name: 'Remove related agreement 2' });
      await waitFor(async () => {
        await userEvent.click(trashButton);
      });

      await waitFor(async () => {
        expect(queryAllByTestId(/relatedAgreementsFieldArray\[\d+\]/i).length).toEqual(1);
      });
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
      expect(within(getByTestId('relatedAgreementsFieldArray[0]')).getByText(/"Related agreement 1" supersedes the agreement being created/)).toBeInTheDocument();
      expect(within(getByTestId('relatedAgreementsFieldArray[1]')).getByText(/"Related agreement 2" provides post-cancellation access for the agreement being created/)).toBeInTheDocument();
    });

    it('renders the expected note in each field', () => {
      const { getByTestId } = renderComponent;
      expect(within(getByTestId('relatedAgreementsFieldArray[0]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 1');
      expect(within(getByTestId('relatedAgreementsFieldArray[1]')).getByRole('textbox', { name: /Note/i }).value).toEqual('test note 2');
    });
  });
});
