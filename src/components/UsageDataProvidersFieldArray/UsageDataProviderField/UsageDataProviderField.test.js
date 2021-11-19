import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { KeyValue } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import { data, dataWithNoProvider, errorData } from './testResources';
import UsageDataProviderField from './UsageDataProviderField';


let renderComponent;
describe('UsageDataProviderField', () => {
  describe('UsageDataProviderField with usage data provider ', () => {
      beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <UsageDataProviderField
            {...data}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected name value', async () => {
      await KeyValue('Name').has({ value: 'American Chemical Society' });
    });

    test('renders the Usage data provider card header', () => {
      const { getByText } = renderComponent;
      expect(getByText('Usage data provider')).toBeInTheDocument();
    });

    test('renders No "find-erm-usage-data-provider" plugin is installed text', () => {
      const { getByText } = renderComponent;
      expect(getByText('No "find-erm-usage-data-provider" plugin is installed')).toBeInTheDocument();
    });
  });

  describe('UsageDataProviderField without usage data provider ', () => {
    beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <UsageDataProviderField {...dataWithNoProvider} />,
      </Router>,
      translationsProperties
    );
  });

  test('renders the Usage data provider card header', () => {
    const { getByText } = renderComponent;
    expect(getByText('Usage data provider')).toBeInTheDocument();
  });

  test('renders no usage data provider text', () => {
    const { getByText } = renderComponent;
    expect(getByText('No usage data provider linked')).toBeInTheDocument();
  });

  test('renders the link UDP text', () => {
    const { getByText } = renderComponent;
    expect(getByText('Link a usage data provider to get started')).toBeInTheDocument();
  });
 });

 describe('UsageDataProviderField with error ', () => {
    beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <UsageDataProviderField {...errorData} />,
      </Router>,
      translationsProperties
    );
  });

  test('renders error message', () => {
    const { getByText } = renderComponent;
    expect(getByText('Please fill this in to continue')).toBeInTheDocument();
  });
 });
});
