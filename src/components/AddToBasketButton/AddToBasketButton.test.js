import React from 'react';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';

import AddToBasketButton from './AddToBasketButton';

const AddToBasketButtonProps = {
  "addButtonTooltipText":"Add button tooltip",
  "addLabel":"Add button",
  "buttonProps":{
     "data-test-add-package-to-basket":true
  },
  "item":{
     "id":"a3316b0f-ddb1-47e1-bb0a-7b386639660b",
     "class":"org.olf.kb.Pkg",
     "name":"Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz",
     "suppressFromDiscovery":false,
     "tags":"[]",
     "customCoverage":false,
     "_object":"{class: \"org.olf.kb.Pkg\", coverage: Array(0), dateC…}",
     "rowIndex":0
  },
  "mutator": {
   basket: {
     replace: () => {},
   },
 },
  "removeButtonTooltipText":"Remove button tooltip",
  "removeLabel":"Remove button",
  "resources":{
     "basket":[]
  },
}

test("renders Add To Basket button", () => {
  const { getByText } = render(<AddToBasketButton {...AddToBasketButtonProps} />)
  expect(getByText('Add button')).toBeInTheDocument();
})
