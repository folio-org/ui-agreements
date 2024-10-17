

import { renderWithIntl, Accordion, KeyValue } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import ControllingLicense from './ControllingLicense';
import agreement from './testResources';

jest.mock('../../LicenseAmendmentList', () => () => <div>LicenseAmendmentList</div>);
let renderComponent;

describe('ControllingLicense', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <ControllingLicense
          agreement={agreement}
          id="controllingLicense"
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Controlling licenses Accordion', async () => {
    await Accordion('Controlling license').exists();
  });

  test('renders the Controlling license card component', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('controllingLicense')).toBeInTheDocument();
  });

  test('renders the LicenseCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('LicenseCard')).toBeInTheDocument();
  });

  test('renders the expected license name in the card header', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('link', { name: 'AM license 1' })).toBeInTheDocument();
  });

  test('renders the expected note', async () => {
    await KeyValue('Note').has({ value: 'controlling license' });
  });

  test('renders the LicenseAmendmentList list', async () => {
    await KeyValue('Unassigned amendments').has({ value: 'LicenseAmendmentList' });
  });
});
