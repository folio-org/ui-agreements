
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl, KeyValue } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import ErrorCard from './ErrorCard';

const error = { number: 400, message: 'Bad Request' };
const headerStart = '22-1887786-11234147a - EKB-TITLE';
const headerEnd = null;

let renderComponent;
describe('ErrorCard', () => {
  describe('resource error', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <ErrorCard
            error={error}
            headerEnd={headerEnd}
            headerStart={headerStart}
          />
        </Router>,
        translationsProperties
      );
    });
    test('renders ErrorCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('errorCard')).toBeInTheDocument();
    });

    test('renders correct card header', () => {
      const { getByText } = renderComponent;
      expect(getByText('22-1887786-11234147a - EKB-TITLE')).toBeInTheDocument();
    });

    test('renders the expected error number', async () => {
      await KeyValue('Error number').has({ value: '400' });
    });

    test('renders the expected error message', async () => {
      await KeyValue('Error message').has({ value: 'Bad Request' });
    });
  });
});
