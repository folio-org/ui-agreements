import React from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, renderWithIntl, TestForm, IconButton } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import ContentTypesFieldArray from './ContentTypesFieldArray';

const onSubmit = jest.fn();

let renderComponent;
describe('ContentTypesFieldArray', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm
        onSubmit={onSubmit}
      >
        <FieldArray
          component={ContentTypesFieldArray}
          name="agreementContentTypes"
        />
      </TestForm>, translationsProperties
    );
  });

  it('renders headline', () => {
    const { getByText } = renderComponent;
    expect(getByText('Content type')).toBeInTheDocument();
  });

  test('renders the Add content type button', async () => {
    await Button('Add content type').exists();
  });

  it('adding/removing fields using the add/remove works as expected', async () => {
    const { queryAllByTestId } = renderComponent;
    const addButton = Button('Add content type');

    await addButton.exists();
    await waitFor(async () => {
      await addButton.click();
    });

    expect(queryAllByTestId(/contentTypesFieldArray\[.*\]/i).length).toEqual(1);
    await waitFor(async () => {
      await IconButton('remove-content-types[0]-undefined').click();
    });

    expect(queryAllByTestId(/contentTypesFieldArray\[.*\]/i).length).toEqual(0);
  });
});
