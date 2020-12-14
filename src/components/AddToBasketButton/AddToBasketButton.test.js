import React from 'react';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import userEvent from '@testing-library/user-event';
import AddToBasketButton from './AddToBasketButton';

const handleReplace = jest.fn(val => val); // Mock function that tests the addToBasket and removeFromBasket callbacks

const item = {
  'id':'a3316b0f-ddb1-47e1-bb0a-7b386639660b',
  'class':'org.olf.kb.Pkg',
  'name':'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
  'suppressFromDiscovery':false,
  'tags':'[]',
  'customCoverage':false,
  '_object':'{class: "org.olf.kb.Pkg", coverage: Array(0), dateC…}',
  'rowIndex':0,
};

const AddToBasketButtonProps = {
  'addButtonTooltipText':'Add button tooltip',
  'addLabel':'Add button',
  'buttonProps':{
    'data-test-add-package-to-basket':true,
    'data-testid': 'addtobasketbutton',
  },
  item,
  'mutator': {
    basket: {
      replace: (val) => handleReplace(val)
    }
  },
  'removeButtonTooltipText':'Remove button tooltip',
  'removeLabel':'Remove button',
  'resources': { basket: [] },
};

const AddToBasketButtonPropsWithItem = {
  'addButtonTooltipText':'Add button tooltip',
  'addLabel':'Add button',
  'buttonProps':{
    'data-test-add-package-to-basket':true,
    'data-testid': 'addtobasketbutton',
  },
  item,
  'mutator': {
    basket: {
      replace: (val) => handleReplace(val)
    }
  },
  'removeButtonTooltipText':'Remove button tooltip',
  'removeLabel':'Remove button',
  'resources': { basket: [item] },
};

test('renders add To Basket button', () => {
  const { getByTestId } = render(
    <AddToBasketButton
      {...AddToBasketButtonProps}
    />
  );
  expect(getByTestId('addtobasketbutton')).toBeInTheDocument();
});

test('renders remove button label', () => {
  const { getByText } = render(
    <AddToBasketButton
      {...AddToBasketButtonPropsWithItem}
    />
  );
  expect(getByText('Remove button'));
});


test('clicking the add button invokes the callback with expected value', () => {
  const { getByTestId } = render(
    <AddToBasketButton
      {...AddToBasketButtonProps}
    />
  );

  userEvent.click(getByTestId('addtobasketbutton'));
  expect(handleReplace.mock.calls.length).toBe(1);
  handleReplace.mockClear();
});

test('clicking the remove button invokes the callback with expected value', () => {
  const { getByTestId } = render(
    <AddToBasketButton
      {...AddToBasketButtonPropsWithItem}
    />
  );

  userEvent.click(getByTestId('addtobasketbutton'));
  expect(handleReplace.mock.calls.length).toBe(1);
  handleReplace.mockClear();
});
