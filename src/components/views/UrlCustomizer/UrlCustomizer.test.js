import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Button, PaneHeader } from '@folio/stripes-erm-testing';

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

    test('renders the expected action buttons and clicking them should work as expcted', async () => {
      await waitFor(async () => {
        await Button('Actions').click();
        await Button('Edit').click();
        await Button('Delete').click();
        await Button('Cancel').click();
        await Button('Delete').click();
      });

      expect(handlers.onDelete).toHaveBeenCalled();
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
