import { renderWithIntl } from '@folio/stripes-erm-testing';
import { KeyValue } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import LinkedLicenseCard from './LinkedLicenseCard';
import { futureLicense, historicalLicense } from './testResources';

jest.mock('../LicenseAmendmentList', () => () => <div>LicenseAmendmentList</div>);

let renderComponent;
describe('LinkedLicenseCard', () => {
  describe('Future license card', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <LinkedLicenseCard
            id="agreement-future-license-0"
            license={futureLicense}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders LinkedLicenseCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('linkedLicense')).toBeInTheDocument();
    });

    test('renders a link with the license name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'Future license' })).toBeInTheDocument();
    });

    test('renders the LicenseCard', () => {
      const { getByText } = renderComponent;
      expect(getByText('LicenseCard')).toBeInTheDocument();
    });

    test('renders the expected note value', async () => {
      await KeyValue('Note').has({ value: 'Future license note' });
    });

    test('renders the LicenseAmendmentList', () => {
      const { getByText } = renderComponent;
      expect(getByText('LicenseAmendmentList')).toBeInTheDocument();
    });
  });

  describe('Historical license card', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <LinkedLicenseCard
            id="agreement-historical-license-0"
            license={historicalLicense}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders LinkedLicenseCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('linkedLicense')).toBeInTheDocument();
    });

    test('renders a link with the license name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'Historical license' })).toBeInTheDocument();
    });

    test('renders the LicenseCard', () => {
      const { getByText } = renderComponent;
      expect(getByText('LicenseCard')).toBeInTheDocument();
    });

    test('renders the expected note value', async () => {
      await KeyValue('Note').has({ value: 'Historical license note' });
    });

    test('renders the LicenseAmendmentList', () => {
      const { getByText } = renderComponent;
      expect(getByText('LicenseAmendmentList')).toBeInTheDocument();
    });
  });
});
