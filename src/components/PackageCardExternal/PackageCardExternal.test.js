
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import PackageCardExternal from './PackageCardExternal';

const packageData = {
  'accessStatusType': 'access status type 1',
  'authority': 'EKB-PACKAGE',
  'reference': '150088-1147872',
  'name': 'Access to Research for Development and Innovation (ARDI)',
  'titleCount': 61214,
  'selectedCount': 0,
  'contentType': 'Aggregated Full Text',
  'providerName': 'Research4Life'
};

const pkg = {
  'id': 'e240e51d-567d-4597-868c-69aede89b2ff',
  'type': 'external',
  'reference_object': {
    'accessStatusType': 'access status type 2',
    'label': 'Science Database',
    'type': 'Package',
    'provider': 'Proquest Info & Learning Co',
    'titleCount': 1417,
    'selectedCount': 1416,
    'contentType': 'Aggregated Full Text',
    'providerName': 'Proquest Info & Learning Co',
    'isSelected': true
  },
};

let renderComponent;
describe('PackageCardExternal', () => {
  describe('with packageData resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <PackageCardExternal
            packageData={packageData}
          />
        </Router>,
        translationsProperties
      );
    });
    test('renders PackageCardExternal component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('packageCardExternal')).toBeInTheDocument();
    });

    test('renders a link with the packageData name', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'Access to Research for Development and Innovation (ARDI)' })).toBeInTheDocument();
    });

    test('renders the expected contentType', async () => {
      await KeyValue('Package content type').has({ value: 'Aggregated Full Text' });
    });

    test('renders the expected holding status', async () => {
      await KeyValue('Holding status').has({ value: 'Not selected' });
    });

    test('renders the expected access status type', async () => {
      await KeyValue('Access status type').has({ value: 'access status type 1' });
    });

    test('renders the expected providerName', async () => {
      await KeyValue('Provider').has({ value: 'Research4Life' });
    });

    test('renders the expected count', async () => {
      await KeyValue('Count').has({ value: '0 / 61214' });
    });
  });

  describe('with pkg resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <PackageCardExternal
            pkg={pkg}
          />
        </Router>,
        translationsProperties
      );
    });
    test('renders PackageCardExternal component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('packageCardExternal')).toBeInTheDocument();
    });

    test('renders a link with the pkg reference_object label', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'Science Database' })).toBeInTheDocument();
    });

    test('renders the expected contentType', async () => {
      await KeyValue('Package content type').has({ value: 'Aggregated Full Text' });
    });

    test('renders the expected holding status', async () => {
      await KeyValue('Holding status').has({ value: 'Selected' });
    });

    test('renders the expected access status type', async () => {
      await KeyValue('Access status type').has({ value: 'access status type 2' });
    });

    test('renders the expected providerName', async () => {
      await KeyValue('Provider').has({ value: 'Proquest Info & Learning Co' });
    });

    test('renders the expected count', async () => {
      await KeyValue('Count').has({ value: '1416 / 1417' });
    });
  });
});
