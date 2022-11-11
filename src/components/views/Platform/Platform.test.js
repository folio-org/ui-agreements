
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import { data, handlers } from './testResources';
import Platform from './Platform';



jest.mock('../../PlatformSections/PlatformInfo', () => () => <div>PlatformInfo</div>);
jest.mock('../../PlatformSections/PlatformUrlCustomization', () => () => <div>PlatformUrlCustomization</div>);
jest.mock('../../PlatformSections/PlatformProxySettings', () => () => <div>PlatformProxySettings</div>);

describe('Platform', () => {
  let renderComponent;

  describe('isLoading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Platform
            data={data}
            handlers={handlers}
            isLoading
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the LoadingPane component', () => {
      const { getByText } = renderComponent;
      expect(getByText('LoadingPane')).toBeInTheDocument();
    });
  });

  describe('after loading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Platform
            data={data}
            handlers={handlers}
            isLoading={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the PlatformInfo component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PlatformInfo')).toBeInTheDocument();
    });

    it('renders the PlatformUrlCustomization component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PlatformUrlCustomization')).toBeInTheDocument();
    });

    it('renders the PlatformProxySettings component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PlatformProxySettings')).toBeInTheDocument();
    });
  });
});
