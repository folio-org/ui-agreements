
import { StaticRouter as Router } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import OpenBasketButton from './OpenBasketButton';

import basket from './testResources';

import { useBasket } from '../../hooks';

const mockHistoryPush = jest.fn();

jest.unmock('react-router');
jest.mock('react-router-dom', () => {
  const { mockReactRouterDom } = jest.requireActual('@folio/stripes-erm-testing');
  return ({
    ...jest.requireActual('react-router-dom'),
    ...mockReactRouterDom,
    useHistory: () => ({ push: mockHistoryPush })
  });
});

// EXAMPLE -- mocking hook return differently in different tests
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useBasket: jest.fn()
}));

describe('OpenBasketButton', () => {
  describe('with item in basket', () => {
    beforeEach(() => {
      useBasket.mockImplementation(() => ({
        basket
      }));

      renderWithIntl(
        <Router>
          <OpenBasketButton />
        </Router>,
        translationsProperties
      );
    });

    test('renders the open basket button', async () => {
      await Button('View 1 item').exists();
    });

    // we check if the button is clicked it calls the queryUpdateMock(update) function to invoke the child callback (handleClick) defined in OpenBasketButton
    test('calls the open basket button', async () => {
      await waitFor(async () => {
        await Button('View 1 item').click();
      });

      await waitFor(async () => {
        expect(mockHistoryPush).toHaveBeenCalled();
      });
    });
  });

  describe('with empty basket', () => {
    beforeEach(() => {
      useBasket.mockImplementation(() => ({
        basket: []
      }));

      renderWithIntl(
        <Router>
          <OpenBasketButton />
        </Router>,
        translationsProperties
      );
    });

    test('renders the disabled button', async () => {
      await Button('View 0 items').has({ disabled: true });
    });
  });
});
