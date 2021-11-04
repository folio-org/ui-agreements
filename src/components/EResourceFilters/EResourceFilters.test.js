import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import EResourceFilters from './EResourceFilters';

jest.mock('@folio/stripes/smart-components');
const stateMock = jest.fn(() => Promise.resolve());

const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
};

describe('EResourceFilters', () => {
  describe('renders the EResourceFilters', () => {
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

      test('clicking the monograph checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-type-monograph' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the serial checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-type-serial' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the journal checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-publicationType-journal' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the book checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-publicationType-book' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the database checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-publicationType-database' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the yes checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-class-package' }).click();
        expect(stateMock).toHaveBeenCalled();
      });

      test('clicking the no checkbox', async () => {
        await Checkbox({ id: 'clickable-filter-class-nopackage' }).click();
        expect(stateMock).toHaveBeenCalled();
      });
    });
  });
