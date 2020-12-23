import React from 'react';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import DuplicateAgreementModal from './DuplicateAgreementModal';

test('renders expected duplicate agreement modal', () => {
  const { getByTestId } = render(<DuplicateAgreementModal />);
  expect(getByTestId('duplicateModal')).toBeInTheDocument();
});

