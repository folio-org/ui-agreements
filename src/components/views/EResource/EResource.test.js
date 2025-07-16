
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Button, Modal } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import { titleData, packageData, PCIdata, helperApp, handlers } from './testResources';
import EResource from './EResource';

jest.mock('../Package', () => () => <div>Package</div>);
jest.mock('../Title', () => () => <div>Title</div>);
jest.mock('../PCI', () => () => <div>PCI</div>);

const packageDataWithContents = {
  ...packageData,
  packageContentsCount: 3
};

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
            data={packageDataWithContents}
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

    test('actions menu exists', async () => {
      await Button('Actions').exists();
    });

    describe('opening actions menu', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Actions').click();
        });
      });

      test('Start synchronisation button exists', async () => {
        await waitFor(async () => {
          await Button('Start synchronisation').exists();
        });
      });

      test('Pause synchronisation button exists', async () => {
        await waitFor(async () => {
          await Button('Pause synchronisation').exists();
        });
      });

      test('Delete package contents button exists', async () => {
        await waitFor(async () => {
          await Button({ id: 'clickable-dropdown-delete-pkg-contents' }).exists();
        });
      });

      describe('clicking delete package contents', () => {
        beforeEach(async () => {
          handlers.onDeleteDryRun.mockResolvedValue({ numberDeleted: 2 });

          await waitFor(async () => {
            await Button({ id: 'clickable-dropdown-delete-pkg-contents' }).click();
          });
        });

        test('renders the confirmation modal', async () => {
          await waitFor(async () => {
            await Modal('Create job to delete package contents').exists();
          });
        });

        describe('cancelling confirmation modal', () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button('Cancel').click();
            });
          });

          test('confirmation modal no longer renders', async () => {
            await waitFor(async () => {
              await Modal('Create job to delete package contents').absent();
            });
          });
        });
      });
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
