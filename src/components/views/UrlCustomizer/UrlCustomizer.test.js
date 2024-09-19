import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, PaneHeader, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import { data, handlers } from './testResources';
import UrlCustomizer from './UrlCustomizer';

describe('UrlCustomizer', () => {
  let renderComponent;

  describe('isLoading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <UrlCustomizer
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
          <UrlCustomizer
            data={data}
            handlers={handlers}
            isLoading={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the expcected URL customization pane header', async () => {
      await PaneHeader('test customization URL customization').is({ visible: true });
    });

    describe('clicking actions button', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Actions').click();
        });
      });

      test('renders expected buttons', async () => {
        await waitFor(async () => {
          await Button('Edit').exists();
          await Button('Delete').exists();
        });
      });

      describe('clicking edit button', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Edit').click();
          });
        });

        test('edit callback called as expected', async () => {
          await waitFor(async () => {
            expect(handlers.onEdit).toHaveBeenCalled();
          });
        });
      });

      describe('clicking delete button', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Delete').click();
          });
        });

        test('renders cancel button', async () => {
          await waitFor(async () => {
            await Button('Cancel').exists();
          });
        });

        test('renders delete button within modal', async () => {
          await waitFor(async () => {
            // Button above is also labelled "Delete", so use id for now
            await Button({ id: 'clickable-delete-agreement-confirmation-confirm' }).exists();
          });
        });

        describe('clicking cancel button', () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button('Cancel').click();
            });
          });

          test('no longer renders cancel button', async () => {
            await waitFor(async () => {
              await Button('Cancel').absent();
            });
          });
        });

        describe('clicking delete button within modal', () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button({ id: 'clickable-delete-agreement-confirmation-confirm' }).click();
            });
          });

          test('no longer renders cancel button (there is still a button labelled \'Delete\')', async () => {
            await waitFor(async () => {
              await Button('Cancel').absent();
            });
          });

          test('delete callback called as expected', async () => {
            await waitFor(async () => {
              expect(handlers.onDelete).toHaveBeenCalled();
            });
          });
        });
      });
    });

    it('renders the expected URL customization name', () => {
      const { getAllByText } = renderComponent;
      expect(getAllByText('test customization URL customization')[1]).toBeInTheDocument();
    });

    it('renders the expected URL customization code', () => {
      const { getByText } = renderComponent;
      expect(getByText('test code')).toBeInTheDocument();
    });
  });
});
