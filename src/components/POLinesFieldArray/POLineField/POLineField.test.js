import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../../test/helpers';
import { input, id, meta, onPOLineSelected, poLine, data, errorData } from './testResources';
import POLineField from './POLineField';

jest.mock('../../POLineCard', () => () => <div>POLineCard</div>);

let renderComponent;
describe('POLineField', () => {
  describe('POLineField with linked PO Line ', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <POLineField
            id={id}
            input={input}
            meta={meta}
            onPOLineSelected={onPOLineSelected}
            poLine={poLine}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the POLineCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('POLineCard')).toBeInTheDocument();
    });
  });

  describe('POLineField with error ', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <POLineField {...errorData} />,
        </Router>,
        translationsProperties
      );
    });

    test('renders error message', () => {
      const { getByText } = renderComponent;
      expect(getByText('Please fill this in to continue')).toBeInTheDocument();
    });
  });

  describe('POLineField with no PO Line', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <POLineField
            {...data}
          />
        </Router>,
        translationsProperties
      );
    });

    test('displays the PO LineCard title', () => {
      const { getByText } = renderComponent;
      expect(getByText('PO line')).toBeInTheDocument();
    });

    test('displays the No "find-po-line" plugin is installed layout', () => {
      const { getByText } = renderComponent;
      expect(getByText('No "find-po-line" plugin is installed')).toBeInTheDocument();
    });

    test('displays the No PO line linked layout', () => {
      const { getByText } = renderComponent;
      expect(getByText('No PO line linked')).toBeInTheDocument();
    });

    test('displays Link a PO line to get started layout', () => {
      const { getByText } = renderComponent;
      expect(getByText('Link a PO line to get started')).toBeInTheDocument();
    });
  });
});
