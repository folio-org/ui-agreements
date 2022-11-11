
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import { titleData, packageData, PCIdata, helperApp, handlers } from './testResources';
import EResource from './EResource';



jest.mock('../Package', () => () => <div>Package</div>);
jest.mock('../Title', () => () => <div>Title</div>);
jest.mock('../PCI', () => () => <div>PCI</div>);

describe('EResource', () => {
  let renderComponent;

  describe('isLoading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResource
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
            data={titleData}
            handlers={handlers}
            helperApp={helperApp}
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

  describe('Title resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResource
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
            data={titleData}
            handlers={handlers}
            helperApp={helperApp}
            isLoading={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the Title component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Title')).toBeInTheDocument();
    });

    it('renders the Edit button', async () => {
      await Button('Edit').exists();
    });
  });

  describe('Package resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResource
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
            data={packageData}
            handlers={handlers}
            helperApp={helperApp}
            isLoading={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the Package component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Package')).toBeInTheDocument();
    });

    it('does not render the Edit button', async () => {
      await Button('Edit').absent();
    });
  });

  describe('PCI resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <EResource
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
            data={PCIdata}
            handlers={handlers}
            helperApp={helperApp}
            isLoading={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the PCI component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PCI')).toBeInTheDocument();
    });

    it('renders the Edit button', async () => {
      await Button('Edit').exists();
    });
  });
});
