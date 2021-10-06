import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion, MultiColumnList, MultiColumnListCell } from '@folio/stripes-testing';
import data from './testResources';
import translationsProperties from '../../../../test/helpers';
import PlatformUrlCustomization from './PlatformUrlCustomization';

describe('PlatformUrlCustomization', () => {
  beforeEach(() => {
    renderWithIntl(
      <PlatformUrlCustomization
        handlers={data.handlers}
        platform={data.platform}
        stringTemplates={data.stringTemplates}
      />,
      translationsProperties
    );
  });
  test('renders the PlatformUrlCustomization Accordion', async () => {
    await Accordion('Platform URL customization settings').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 2 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name', 'Customization code'] }).exists();
  });

  test('renders expected name and customization code in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'Test' }),
      await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: '2222' })
    ]);
  });
});
