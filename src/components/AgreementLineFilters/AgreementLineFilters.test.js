import React from 'react';
import { waitFor } from '@testing-library/dom';

import '@folio/stripes-erm-testing/jest/directMocks';
import { mockErmComponents, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Accordion, Checkbox } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import AgreementLineFilters from './AgreementLineFilters';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents,
}));

const stateMock = jest.fn();

const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
};
describe('AgreementFilters', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <AgreementLineFilters
          activeFilters={activeFilters}
          data={data}
          filterHandlers={filterHandlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Agreement Accordion', async () => {
    await Accordion('Agreement').exists();
  });

  test('renders the Type Accordion', async () => {
    await Accordion('Agreement line type').exists();
  });

  test('renders the Active from date Accordion', async () => {
    await Accordion('Active from').exists();
  });

  test('renders the Active to date Accordion', async () => {
    await Accordion('Active to').exists();
  });

  test('renders the PoLine Accordion', async () => {
    await Accordion('PO line').exists();
  });

  test('renders the Tags Accordion', async () => {
    await Accordion('Tags').exists();
  });

  let index = 1;
  const testAgreementLineFilterCheckbox = (field, value, label = null) => (
    test(`clicking the ${label ?? value} checkbox`, async () => {
      await waitFor(async () => {
        await Checkbox({ id: `clickable-filter-${field}-${value}` }).click();
      });

      await waitFor(() => {
        expect(stateMock.mock.calls.length).toEqual(index);
      });

      index++;
    })
  );

  testAgreementLineFilterCheckbox('lineType', 'type-detached', 'detached');
  testAgreementLineFilterCheckbox('lineType', 'type-external', 'external');
  testAgreementLineFilterCheckbox('lineType', 'type-is-null', 'internal');
});
