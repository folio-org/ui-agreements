
import { renderWithIntl, Accordion, KeyValue } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import UsageData from './UsageData';
import agreement from './testResources';

let renderComponent;

describe('UsageData', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <UsageData
          agreement={agreement}
          id="usageData"
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Usage data Accordion', async () => {
    await Accordion('Usage data').exists();
  });

  test('renders the UsageData card', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('usageData')).toBeInTheDocument();
  });

  test('renders a link with the expected provider name', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('link', { name: 'Alexander Street Press' })).toBeInTheDocument();
  });

  test('renders the expected note value', async () => {
    await KeyValue('Note').has({ value: 'usage data note' });
  });
});
