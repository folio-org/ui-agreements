import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter, useLocation } from 'react-router-dom';

import GokbRoute from './GokbRoute';
import { translationsProperties } from '../../../test/helpers';

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  SASQRoute: () => <div>SASQRoute</div>,
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}));

const location = {
  pathname: '/erm/agreements/gokb',
  search: '',
  hash: '',
  key: 'xyz',
};

let renderComponent;

describe('GokbRoute', () => {
  beforeEach(() => {
    useLocation.mockClear().mockReturnValue(location);

    renderComponent = renderWithIntl(
      <MemoryRouter>
        <GokbRoute location={location} />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the SASQRoute component', () => {
    const { getByText } = renderComponent;
    expect(getByText('SASQRoute')).toBeInTheDocument();
  });
});
