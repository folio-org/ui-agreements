
import { renderWithIntl, TestForm, Checkbox } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import SuppressFromDiscoveryFields from './SuppressFromDiscoveryFields';

const onSubmit = jest.fn();

const initialValues = {
  displaySuppressFromDiscovery: { pci: true, agreementLine: true, title: true },
};

describe('SuppressFromDiscoveryFields', () => {
  let renderComponent;
  describe('no initial values set', () => {
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

  describe('with initial values set', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
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

    test('renders the "Agreement lines" checkbox as checked', async () => {
      await Checkbox({ id: 'displaySuppressFromDiscoveryAgreementLine' }).is({ checked: true });
    });

    test('renders the "Titles in packages" checkbox', async () => {
      await Checkbox({ id: 'displaySuppressFromDiscoveryPCI' }).exists();
    });

    test('renders the "Titles in packages" checkbox as checked', async () => {
      await Checkbox({ id: 'displaySuppressFromDiscoveryPCI' }).is({ checked: true });
    });

    test('renders the "Titles" checkbox', async () => {
      await Checkbox({ id: 'displaySuppressFromDiscoveryTitle' }).exists();
    });

    test('renders the "Titles" checkbox as checked', async () => {
      await Checkbox({ id: 'displaySuppressFromDiscoveryTitle' }).is({ checked: true });
    });
  });
});
