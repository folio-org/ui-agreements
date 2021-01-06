import React from 'react';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import MCLPaginationFields from './MCLPaginationFields';

const onSubmit = jest.fn();
const mclList = ['agreementLines', 'agreementEresources', 'entitlementOptions', 'packageContents', 'entitlements'];

describe('MCLPaginationFields', () => {
  test('renders mcl labels', () => {
    const { getByTestId } = render(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>

    );

    mclList.forEach((mcl) => {
      expect(getByTestId(mcl)).toBeInTheDocument();
    });
  });

  test('type value and render', () => {
    const { getByTestId } = render(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>

    );

    mclList.forEach((mcl) => {
      userEvent.type(getByTestId(mcl), '15');
      expect(getByTestId(mcl)).toHaveValue(15);
    });
  });


});
