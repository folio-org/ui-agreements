
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl, KeyValue } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import ErrorCard from './ErrorCard';
import externalResourceWithError from './testResources';

let renderComponent;
describe('ErrorCard', () => {
  describe('with title resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <ErrorCard
            resource={externalResourceWithError}
          />
        </Router>,
        translationsProperties
      );
    });
    test('renders ErrorCard component', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('errorCard')).toBeInTheDocument();
    });

    test('renders card header with reference and authority', () => {
      const { getByText } = renderComponent;
      expect(getByText('22-1887786-11234147a - EKB-TITLE')).toBeInTheDocument();
    });

    test('renders the expected error number', async () => {
      await KeyValue('Error').has({ value: '400' });
    });

    test('renders the expected error message', async () => {
      await KeyValue('Message').has({ value: 'Bad Request' });
    });
  });
});
