import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import InternalContacts from './InternalContacts';
import agreement from './testResources';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  InternalContactCard: () => <div>InternalContactCard</div>,
}));

let renderComponent;

describe('InternalContacts', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <InternalContacts
        agreement={agreement}
        id="internalContacts"
      />,
      translationsProperties
    );
  });

  test('renders the Internal contacts Accordion', async () => {
    await Accordion('Internal contacts').exists();
  });

  test('renders the InternalContactCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('InternalContactCard'));
  });
});
