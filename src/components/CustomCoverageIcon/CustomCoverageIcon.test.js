import React from 'react';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-testing/jest/directMocks';
import CustomCoverageIcon from './CustomCoverageIcon';

describe('CustomCoverageIcon', () => {
  test('renders expected CustomCoverageIcon', () => {
    const { getByTestId } = render(<CustomCoverageIcon />);
    expect(getByTestId('customCoverageIcon')).toBeInTheDocument();
  });
});


