import { render } from '@folio/jest-config-stripes/testing-library/react';

import CustomCoverageIcon from './CustomCoverageIcon';

describe('CustomCoverageIcon', () => {
  test('renders expected CustomCoverageIcon', () => {
    const { getByTestId } = render(<CustomCoverageIcon />);
    expect(getByTestId('customCoverageIcon')).toBeInTheDocument();
  });
});


