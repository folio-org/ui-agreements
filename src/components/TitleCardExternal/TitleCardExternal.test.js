import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import TitleCardExternal from './TitleCardExternal';
import { title, titleWithReferenceObject } from './testResources';

jest.mock('../EResourceLink', () => () => <div>EResourceLink</div>);

let renderComponent;
describe('TitleCardExternal', () => {
  describe('with title resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TitleCardExternal
            title={title}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders TitleCardExternal component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('titleCardExternal')).toBeInTheDocument();
    });

    test('renders EResourceLink component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EResourceLink')).toBeInTheDocument();
    });

    test('renders the expected publicationType', async () => {
      await KeyValue('Publication type').has({ value: 'Journal' });
    });

    test('renders the expected holdingStatus', async () => {
      await KeyValue('Holding status').has({ value: 'Selected' });
    });

    test('renders the expected accessStatusType', async () => {
      await KeyValue('Access status type').has({ value: 'an access status type' });
    });
  });

  describe('with titleReferenceObject resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TitleCardExternal
            title={titleWithReferenceObject}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders TitleCardExternal component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('titleCardExternal')).toBeInTheDocument();
    });

    test('renders EResourceLink component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EResourceLink')).toBeInTheDocument();
    });

    test('renders the expected publicationType', async () => {
      await KeyValue('Publication type').has({ value: 'Book' });
    });

    test('renders the expected holdingStatus', async () => {
      await KeyValue('Holding status').has({ value: 'Selected' });
    });

    test('renders the expected accessStatusType', async () => {
      await KeyValue('Access status type').has({ value: 'another access status type' });
    });
  });
});
