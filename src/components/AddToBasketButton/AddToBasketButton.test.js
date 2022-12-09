import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router';
import AddToBasketButton from './AddToBasketButton';

import translationsProperties from '../../../test/helpers/translationsProperties';

const mockAddToBasket = jest.fn();
const mockRemoveFromBasket = jest.fn();


// EXAMPLE -- using an import as part of the inline mocking
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useBasket: () => {
    const { useState } = jest.requireActual('react');
    const [basketStore, setBasketStore] = useState({});
    mockAddToBasket.mockImplementation((item) => {
      setBasketStore({
        ...basketStore,
        [item.id]: item
      });
    });

    mockRemoveFromBasket.mockImplementation((item) => {
      const { [item.id]: _removeItem, ...newBasketStore } = basketStore;
      setBasketStore(newBasketStore);
    });

    return {
      basketStore,
      addToBasket: mockAddToBasket,
      removeFromBasket: mockRemoveFromBasket
    };
  }
}));

const item = {
  id:'a3316b0f-ddb1-47e1-bb0a-7b386639660b',
  class:'org.olf.kb.Pkg',
  name:'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
  suppressFromDiscovery:false,
  tags:'[]',
  customCoverage:false,
  _object:'{class: "org.olf.kb.Pkg", coverage: Array(0), dateC…}',
  rowIndex:0,
};

const AddToBasketButtonProps = {
  addButtonTooltipText:'Add button tooltip',
  addLabel:'Add button',
  buttonProps:{
    'data-test-add-package-to-basket':true,
    'data-testid': 'addtobasketbutton',
  },
  item,
  removeButtonTooltipText:'Remove button tooltip',
  removeLabel:'Remove button',
};

let renderComponent;
describe('AddToBasketButton', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <AddToBasketButton
          {...AddToBasketButtonProps}
        />
      </MemoryRouter>, translationsProperties
    );
  });

  test('renders add To Basket button', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('addtobasketbutton')).toBeInTheDocument();
  });

  describe('clicking the add button', () => {
    beforeEach(async () => {
      await Button('Add button').click();
    });

    it('invokes the callback with expected value', async () => {
      expect(mockAddToBasket.mock.calls.length).toBe(1);
    });

    test('renders remove button label', () => {
      const { getByText } = renderComponent;
      expect(getByText('Remove button'));
    });

    test('clicking the remove button invokes the callback with expected value', async () => {
      await Button('Remove button').click();
      expect(mockRemoveFromBasket.mock.calls.length).toBe(1);
    });
  });
});
