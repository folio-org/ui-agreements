
import { renderWithIntl, KeyValue } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { externalLine, externalResource, externalResourceWithError, gokbLine, localGokbPkg, packageLine, packageResource } from './testResources';
import translationsProperties from '../../../../test/helpers';
import Info from './Info';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ErrorCard: () => <div>ErrorCard</div>,
}));

jest.mock('../../PackageCardExternal', () => () => (<div>PackageCardExternal</div>));
jest.mock('../../PackageCard', () => () => (<div>PackageCard</div>));
jest.mock('../../TitleCardExternal', () => () => (<div>TitleCardExternal</div>));
jest.mock('../../TitleCard', () => () => (<div>TitleCard</div>));

const mockLocalGokbPkg = localGokbPkg;

jest.mock('@folio/stripes/core', () => {
  const actual = jest.requireActual('@folio/stripes/core');
  return {
    ...actual,
    useOkapiKy: () => ({
      get: () => ({ json: () => Promise.resolve([mockLocalGokbPkg]) }),
    }),
  };
});

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

  describe('Info with external resource error', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Info
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            line={externalResourceWithError}
            resource={externalResourceWithError}
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
      await KeyValue('Parent agreement').has({ value: 'Test CM' });
    });

    test('renders a link with the parent agreements name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'Test CM' })).toBeInTheDocument();
    });

    test('renders the ErrorCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ErrorCard')).toBeInTheDocument();
    });
  });

  describe('Info with GOKB line', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Info
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            line={gokbLine}
            resource={gokbLine}
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
      await KeyValue('Parent agreement').has({ value: 'CM test 1' });
    });

    test('renders a link with the parent agreements name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'CM test 1' })).toBeInTheDocument();
    });

    test('renders the TitleCardExternal component', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCardExternal')).toBeInTheDocument();
    });

    test('renders the PackageCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCard')).toBeInTheDocument();
    });
  });
});
