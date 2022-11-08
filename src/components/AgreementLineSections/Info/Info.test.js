import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { externalLine, externalResource, packageLine, packageResource } from './testResources';
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

    test('renders a link with the parent agreements name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'MR test Info' })).toBeInTheDocument();
    });

    test('displays agreement line activeFrom date', async () => {
      await KeyValue('Active from').has({ value: '8/4/2021' });
    });

    test('displays agreement line activeTo date', async () => {
      await KeyValue('Active to').has({ value: '8/28/2021' });
    });

    test('displays agreement line suppressFromDiscovery', async () => {
      await KeyValue('Suppress from discovery').has({ value: 'Yes' });
    });

    test('displays agreement line note', async () => {
      await KeyValue('Note').has({ value: 'This is note.' });
    });

    test('displays agreement line description', async () => {
      await KeyValue('Description').has({ value: 'This is description.' });
    });

    test('displays agreement line title on platfrom URL', async () => {
      await KeyValue('Title on platform URL').has({ value: 'https://libra.ibuk.pl/book/166729' });
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

    test('renders a link with the parent agreements name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'MR agr packages' })).toBeInTheDocument();
    });

    test('displays agreement line activeFrom date', async () => {
      await KeyValue('Active from').has({ value: '9/1/2021' });
    });

    test('displays agreement line activeTo date', async () => {
      await KeyValue('Active to').has({ value: '9/30/2021' });
    });

    test('displays agreement line suppressFromDiscovery', async () => {
      await KeyValue('Suppress from discovery').has({ value: 'Yes' });
    });

    test('displays agreement line note', async () => {
      await KeyValue('Note').has({ value: 'This is note' });
    });

    test('displays agreement line description', async () => {
      await KeyValue('Description').has({ value: 'This is agreement line description' });
    });

    test('displays agreement line title on platfrom URL', async () => {
      await KeyValue('Title on platform URL').has({ value: 'https://doi.org/10.4337/9781845425678' });
    });

    test('renders the TitleCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCard')).toBeInTheDocument();
    });

    test('renders the PackageCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCard')).toBeInTheDocument();
    });
  });
});
