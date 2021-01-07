import React from 'react';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import DiscoverySettings from './DiscoverySettings';

describe('CustomCoverageIcon', () => {
  test('renders expected CustomCoverageIcon', () => {
    const { getByTestId } = render(<DiscoverySettings />);
    expect(getByTestId('customCoverageIcon')).toBeInTheDocument();
  });
});


