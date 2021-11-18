import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { StaticRouter as Router } from 'react-router-dom';
import { Button } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { data, noPolineData } from './testResources';
import translationsProperties from '../../../test/helpers';
import POLinesFieldArray from './POLinesFieldArray';

jest.mock('@folio/stripes-erm-components', () => ({
    ...jest.requireActual('@folio/stripes-erm-components'),
    EditCard: () => <div>EditCard</div>
 }));

 const onAddField = jest.fn();

let renderComponent;
describe('POLinesFieldArray', () => {
  describe('POLinesFieldArray with linked PO Line ', () => {
      beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <POLinesFieldArray {...data} />
        </Router>,
        translationsProperties
      );
    });

    test('renders the EditCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EditCard')).toBeInTheDocument();
    });

    test('renders the Add PO line button', async () => {
      await Button('Add PO line').exists();
    });
  });

  describe('POLinesFieldArray with no linked PO lines ', () => {
    beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <POLinesFieldArray {...noPolineData} />,
      </Router>,
      translationsProperties
    );
  });

  test('renders No PO lines message', () => {
    const { getByText } = renderComponent;
    expect(getByText('No PO lines for this agreement line')).toBeInTheDocument();
  });

  test('renders the Add PO line button', async () => {
    await Button('Add PO line').exists();
  });

  describe('clicking add button', () => {
    beforeEach(async () => { await Button('Add PO line').click(); });

    test('should invoke the onAddField callback', () => {
      expect(onAddField).not.toHaveBeenCalled();
    });
  });
 });
});
