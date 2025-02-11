import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import PackageCard from './PackageCard';

let renderComponent;
describe('PackageCard', () => {
  describe.each([
    [
      'with pkg resource',
      {
        id: 'd01a73b8-2978-40dc-88bb-820e96794b4a',
        vendor: { name: 'JSTOR' },
        source: 'GOKb',
        name: 'JSTOR : Arts & Sciences III Collection : NK',
        reference: 'JSTOR_:_Arts_&_Sciences_III_Collection_:_NK',
        resourceCount: 228,
        lifecycleStatus: { label: 'Current' },
        availabilityScope: { label: 'Global' },
        availability: { label: 'Global' },
        syncContentsFromSource: true,
      },
      {
        resourceCount: '228',
        vendorName: 'JSTOR',
        source: 'GOKb',
        reference: 'JSTOR_:_Arts_&_Sciences_III_Collection_:_NK',
        lifecycleStatus: 'Current',
        availability: 'Global',
        syncContentsFromSource: 'Synchronising',
      },
    ],
    [
      'with pkg._object resource',
      {
        _object: {
          vendor: { name: 'JSTOR' },
          source: 'GOKb',
          reference: 'JSTOR_:_Arts_&_Sciences_V_Collection_:_NK',
          resourceCount: 211,
          name: 'JSTOR : Arts & Sciences V Collection : NK',
          lifecycleStatus: { label: 'No value set-' },
          availability: { label: 'No value set-' },
          syncContentsFromSource: false,
        },
      },
      {
        resourceCount: '211',
        vendorName: 'JSTOR',
        source: 'GOKb',
        reference: 'JSTOR_:_Arts_&_Sciences_V_Collection_:_NK',
        lifecycleStatus: 'No value set-',
        availability: 'No value set-',
        syncContentsFromSource: 'Paused',
      },
    ],
    [
      'with null synchronisation status',
      {
        id: '9e2fa634-c3d4-469e-9c1d-ab83e521e73d',
        vendor: { name: 'American Institute of Aeronautics and Astronautics' },
        source: 'GOKb',
        name: 'American Institute of Aeronautics and Astronautics',
        reference: 'American Institute of Aeronautics and Astronautics',
        resourceCount: 1742,
        lifecycleStatus: { label: 'Current' },
        availabilityScope: { label: 'Global' },
        availability: { label: 'Global' },
        syncContentsFromSource: null,
      },
      {
        resourceCount: '1742',
        vendorName: 'American Institute of Aeronautics and Astronautics',
        source: 'GOKb',
        reference: 'American Institute of Aeronautics and Astronautics',
        lifecycleStatus: 'Current',
        availability: 'Global',
        syncContentsFromSource: 'No value set-',
      },
    ],
  ])('PackageCard tests', (
    packageTitle,
    packageState,
    expectedPackageData
  ) => {
    describe(packageTitle, () => {
      beforeEach(async () => {
        renderComponent = renderWithIntl(
          <Router>
            <PackageCard pkg={packageState} />
          </Router>,
          translationsProperties
        );
      });

      test('renders PackageCard component', () => {
        const { getByTestId } = renderComponent;
        expect(getByTestId('packageCard')).toBeInTheDocument();
      });

      test('renders the expected resourceCount', async () => {
        await KeyValue('Count').has({ value: expectedPackageData.resourceCount });
      });

      test('renders the expected vendorName', async () => {
        await KeyValue('Provider').has({ value: expectedPackageData.vendorName });
      });

      test('renders the expected source', async () => {
        await KeyValue('Source').has({ value: expectedPackageData.source });
      });

      test('renders the expected reference', async () => {
        await KeyValue('Reference').has({ value: expectedPackageData.reference });
      });

      test('renders the expected lifecycle status', async () => {
        await KeyValue('Status').has({ value: expectedPackageData.lifecycleStatus });
      });

      test('renders the expected availability', async () => {
        await KeyValue('Availability').has({ value: expectedPackageData.availability });
      });

      test('renders the expected Synchronisation status', async () => {
        await KeyValue('Synchronisation status').has({ value: expectedPackageData.syncContentsFromSource });
      });
    });
  });
});

