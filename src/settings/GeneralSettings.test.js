
import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../test/helpers';
import GeneralSettings from './GeneralSettings';

describe('GeneralSettings', () => {
  describe('rendering the GeneralSettings component', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <GeneralSettings />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders ConfigManager component ', () => {
      const { getByText } = renderComponent;
      expect(getByText('ConfigManager')).toBeInTheDocument();
    });
  });
});
