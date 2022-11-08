import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';

import PCI from './PCI';
import { data, handlers } from './testResources';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  handleSaveKeyCommand: () => jest.fn()
}));

jest.mock('../../PackageCard', () => () => <div>PackageCard</div>);
jest.mock('../../TitleCard', () => () => <div>TitleCard</div>);
jest.mock('../../EResourceSections/Agreements', () => () => <div>Agreements</div>);
jest.mock('../../EResourceSections/PCICoverage', () => () => <div>PCICoverage</div>);
jest.mock('../../EResourceSections/PCIInfo', () => () => <div>PCIInfo</div>);
jest.mock('../../DiscoverySettings', () => () => <div>DiscoverySettings</div>);

describe('PCI', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <PCI
          data={data}
          handlers={handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the PackageCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PackageCard')).toBeInTheDocument();
  });

  it('renders the TitleCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('TitleCard')).toBeInTheDocument();
  });

  it('renders the Agreements component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Agreements')).toBeInTheDocument();
  });

  it('renders the PCICoverage component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PCICoverage')).toBeInTheDocument();
  });

  it('renders the PCIInfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PCIInfo')).toBeInTheDocument();
  });

  it('renders the DiscoverySettings component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DiscoverySettings')).toBeInTheDocument();
  });
});
