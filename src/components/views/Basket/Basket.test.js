import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import { PaneHeader, Button, Selection, SelectionList as SelectListInteractor, SelectionOption as SelectionOptionInteractor } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import Basket from './Basket';
import { data, handlers } from './testResources';

jest.mock('../../BasketList', () => () => <div>BasketList</div>);

describe('Package', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Basket
          data={data}
          handlers={handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the expected Pane title', async () => {
    await PaneHeader('ERM basket').is({ visible: true });
  });

  it('renders the expected message banner text', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select one or more e-resources and add them to a new or existing agreement. An agreement line will be created for each e-resource that you select.')).toBeInTheDocument();
  });

  it('renders the BasketList component', () => {
    const { getByText } = renderComponent;
    expect(getByText('BasketList')).toBeInTheDocument();
  });

  it('renders the create new agreement button', async () => {
    await Button('Create new agreement').exists();
  });

  it('choosing an option and clicking the add to selected agreement button', async () => {
    await Selection({ id: 'select-agreement-for-basket' }).exists();
    await Selection().open();
    await SelectListInteractor({ optionCount: 9 }).exists();
    await Selection().filterOptions('MR agreement test');
    await SelectionOptionInteractor(/MR agreement test/i).click();
    await Button('Add to selected agreement').exists();
    await Button('Add to selected agreement').click();
    expect(handlers.onAddToExistingAgreement).toHaveBeenCalled();
  });

  it('clicking the create agreement button', async () => {
    await Button('Create new agreement').exists();
    await Button('Create new agreement').click();
    expect(handlers.onAddToNewAgreement).toHaveBeenCalled();
  });
});
