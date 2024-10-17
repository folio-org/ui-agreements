import { renderWithIntl, PaneHeader, Button } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';

import PCIForm from './PCIForm';
import { handlers, initialValues } from './testResources';

const onSubmitMock = jest.fn();

jest.mock('../../EResourceSections/PCIFormInfo', () => () => <div>PCIFormInfo</div>);
jest.mock('../../EResourceSections/PCIFormCoverage', () => () => <div>PCIFormCoverage</div>);

describe('PCIForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <PCIForm
          handlers={handlers}
          initialValues={initialValues}
          onSubmit={onSubmitMock}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the expected Pane header', async () => {
    await PaneHeader('Edit \'"Institutions, industrial upgrading, and economic performance in Ja...\' on Platform \'Elgaronline\' in Package Edward Elgar:Edward Elgar E-Book Archive in Business & Management, ...').exists();
  });

  it('renders the expected PCIFormInfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PCIFormInfo')).toBeInTheDocument();
  });

  it('renders the expand/collapseAll Button', async () => {
    await Button('Collapse all').exists();
  });

  it('renders the expected PCIFormIPCIFormCoveragenfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PCIFormCoverage')).toBeInTheDocument();
  });
});
