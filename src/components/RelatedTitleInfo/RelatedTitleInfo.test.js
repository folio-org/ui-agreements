
import { KeyValue } from '@folio/stripes-testing';
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import RelatedTitleInfo from './RelatedTitleInfo';
import { relatedMonographTitle, relatedSerialTitle } from './testResources';

let renderComponent;
describe('RelatedTitleInfo', () => {
  describe('with monograph resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <RelatedTitleInfo
            relatedTitle={relatedMonographTitle}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected headline', () => {
      const { getByText } = renderComponent;
      expect(getByText('Related title "200 Years of Ricardian Trade Theory"')).toBeInTheDocument();
    });

    test('renders the expected materialType', async () => {
      await KeyValue('Material type').has({ value: 'Electronic' });
    });

    test('renders the expected ISBN identifier', async () => {
      await KeyValue('ISBN').has({ value: '978-3-319-60605-7' });
    });

    test('renders the expected DOI identifier', async () => {
      await KeyValue('DOI').has({ value: '10.1007/978-3-319-60606-4' });
    });
  });

  describe('with serial resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <RelatedTitleInfo
            relatedTitle={relatedSerialTitle}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected headline', () => {
      const { getByText } = renderComponent;
      expect(getByText('Related title "19th century music"')).toBeInTheDocument();
    });

    test('renders the expected materialType', async () => {
      await KeyValue('Material type').has({ value: 'Print' });
    });

    test('renders the expected ISSN identifier', async () => {
      await KeyValue('ISSN').has({ value: '0148-2076' });
    });
  });
});
