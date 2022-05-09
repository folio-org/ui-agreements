import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { Button } from '@folio/stripes-testing';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { FieldArray } from 'react-final-form-arrays';
import userEvent from '@testing-library/user-event';
import translationsProperties from '../../../test/helpers';
import POLinesFieldArray from './POLinesFieldArray';

jest.mock('./POLineField', () => () => <div>POLineField</div>);

const onSubmit = jest.fn();

const poLines = [
  {
    '_delete': false,
    'poLineId': 'baec48dd-1594-2712-be8f-de336bc83fcc'
  },
  {
    '_delete': false,
    'poLineId': '647c1dca-b9bf-47af-8456-bfb6dfef9eee'
  }
];

let renderComponent;
describe('POLinesFieldArray', () => {
  describe('render with empty initial values ', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm
          onSubmit={onSubmit}
        >
          <FieldArray
            component={POLinesFieldArray}
            name="poLines"
          />
        </TestForm>, translationsProperties
      );
    });
    it('renders empty field', () => {
      const { getByText } = renderComponent;
      expect(getByText('No PO lines for this agreement line')).toBeInTheDocument();
    });

    test('renders the Add PO line button', async () => {
      await Button('Add PO line').exists();
    });

    it('clicking the add button renders the po line field', () => {
      const { getByText, getByRole } = renderComponent;
      userEvent.click(getByRole('button', { name: /Add PO line/i }));
      expect(getByText('POLineField')).toBeInTheDocument();
    });

    it('adding/removing fields using the add/remove works as expected', () => {
      const { getByRole, queryAllByTestId } = renderComponent;
      expect(getByRole('button', { name: /Add PO line/i })).toBeInTheDocument();
      userEvent.click(getByRole('button', { name: /Add PO line/i }));
      expect(queryAllByTestId(/polinesFieldArray\[.*\]/i).length).toEqual(1);
      userEvent.click(getByRole('button', { name: /Add PO line/i }));
      expect(queryAllByTestId(/polinesFieldArray\[.*\]/i).length).toEqual(2);
      userEvent.click(getByRole('button', { name: /Remove PO line 1/i }));
      expect(queryAllByTestId(/polinesFieldArray\[.*\]/i).length).toEqual(1);
    });
  });

  describe('render with initial values set ', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{ poLines }}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={POLinesFieldArray}
            name="poLines"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders expected number of fields', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/polinesFieldArray\[.*\]/).length).toEqual(poLines.length);
    });
  });
});
