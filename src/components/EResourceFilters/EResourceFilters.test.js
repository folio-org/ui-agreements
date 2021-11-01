import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import EResourceFilters from './EResourceFilters';


jest.mock('@folio/stripes/smart-components');
const stateMock = jest.fn(() => Promise.resolve());

  const filterHandlers = {
    state : stateMock,
    checkbox: () => {},
    clear: () => {},
    clearGroup: () => {},
    reset: () => {},
};

describe('EResourceFilters', () => {
  describe(' renders the EResourceFilters', () => {
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

      it('should display filter by tags accordion', () => {
        expect(screen.getByText('Tags')).toBeInTheDocument();
      });

      it('should display filter by tags accordion', () => {
        expect(screen.getByText('External data source')).toBeInTheDocument();
      });

      test('renders the checkboxes', async () => {
        await Checkbox({ id: 'clickable-filter-type-monograph' }).click();
        await Checkbox({ id: 'clickable-filter-type-monograph' }).click();
        await Checkbox({ id: 'clickable-filter-publicationType-journal' }).click();
        await Checkbox({ id: 'clickable-filter-publicationType-book' }).click();
        await Checkbox({ id: 'clickable-filter-publicationType-database' }).click();
        await Checkbox({ id: 'clickable-filter-class-package' }).click();
        await Checkbox({ id: 'clickable-filter-class-nopackage' }).click();
        await waitForElementToBeRemoved(() => screen.getByText('External data source'));
        expect(stateMock).toHaveBeenCalled();
      });
    });
  });

