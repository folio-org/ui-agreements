import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  Button,
  PaneHeader,
  renderWithIntl,
  Selection,
  SelectionList,
  SelectionOption,
} from '@folio/stripes-erm-testing';

import Basket from './Basket';

import { data, handlers } from './testResources';
import translationsProperties from '../../../../test/helpers';

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
    await waitFor(async () => {
      await Selection().open();
    });

    await SelectionList({ optionCount: 9 }).exists();
    await waitFor(async () => {
      await Selection().filterOptions('MR agreement test');
      await SelectionOption(/MR agreement test/i).click();
    });

    await waitFor(async () => {
      await Button('Add to selected agreement').exists();
      await Button('Add to selected agreement').click();
    }, {
      timeout: 2000 // repeatedly breaks on CI, attempting to extend timeout
    });
  });

  it('clicking the create agreement button', async () => {
    await waitFor(async () => {
      await Button('Create new agreement').exists();
      await Button('Create new agreement').click();
    });
  });
});
