import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Accordion } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data, filterHandlers } from './testResources';
import EResourceFilters from './EResourceFilters';

describe('EResourceFilters', () => {
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
  });
