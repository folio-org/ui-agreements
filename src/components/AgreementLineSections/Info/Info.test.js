import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { externalLine, externalEesource, packagesLine, packagesResource } from './testReasource';
import translationsProperties from '../../../../test/helpers';
import Info from './Info';

jest.mock('../../PackageCardExternal', () => () => (<div>PackageCardExternal</div>));
jest.mock('../../PackageCard', () => () => (<div>PackageCard</div>));

const isSuppressFromDiscoveryEnabled = jest.fn().mockImplementation((res) => res);

describe('Info', () => {
  let renderComponent;
  describe('Info with external type', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Info
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            line={externalLine}
            resource={externalEesource}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders Info component', async () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('lineInfo')).toBeInTheDocument();
    });

    test('displays parent agreements name', async () => {
      await KeyValue('Parent agreement').has({ value: 'MR test Info' });
    });

    test('displays parent agreement activeFrom date', async () => {
      await KeyValue('Active from').has({ value: '2021-08-04' });
    });

    test('displays parent agreement activeTo date', async () => {
      await KeyValue('Active to').has({ value: '2021-08-28' });
    });

    test('displays parent agreement suppressFromDiscovery', async () => {
      await KeyValue('Suppress from discovery').has({ value: 'Yes' });
    });

    test('dispalys parent agreement note', async () => {
      await KeyValue('Note').has({ value: 'This is note.' });
    });

    test('dispalys parent agreement description', async () => {
      await KeyValue('Description').has({ value: 'This is description.' });
    });

    test('renders the PackageCardExternal component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCardExternal')).toBeInTheDocument();
    });
  });
  describe('Info with packages type', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Info
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            line={packagesLine}
            resource={packagesResource}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders Info component', async () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('lineInfo')).toBeInTheDocument();
    });

    test('displays parent agreements name', async () => {
      await KeyValue('Parent agreement').has({ value: 'MR agr packages' });
    });

    test('displays parent agreement activeFrom date', async () => {
      await KeyValue('Active from').has({ value: '2021-09-01' });
    });

    test('displays parent agreement activeTo date', async () => {
      await KeyValue('Active to').has({ value: '2021-09-30' });
    });

    test('displays parent agreement suppressFromDiscovery', async () => {
      await KeyValue('Suppress from discovery').has({ value: 'Yes' });
    });

    test('dispalys parent agreement note', async () => {
      await KeyValue('Note').has({ value: 'This is note' });
    });

    test('dispalys parent agreement description', async () => {
      await KeyValue('Description').has({ value: 'This is agreement line description' });
    });
    test('renders the PackageCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCard')).toBeInTheDocument();
    });
  });
});
