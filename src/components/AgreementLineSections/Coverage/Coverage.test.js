import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion, MultiColumnList, MultiColumnListCell } from '@folio/stripes-testing';
import { line, resource } from './testResources';
import translationsProperties from '../../../../test/helpers';
import Coverage from './Coverage';

describe('Coverage', () => {
  beforeEach(() => {
    renderWithIntl(
      <Coverage line={line} resource={resource} />,
      translationsProperties
    );
  });

  test('renders Coverage Accordion', async () => {
    await Accordion('Coverage').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 7 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({
      columns: [
        'Start date',
        'Start volume',
        'Start issue',
        'End date',
        'End volume',
        'End issue',
        'Coverage type',
      ],
    }).exists();
  });

  test('renders expected coverage start date in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: '9/1/2021' }),
    ]);
  });

  test('renders expected coverage start volume in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: '09/04/2021' }),
    ]);
  });

  test('renders expected coverage start issue in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: '09/04/2021' }),
    ]);
  });

  test('renders expected coverage end date in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: '9/30/2021' }),
    ]);
  });

  test('renders expected coverage end volume in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 4 }).has({ content: '09/28/2021' }),
    ]);
  });

  test('renders expected coverage end issue in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 5 }).has({ content: '09/28/2021' }),
    ]);
  });

  test('renders expected coverage type in the row', async () => {
    Promise.all([
      await MultiColumnListCell({ row: 0, columnIndex: 6 }).has({ content: 'Custom ' }),
    ]);
  });
});

