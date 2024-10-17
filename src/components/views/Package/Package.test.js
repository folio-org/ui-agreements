
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';

import Package from './Package';
import { data, handlers } from './testResources';

jest.mock('../../EResourceSections/Agreements', () => () => <div>Agreements</div>);
jest.mock('../../EResourceSections/ExtendedPackageInformation', () => () => <div>ExtendedPackageInformation</div>);
jest.mock('../../EResourceSections/PackageContents', () => () => <div>PackageContents</div>);
jest.mock('../../EResourceSections/PackageInfo', () => () => <div>PackageInfo</div>);

describe('Package', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Package
          data={data}
          handlers={handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the PackageInfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PackageInfo')).toBeInTheDocument();
  });

  it('renders the ExtendedPackageInformation component', () => {
    const { getByText } = renderComponent;
    expect(getByText('ExtendedPackageInformation')).toBeInTheDocument();
  });

  it('renders the Agreements component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Agreements')).toBeInTheDocument();
  });

  it('renders the PackageContents component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PackageContents')).toBeInTheDocument();
  });

  it('renders the NotesSmartAccordion component', () => {
    const { getByText } = renderComponent;
    expect(getByText('NotesSmartAccordion')).toBeInTheDocument();
  });
});
