import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { Accordion, Checkbox, MultiSelect } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { checkedActivedFilters, checkedData, activeFilters, data, filterHandlers } from './testResources';
import EResourceFilters from './EResourceFilters';


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

      it('should display the correct Type filter name', () => {
        expect(screen.getByText('Type')).toBeVisible();
      });

      it('should display the correct Publication type filter name', () => {
        expect(screen.getByText('Publication type')).toBeVisible();
      });

      it('should display the correct Is package filter name', () => {
        expect(screen.getByText('Is package')).toBeVisible();
      });

      it('should display the correct External data source filter name', () => {
        expect(screen.getByText('External data source')).toBeVisible();
      });

      it('should display the correct Tags filter name', () => {
        expect(screen.getByText('Tags')).toBeVisible();
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

        it('should display filter by tags accordion', () => {
          expect(screen.getByText('Tags')).toBeInTheDocument();
        });

        // test('renders the Tags multiSelection', async () => {
        //   await MultiSelect('Tags').exists();
        // });

        // test('renders the Tags multiSelection', async () => {
        //   await MultiSelect('Tags').select(['catalogingrecords', 'important', 'urgent']);
        // });
      });
  });

