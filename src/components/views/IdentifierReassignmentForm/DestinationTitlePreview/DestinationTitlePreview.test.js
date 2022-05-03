import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { StaticRouter as Router } from 'react-router-dom';

import { KeyValue, Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../../test/helpers';
import DestinationTitlePreview from './DestinationTitlePreview';

jest.mock('react-final-form', () => ({
    ...jest.requireActual('react-final-form'),
    useFormContext: () => ({
        handleSubmit: () => jest.fn(),
        getValues: () => jest.fn(),
    }),
}));

const previewModal = false;

  const onSubmitMock = jest.fn();

  describe('DestinationTitlePreview', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmitMock}>
            <DestinationTitlePreview
              data={{}}
              previewModal={previewModal}
            />
          </TestForm>,
        </Router>,
        translationsProperties
      );
    });

    it('renders the DestinationTitlePreview card', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('destination-title-identifier-preview')).toBeInTheDocument();
    });

    it('renders expected values', async () => {
      await KeyValue('Material type').exists();
    });

    test('renders the expcected source', async () => {
      await KeyValue('Material type').has({ value: 'stripes-components.noValue.noValueSet-' });
    });

    test('renders the submit button', async () => {
      await Button('Submit').exists();
    });

    test('clicking the submit button ', async () => {
      await Button('Submit').click();
      expect(onSubmitMock.mock.calls.length).toBe(1);
    });
});
