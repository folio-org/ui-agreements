import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, Modal, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import AgreementLine from './AgreementLine';
import { data, handlers } from './testResources';

jest.mock('../../AgreementLineSections/Info', () => () => <div>Info</div>);
jest.mock('../../AgreementLineSections/POLines', () => () => <div>POLines</div>);
jest.mock('../../AgreementLineSections/Documents', () => () => <div>Documents</div>);
jest.mock('../../AgreementLineSections/Coverage', () => () => <div>Coverage</div>);
jest.mock('../../DiscoverySettings', () => () => <div>DiscoverySettings</div>);

describe('AgreementLine', () => {
  let renderComponent;

  describe('isLoading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLine
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
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
          <AgreementLine
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
            data={data}
            handlers={handlers}
            isLoading={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the Info component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Info')).toBeInTheDocument();
    });

    it('renders the POLines component', () => {
      const { getByText } = renderComponent;
      expect(getByText('POLines')).toBeInTheDocument();
    });

    it('renders the Documents component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Documents')).toBeInTheDocument();
    });

    it('renders the Coverage component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Coverage')).toBeInTheDocument();
    });

    it('renders the DiscoverySettings component', () => {
      const { getByText } = renderComponent;
      expect(getByText('DiscoverySettings')).toBeInTheDocument();
    });

    describe('opening the actions menu', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Actions').click();
        });
      });

      describe('clicking the delete action button', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Delete').click();
          });
        });

        it('renders the agreement line delete modal', async () => {
          await waitFor(async () => {
            await Modal('Delete agreement line').exists();
          });
        });

        describe('clicking the cancel button', () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button('Cancel').click();
            });
          });

          it('closes the agreement line delete modal', async () => {
            await waitFor(async () => {
              await Modal('Delete agreement line').absent();
            });
          });
        });

        describe('clicking the delete button', () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button('Delete').click();
            });
          });

          it('calls the expected delete handler', async () => {
            await waitFor(() => {
              expect(handlers.onDelete).toHaveBeenCalled();
            });
          });
        });
      });

      describe('clicking the edit action button', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Edit').click();
          });
        });

        it('calls the expected edit handler', async () => {
          await waitFor(() => {
            expect(handlers.onEdit).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
