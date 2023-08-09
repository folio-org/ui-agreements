import { StaticRouter as Router } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { renderWithIntl, TestForm, Button } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../../test/helpers';
import SourceTitleIdentifierField from './SourceTitleIdentifierField';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useFormContext: () => ({
    handleSubmit: () => jest.fn(),
    getValues: () => jest.fn(),
  }),
}));

const onSubmitMock = jest.fn();

describe('SourceTitleIdentifierField', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <TestForm onSubmit={onSubmitMock}>
          <SourceTitleIdentifierField
            data={{}}
          />
        </TestForm>,
      </Router>,
      translationsProperties
    );
  });

  it('renders the sourceTitleIdentifierCard card', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('sourceTitleCard')).toBeInTheDocument();
  });

  test('renders the Title text', () => {
    const { getByText } = renderComponent;
    expect(getByText('Title')).toBeInTheDocument();
  });

  test('renders the expected text when no title is selected', () => {
    const { getByText } = renderComponent;
    expect(getByText('No source title selected')).toBeInTheDocument();
  });

  test('renders the expected text to select source title', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select the source title for the identifier(s)')).toBeInTheDocument();
  });

  test('renders the submit button', async () => {
    await Button('Submit').exists();
  });

  test('clicking the submit button ', async () => {
    await waitFor(async () => {
      await Button('Submit').click();
    });
    expect(onSubmitMock.mock.calls.length).toBe(1);
  });
});
