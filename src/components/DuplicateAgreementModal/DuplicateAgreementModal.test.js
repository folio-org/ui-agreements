
import { renderWithIntl } from '@folio/stripes-erm-testing';
import DuplicateAgreementModal from './DuplicateAgreementModal';

describe('DuplicateAgreementModal', () => {
  test('renders duplicate modal component', () => {
    const { getByText } = renderWithIntl(<DuplicateAgreementModal />);
    expect(getByText('DuplicateModal')).toBeInTheDocument();
  });
});

