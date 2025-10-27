import { MemoryRouter } from 'react-router-dom';

import {
  Link,
  MultiColumnList,
  MultiColumnListCell,
  renderWithIntl,
  TextDiv
} from '@folio/stripes-erm-testing';

import GokbTIPPTable from './GokbTIPPTable';
import { gokbTipps } from '../../../../test/jest/GOKB';
import translationsProperties from '../../../../test/helpers';
import { pcis as mockPcis, pkgs as mockPkgs } from '../../../../test/jest/eresources';
import { PACKAGES_ENDPOINT as MOCK_PACKAGES_ENDPOINT } from '../../../constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useChunkedIdTransformFetch: ({ endpoint }) => ({
    items: endpoint === MOCK_PACKAGES_ENDPOINT ?
      mockPkgs.filter(p => p.id === 'eab7a8ea-6665-4f06-a55a-73a5aad36215' || p.id === '9bd869e3-6c3c-42d2-aaf6-96d2725e71f3') :
      mockPcis.filter(p => p.name === '\'International Journal of Managerial Finance\' on Platform \'Emerald Insight\' in Package Accounting Finance and Economics eJournal collection'),
    isLoading: false
  })
}));

jest.mock('../GokbBasketButton', () => () => <div>GokbBasketButton</div>);
jest.mock('../../../components/Coverage', () => () => <div>Coverage</div>);

jest.mock('@folio/stripes-erm-components', () => ({
  TitleOnPlatformLink: jest.fn(() => <div>TitleOnPlatformLink</div>),
}));

describe('GokbTIPPTable', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <GokbTIPPTable tipps={gokbTipps} />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('Should render an MCL with 5 rows', async () => {
    await MultiColumnList().has({ rowCount: 5 });
  });

  test('MCL columns are as expected', async () => {
    await MultiColumnList().has({ columns: ['Package name', 'Coverage', 'Platform', 'Sync status', 'Title in KB', 'Actions'] });
  });


  // Workaround to not having index in describe each...
  describe.each(
    gokbTipps.map((gkbt, index) => {
      const isPkgInSystem = gkbt.id === 5994401 || gkbt.id === 27314502; // These two packages in system
      const isTitleInSystem = gkbt.id === 5994401;

      return ({
        ...gkbt,
        isPkgInSystem,
        isTitleInSystem,
        index
      });
    })
  )('testing TIPP $tippTitleName:$id', ({
    index,
    isTitleInSystem,
    isPkgInSystem,
    tippPackageName
  }) => {
    // These two should have packages in KB
    if (isPkgInSystem) {
      test(`renders a Package Link with text ${tippPackageName}`, async () => {
        await MultiColumnListCell({ row: index, columnIndex: 0 }).find(Link(tippPackageName)).exists();
      });
    } else {
      test('does not render a Package Link', async () => {
        await MultiColumnListCell({ row: index, columnIndex: 0 }).find(Link()).absent();
      });

      test(`renders the package name: ${tippPackageName}`, async () => {
        await MultiColumnListCell({ row: index, columnIndex: 0 }).has({ text: tippPackageName });
      });
    }

    // EXAMPLE using the TextDiv (also can use pure hasText in MCLCell... see below)
    test('renders the coverage component', async () => {
      await MultiColumnListCell({ row: index, columnIndex: 1 }).find(TextDiv('Coverage')).exists();
    });

    test('renders the platform component', async () => {
      await MultiColumnListCell({ row: index, columnIndex: 2 }).has({ text: 'TitleOnPlatformLink' });
    });

    test('renders the syncStatus component', async () => {
      let expectedText;

      if (
        isTitleInSystem
      ) {
        expectedText = 'Enabled';
      } else if (
        isPkgInSystem
      ) {
        expectedText = 'Disabled';
      } else {
        expectedText = 'Package not in local KB';
      }

      await MultiColumnListCell({ row: index, columnIndex: 3 }).has({ text: expectedText });
    });

    test('renders the titleInKb component', async () => {
      const expectedText = isTitleInSystem ? 'View in local KB' : 'Title not in local KB';

      await MultiColumnListCell({ row: index, columnIndex: 4 }).has({ text: expectedText });
    });

    test('renders the basket button component', async () => {
      await MultiColumnListCell({ row: index, columnIndex: 5 }).has({ text: 'GokbBasketButton' });
    });
  });
});

