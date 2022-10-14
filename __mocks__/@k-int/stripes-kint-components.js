import { useState } from 'react';

/* If we need different mock behaviour in a given test we can use unmock like:

  jest.unmock('@k-int/stripes-kint-components');
  jest.mock('@k-int/stripes-kint-components', () => ({
    CustomPropertiesFilter: () => (<div>SOMETHING ELSE</div>)
  }));

  at the top of the file. Currently struggling to import a file both here
  and where unmocking for consistency, might require a 3rd repository which is NEVER mocked,
  but unsure
*/
module.exports = {
  ...jest.requireActual('@k-int/stripes-kint-components'),
  useRefdata: jest.fn().mockReturnValue([]),
  useQIndex: jest.fn(() => {
    return useState();
  }),
  useCustomProperties: jest.fn(({
    returnQueryObject = false
  }) => {
    let returnShape = [];
    if (returnQueryObject) {
      returnShape = {};
    }

    return ({ data: returnShape, isLoading: false });
  }),
  CustomPropertiesEdit: () => <div>CustomPropertiesEdit</div>,
  CustomPropertiesFilter: () => <div>CustomPropertiesFilter</div>,
  CustomPropertyCard: () => <div>CustomPropertyCard</div>,
  CustomPropertiesView: () => <div>CustomPropertiesView</div>,
  useIntlKey: () => 'ui-agreements',
};
