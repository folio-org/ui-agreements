import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { PaneHeader, Button as ButtonInteractor } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';

import PCIForm from './PCIForm';
import { handlers, initialValues, form } from './testResources';

const onSubmitMock = jest.fn();

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  handleSaveKeyCommand: () => jest.fn()
}));

jest.mock('../../EResourceSections/PCIFormInfo', () => () => <div>PCIFormInfo</div>);
jest.mock('../../EResourceSections/PCIFormCoverage', () => () => <div>PCIFormCoverage</div>);

describe('PCIForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <PCIForm
          form={form}
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
    await ButtonInteractor('Collapse all').exists();
  });

  it('renders the expected PCIFormIPCIFormCoveragenfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('PCIFormCoverage')).toBeInTheDocument();
  });
});
