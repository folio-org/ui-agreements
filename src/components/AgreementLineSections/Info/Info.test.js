import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { externalLine, externalResource, packageLine, packageResource } from './testReasource';
import translationsProperties from '../../../../test/helpers';
import Info from './Info';

jest.mock('../../PackageCardExternal', () => () => (<div>PackageCardExternal</div>));
jest.mock('../../PackageCard', () => () => (<div>PackageCard</div>));
jest.mock('../../TitleCardExternal', () => () => (<div>TitleCardExternal</div>));
jest.mock('../../TitleCard', () => () => (<div>TitleCard</div>));

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
            resource={externalResource}
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

    test('displays agreement line activeFrom date', async () => {
      await KeyValue('Active from').has({ value: '2021-08-04' });
    });

    test('displays agreement line activeTo date', async () => {
      await KeyValue('Active to').has({ value: '2021-08-28' });
    });

    test('displays agreement line suppressFromDiscovery', async () => {
      await KeyValue('Suppress from discovery').has({ value: 'Yes' });
    });

    test('dispalys agreement line note', async () => {
      await KeyValue('Note').has({ value: 'This is note.' });
    });

    test('dispalys agreement line description', async () => {
      await KeyValue('Description').has({ value: 'This is description.' });
    });

    test('renders the PackageCardExternal component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCardExternal')).toBeInTheDocument();
    });

    test('renders the TitleCardExternal component', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCardExternal')).toBeInTheDocument();
    });
  });

  describe('Info with type packages', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Info
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            line={packageLine}
            resource={packageResource}
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

    test('displays agreement line activeFrom date', async () => {
      await KeyValue('Active from').has({ value: '2021-09-01' });
    });

    test('displays agreement line activeTo date', async () => {
      await KeyValue('Active to').has({ value: '2021-09-30' });
    });

    test('displays agreement line suppressFromDiscovery', async () => {
      await KeyValue('Suppress from discovery').has({ value: 'Yes' });
    });

    test('dispalys agreement line note', async () => {
      await KeyValue('Note').has({ value: 'This is note' });
    });

    test('dispalys agreement line description', async () => {
      await KeyValue('Description').has({ value: 'This is agreement line description' });
    });

    test('dispalys agreement line title on platfrom URL', async () => {
      await KeyValue('Title on platform URL').has({ value: 'https://doi.org/10.4337/9781845425678' });
    });

    test('renders the PackageCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCard')).toBeInTheDocument();
    });

    test('renders the TitleCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCard')).toBeInTheDocument();
    });
  });
});
