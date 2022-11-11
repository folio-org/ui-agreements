
import { renderWithIntl } from '@folio/stripes-erm-testing';
import DuplicateAgreementModal from './DuplicateAgreementModal';

describe('DuplicateAgreementModal', () => {
  test('renders expected duplicate agreement modal', () => {
    const { getByTestId } = renderWithIntl(<DuplicateAgreementModal />);
    expect(getByTestId('duplicateModal')).toBeInTheDocument();
  });
});

