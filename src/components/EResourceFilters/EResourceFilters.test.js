import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Accordion, Checkbox, Button, MultiSelect } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { checkedActivedFilters, checkedData, activeFilters, data, filterHandlers } from './testResources';
import EResourceFilters from './EResourceFilters';


jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  MultiSelectionFilter: (props) => <div>{props.children}</div>,
}));

describe('EResourceFilters', () => {
  describe('EResourceFilters with unchecked filters', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <EResourceFilters
            activeFilters={activeFilters}
            data={data}
            filterHandlers={filterHandlers}
          />
        </MemoryRouter>,
          translationsProperties
        );
      });

      test('renders the Type Accordion', async () => {
          await Accordion('Type').exists();
      });

      test('renders the Publication type Accordion', async () => {
          await Accordion('Publication type').exists();
      });

      test('renders the Is package Accordion', async () => {
          await Accordion('Is package').exists();
      });

      test('renders the External data source Accordion', async () => {
          await Accordion('External data source').exists();
      });

      test('renders the Tags Accordion', async () => {
          await Accordion('Tags').exists();
      });

      test('renders Type Monograph Checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-type-monograph' }).exists();
      });

      test('renders Type Monograph checkbox as unchecked', async () => {
        await Checkbox({ id: 'clickable-filter-type-monograph' }).is({ checked: false });
      });

      test('renders Type Serial Checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-type-serial' }).exists();
      });

      test('renders Type Serial checkbox as unchecked', async () => {
        await Checkbox({ id: 'clickable-filter-type-serial' }).is({ checked: false });
      });

      test('renders the Type button', async () => {
        await Button('Type').exists();
      });

      test('renders the Publication type button', async () => {
        await Button('Publication type').exists();
      });

      test('renders the Is package button', async () => {
        await Button('Is package').exists();
      });

      test('renders the External data source button', async () => {
        await Button('External data source').exists();
      });

      test('renders the Tags button', async () => {
        await Button('Tags').exists();
      });

      test('renders the Tags multiSelection', async () => {
        await MultiSelect('Tags').select(['catalogingrecords, important, urgent']);
      });
    });

    describe('EResourceFilters with checked filters', () => {
      beforeEach(() => {
         renderWithIntl(
           <MemoryRouter>
             <EResourceFilters
               activeFilters={checkedActivedFilters}
               data={checkedData}
               filterHandlers={filterHandlers}
             />
           </MemoryRouter>,
            translationsProperties
          );
        });

        test('renders Type Monograph checkbox as checked', async () => {
          await Checkbox({ id: 'clickable-filter-type-monograph' }).is({ checked: true });
        });

        test('renders Type Serial checkbox as checked', async () => {
          await Checkbox({ id: 'clickable-filter-type-serial' }).is({ checked: true });
        });

        test('renders Publication type journal Checkbox as checked', async () => {
          await Checkbox({ id: 'clickable-filter-publicationType-journal' }).is({ checked: true });
        });

        test('renders Publication type book Checkbox as checked', async () => {
          await Checkbox({ id: 'clickable-filter-publicationType-book' }).is({ checked: true });
        });

        test('renders Publication type database Checkbox as checked', async () => {
          await Checkbox({ id: 'clickable-filter-publicationType-database' }).is({ checked: true });
        });

        test('renders Is package yes Checkbox as checked', async () => {
          await Checkbox({ id: 'clickable-filter-class-package' }).is({ checked: true });
        });

        test('renders Is package no Checkbox as checked', async () => {
          await Checkbox({ id: 'clickable-filter-class-nopackage' }).is({ checked: true });
        });

        test('renders the Tags multiSelection', async () => {
          await MultiSelect('').exists();
        });
      });
  });
