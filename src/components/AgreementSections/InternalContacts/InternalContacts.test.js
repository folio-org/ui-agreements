import { renderWithIntl, Accordion } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../../test/helpers';
import InternalContacts from './InternalContacts';
import agreement from './testResources';

let renderComponent;

describe('InternalContacts', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <InternalContacts
        agreement={agreement}
        id="internalContacts"
      />,
      translationsProperties
    );
  });

  test('renders the Internal contacts Accordion', async () => {
    await Accordion('Internal contacts').exists();
  });

  test('renders the InternalContactCard component', () => {
    const { getByText } = renderComponent;
    expect(getByText('InternalContactCard'));
  });
});
