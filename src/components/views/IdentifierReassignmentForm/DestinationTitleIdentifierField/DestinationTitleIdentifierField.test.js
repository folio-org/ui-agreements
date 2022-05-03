import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { StaticRouter as Router } from 'react-router-dom';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../../test/helpers';
import DestinationTitleIdentifierField from './DestinationTitleIdentifierField';

jest.mock('react-final-form', () => ({
    ...jest.requireActual('react-final-form'),
    useFormContext: () => ({
        handleSubmit: () => jest.fn(),
        getValues: () => jest.fn(),
    }),
}));

  const onSubmitMock = jest.fn();

  describe('DestinationTitleIdentifierField', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmitMock}>
            <DestinationTitleIdentifierField
              data={{}}
            />
          </TestForm>,
        </Router>,
        translationsProperties
      );
    });

    it('renders the DestinationTitleIdentifierField card', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('destinationTitleCard')).toBeInTheDocument();
    });

    test('renders the submit button', async () => {
      await Button('Submit').exists();
    });

    test('clicking the submit button ', async () => {
      await Button('Submit').click();
      expect(onSubmitMock.mock.calls.length).toBe(1);
    });
});
