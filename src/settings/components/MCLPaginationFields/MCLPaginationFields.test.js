import React from 'react';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import MCLPaginationFields from './MCLPaginationFields';

const onSubmit = jest.fn();
// const mclList = ['agreementLines', 'agreementEresources', 'entitlementOptions', 'packageContents', 'entitlements'];
const mclLabels = ['Agreement lines', ' E-resources covered by this agreement', 'Options for acquiring e-resource', 'E-resources in package', 'Agreements for this e-resource'];


describe('MCLPaginationFields', () => {
  test('renders mcl labels', () => {
    const { getByLabelText } = render(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>

    );
    // expect(getByLabelText(/agreement lines/i).toBeInTheDocument());
    mclLabels.forEach((label) => {
      expect(getByLabelText(new RegExp(label, 'i')).toBeInTheDocument());
    });
  });
});
