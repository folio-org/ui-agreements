import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { StaticRouter as Router } from 'react-router-dom';
import { Button } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import OpenBasketButton from './OpenBasketButton';
import resources from './testResources';

const queryUpdateMock = jest.fn();

const mutator = {
  basket: {},
  query: {
    update: queryUpdateMock
  },
};

const basketProps = {
  mutator,
  resources
};

const emptyBasketProps = {
  mutator,
  'resources': {
    'basket': [],
    'query': {
      'query': '',
      'sort': 'name'
    }
  }
};

describe('OpenBasketButton', () => {
  describe('with item in basket', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <OpenBasketButton
            {...basketProps}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the open basket button', async () => {
      await Button('View 1 item').exists();
    });

    // we check if the button is clicked it calls the queryUpdateMock(update) function to invoke the child callback (handleClick) defined in OpenBasketButton
    test('calls the open basket button', async () => {
      await Button('View 1 item').click();
      expect(queryUpdateMock).toHaveBeenCalled();
    });
  });

  describe('with empty basket', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <OpenBasketButton
            {...emptyBasketProps}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the disabled button', async () => {
      await Button('View 0 items').has({ disabled: true });
    });
  });
});
