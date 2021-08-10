import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button, Dropdown, MultiColumnList, MultiColumnListCell } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import translationsProperties from '../../../../test/helpers';
import CoveredEResourcesList from './CoveredEResourcesList';
import agreement from './testResources';

jest.mock('../../IfEResourcesEnabled', () => ({ children }) => <>{children}</>);

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

  // test('renders expected row count', async () => {
  //   await MultiColumnList({ rowCount: agreement.agreementLinesCount }).exists();
  // });

  // test('renders expected agreement line name in each row', async () => {
  //   Promise.all([
  //     await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'ACS in Focus Test' }),
  //     await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'American Society of Civil Engineers : Journals' })
  //   ]);
  // });

  // test('renders expected Provider in each row', async () => {
  //   Promise.all([
  //     await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: 'American Chemical Society' }),
  //     await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: 'American Society of Civil Engineers' })
  //   ]);
  // });

  // test('renders expected Publication type date in each row', async () => {
  //   Promise.all([
  //     await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: 'Package' }),
  //     await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: 'Package' })
  //   ]);
  // });

  // describe('Clicking the first row', () => {
  //   beforeEach(async () => {
  //     /* clicking the second column here instead of the first one because the first cell has a
  //      link and we prevent the onRowClick to be called when we click a link within a cell */
  //     await MultiColumnList('agreement-lines').click({ row: 0, columnIndex: 1 });
  //   });

  //   test('should call the onViewAgreementLine callback', () => {
  //     expect(onViewAgreementLine).toHaveBeenCalled();
  //   });
  // });
});

