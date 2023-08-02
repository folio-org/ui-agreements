
import { renderWithIntl, Button, Dropdown, MultiColumnList } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import CoveredEResourcesList from './CoveredEResourcesList';
import agreement from './testResources';

jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

const handlers = {
  onFilterEResources: jest.fn(),
  onExportEResourcesAsJSON: jest.fn().mockImplementation(() => Promise.resolve()),
  onExportEResourcesAsKBART: jest.fn().mockImplementation(() => Promise.resolve()),
  onNeedMoreEResources: jest.fn()
};

describe('CoveredEResourcesList', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <CoveredEResourcesList
          agreement={agreement}
          eresourcesFilterPath="current"
          {...handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expected filter buttons', async () => {
    await Button('Current').exists();
    await Button('Future').exists();
    await Button('Dropped').exists();
    await Button('All').exists();
  });

  test('clicking the filter buttons should call the onFilterEResources callback', async () => {
    await Button('Future').click();
    expect(handlers.onFilterEResources.mock.calls.length).toBe(1);
    await Button('Dropped').click();
    expect(handlers.onFilterEResources.mock.calls.length).toBe(2);
    await Button('All').click();
    expect(handlers.onFilterEResources.mock.calls.length).toBe(3);
  });

  test('renders the Export dropdown', async () => {
    await Dropdown('Export as...').exists();
  });

  test('choosing the dropdown options', async () => {
    await Dropdown('Export as...').choose('JSON');
    expect(handlers.onExportEResourcesAsJSON.mock.calls.length).toBe(1);
    await Dropdown('Export as...').choose('KBART');
    expect(handlers.onExportEResourcesAsKBART.mock.calls.length).toBe(1);
  });

  test('renders the CoveredEResourcesList MCL', async () => {
    await MultiColumnList('eresources-covered').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 8 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name', 'eISSN/ISSN', 'Platform', 'Package', 'Coverage', ' ', 'Access start', 'Access end'] }).exists();
  });
});

