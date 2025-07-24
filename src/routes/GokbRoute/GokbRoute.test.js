import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ky from 'ky';
import GokbRoute from './GokbRoute';
import translationsProperties from '../../../test/helpers';

let capturedProps = {};

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  SASQRoute: (props) => {
    capturedProps = props;
    return <div>SASQRoute</div>;
  },
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Icon: () => <span>Icon</span>,
  FormattedUTCDate: ({ value }) => <span>{value}</span>,
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  AppIcon: () => <span>AppIcon</span>,
}));

jest.mock('ky', () => ({
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({
      count: 5,
      records: ['test-data'],
    })),
  })),
}));

const location = {
  pathname: '/erm/agreements/gokb',
  search: '',
};

let renderComponent;

describe('GokbRoute', () => {
  beforeEach(() => {
    useLocation.mockClear().mockReturnValue(location);
    capturedProps = {}; // Reset between tests

    renderComponent = renderWithIntl(
      <MemoryRouter>
        <GokbRoute location={location} />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders SASQRoute', () => {
    const { getByText } = renderComponent;
    expect(getByText('SASQRoute')).toBeInTheDocument();
  });

  test('lookupQueryPromise fetches correctly', async () => {
    await capturedProps.lookupQueryPromise({
      _ky: {},
      queryParams: '',
      endpoint: '',
    });
    expect(ky.get).toHaveBeenCalled();
  });

  // test('queryParameterGenerator generates expected query', () => {
  //   const result = capturedProps.queryParameterGenerator(
  //     { page: 2, perPage: 10 },
  //     { query: 'foo' }
  //   );
  //   expect(result).toContain('name=foo');
  //   expect(result).toContain('offset=10');
  // });

  test('queryParameterGenerator generates expected query', () => {
    const result = capturedProps.queryParameterGenerator(
      {
        page: 2,
        perPage: 10,
        filterKeys: {
          type: 'componentType',
          dummy: 'dummyPath'
        }
      },
      {
        query: 'foo',
        filters: 'type.Book,dummy.First'
      }
    );

    expect(result).toContain('name=foo');
    expect(result).toContain('offset=10');
    expect(result).toContain('&componentType=Book');
    expect(result).toContain('&dummyPath=First');
  });

  test('lookupResponseTransform transforms correctly', () => {
    const transformed = capturedProps.lookupResponseTransform({
      count: 5,
      records: ['test-data'],
    });
    expect(transformed.totalRecords).toBe(5);
    expect(transformed.results).toEqual(['test-data']);
  });
});
