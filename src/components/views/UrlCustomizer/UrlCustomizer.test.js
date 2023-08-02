
import { renderWithIntl, Button, PaneHeader } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
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
      await Button('Actions').exists();
      await Button('Actions').click();
      await Button('Edit').exists();
      await Button('Delete').exists();
      await Button('Delete').click();
      await Button('Cancel').exists();
      await Button('Cancel').exists();
      await Button('Delete').exists();
      await Button('Delete').click();
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
