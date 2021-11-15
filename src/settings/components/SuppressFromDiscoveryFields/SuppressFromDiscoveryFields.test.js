import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import SuppressFromDiscoveryFields from './SuppressFromDiscoveryFields';

const onSubmit = jest.fn();

describe('SuppressFromDiscoveryFields', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MemoryRouter>
          <SuppressFromDiscoveryFields
            name="displaySuppressFromDiscovery"
          />
        </MemoryRouter>
      </TestForm>,
      translationsProperties
    );
  });

  test('renders expected heading', () => {
    const { getByText } = renderComponent;
    expect(getByText('Display "Suppress from discovery" setting on')).toBeInTheDocument();
  });

  test('renders the "Agreement lines" checkbox', async () => {
    await Checkbox({ id: 'displaySuppressFromDiscoveryAgreementLine' }).exists();
  });

  test('renders the "Agreement lines" checkbox as not checked', async () => {
    await Checkbox({ id: 'displaySuppressFromDiscoveryAgreementLine' }).is({ checked: false });
  });

  test('renders the "Titles in packages" checkbox', async () => {
    await Checkbox({ id: 'displaySuppressFromDiscoveryPCI' }).exists();
  });

  test('renders the "Titles in packages" checkbox as not checked', async () => {
    await Checkbox({ id: 'displaySuppressFromDiscoveryPCI' }).is({ checked: false });
  });

  test('renders the "Titles" checkbox', async () => {
    await Checkbox({ id: 'displaySuppressFromDiscoveryTitle' }).exists();
  });

  test('renders the "Titles" checkbox as not checked', async () => {
    await Checkbox({ id: 'displaySuppressFromDiscoveryTitle' }).is({ checked: false });
  });
});
