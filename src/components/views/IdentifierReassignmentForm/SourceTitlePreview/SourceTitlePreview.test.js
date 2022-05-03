import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue, Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../../test/helpers';
import SourceTitlePreview from './SourceTitlePreview';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useFormContext: () => ({
      handleSubmit: () => jest.fn(),
      getValues: () => jest.fn(),
  }),
}));

const onSubmitMock = jest.fn();
const previewModal = false;

describe('SourceTitlePreview', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <TestForm onSubmit={onSubmitMock}>
          <SourceTitlePreview
            data={{}}
            previewModal={previewModal}
          />
        </TestForm>,
      </Router>,
      translationsProperties
    );
  });

  it('renders the SourceTitlePreview card', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('source-title-identifier-preview')).toBeInTheDocument();
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
