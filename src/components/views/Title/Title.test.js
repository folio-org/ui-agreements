
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';

import Title from './Title';
import { data, handlers } from './testResources';

jest.mock('../../TitleCard/TitleCardInfo', () => () => <div>TitleCardInfo</div>);
jest.mock('../../EResourceSections/AcquisitionOptions', () => () => <div>AcquisitionOptions</div>);
jest.mock('../../EResourceSections/Agreements', () => () => <div>Agreements</div>);
jest.mock('../../DiscoverySettings', () => () => <div>DiscoverySettings</div>);


describe('Title', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Title
          data={data}
          handlers={handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the TitleCardInfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('TitleCardInfo')).toBeInTheDocument();
  });

  it('renders the AcquisitionOptions component', () => {
    const { getByText } = renderComponent;
    expect(getByText('AcquisitionOptions')).toBeInTheDocument();
  });

  it('renders the Agreements component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Agreements')).toBeInTheDocument();
  });

  it('renders the NotesSmartAccordion component', () => {
    const { getByText } = renderComponent;
    expect(getByText('NotesSmartAccordion')).toBeInTheDocument();
  });

  it('renders the DiscoverySettings component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DiscoverySettings')).toBeInTheDocument();
  });
});
