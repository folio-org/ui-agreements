import React from 'react';
import { render, screen } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import MCLPaginationFields from './MCLPaginationFields';
import {
  translationsProperties,
} from '../../../test/helpers';

const onSubmit = jest.fn();
const mclLabels = ['Agreement lines', ' E-resources covered by this agreement', 'Options for acquiring e-resource', 'E-resources in package', 'Agreements for this e-resource'];
describe('MCLPaginationFields', () => {
  test('renders mcl labels', () => {
    const { getByText } = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <MCLPaginationFields />
      </TestForm>, translationsProperties
    );
    screen.debug();
    expect(getByText('/Pagination/i').toBeInTheDocument());
  });
});
