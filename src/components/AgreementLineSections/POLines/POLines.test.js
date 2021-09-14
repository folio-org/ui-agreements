import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Accordion } from '@folio/stripes-testing';
import line from './testResources';
import translationsProperties from '../../../../test/helpers';
import POLines from './POLines';


jest.mock('../../POLineCard', () => () => <div>POLineCard</div>);
describe('POLines', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <POLines line={line} />,
      translationsProperties
    );
  });
  test('renders the POLines Accordion', async () => {
    await Accordion('PO lines').exists();
  });
  test('renders the POLineCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('POLineCard')).toBeInTheDocument();
  });
});
