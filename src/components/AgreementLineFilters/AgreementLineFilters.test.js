import { waitFor } from '@folio/jest-config-stripes/testing-library/react';


import { Accordion, Checkbox, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import { activeFilters, data } from './testResources';
import AgreementLineFilters from './AgreementLineFilters';

const stateMock = jest.fn();

const filterHandlers = {
  state: stateMock,
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
};
describe('AgreementLineFilters', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
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

  test('renders two DateFilter components', () => {
    const { getAllByText } = renderComponent;
    expect(getAllByText('DateFilter').length).toEqual(2);
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
