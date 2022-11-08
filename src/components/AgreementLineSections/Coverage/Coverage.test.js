import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion, MultiColumnList, MultiColumnListCell, KeyValue } from '@folio/stripes-testing';
import { line, resource, defaultLine, defaultResource } from './testResources';
import translationsProperties from '../../../../test/helpers';
import Coverage from './Coverage';

describe('Coverage', () => {
  describe('renders with coverage type custom ', () => {
    beforeEach(() => {
      renderWithIntl(
        <Coverage line={line} resource={resource} />,
        translationsProperties
      );
    });

    test('renders Coverage Accordion', async () => {
      await Accordion('Coverage').exists();
    });

    test('renders the expected embargo value', async () => {
      await KeyValue('Embargo').has({ value: 'Moving wall end: 4 years' });
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
        await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: '10/1/2021' })
      ]);
    });

    test('renders expected coverage start volume in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: '1' }),
        await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: '6' })
      ]);
    });

    test('renders expected coverage start issue in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: '1' }),
        await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: 'Jan' })
      ]);
    });

    test('renders expected coverage end date in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: '9/30/2021' }),
        await MultiColumnListCell({ row: 1, columnIndex: 3 }).has({ content: '10/30/2021' })
      ]);
    });

    test('renders expected coverage end volume in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 4 }).has({ content: '8' }),
        await MultiColumnListCell({ row: 1, columnIndex: 4 }).has({ content: '1' })
      ]);
    });

    test('renders expected coverage end issue in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 5 }).has({ content: '12' }),
        await MultiColumnListCell({ row: 1, columnIndex: 5 }).has({ content: '20' })
      ]);
    });

    test('renders expected coverage type in the row ', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 6 }).has({ content: 'Custom' }),
        await MultiColumnListCell({ row: 1, columnIndex: 6 }).has({ content: 'Custom' })
      ]);
    });
  });

  describe('renders with coverage type default', () => {
    beforeEach(() => {
      renderWithIntl(
        <Coverage line={defaultLine} resource={defaultResource} />,
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
      await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: '11/1/2003' });
    });

    test('renders expected coverage start volume in the row', async () => {
      await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: '5' });
    });

    test('renders expected coverage start issue in the row', async () => {
      await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: 'Nov' });
    });

    test('renders expected coverage end date in the row', async () => {
      await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: '3/15/2013' });
    });

    test('renders expected coverage end volume in the row', async () => {
      await MultiColumnListCell({ row: 0, columnIndex: 4 }).has({ content: '9' });
    });

    test('renders expected coverage end issue in the row', async () => {
      await MultiColumnListCell({ row: 0, columnIndex: 5 }).has({ content: '1-4' });
    });

    test('renders expected coverage type in the row', async () => {
      await MultiColumnListCell({ row: 0, columnIndex: 6 }).has({ content: 'Default' });
    });
  });
});

