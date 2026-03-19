
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import MonographResourceInfo from './MonographResourceInfo';
import { tis } from '../../../test/jest/eresources';

const monographTitle = tis.find(ti => ti.id === '08eee460-758b-4339-960f-f16c4b8fe446');

describe('MonographResourceInfo', () => {
  describe('with title resource', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <MonographResourceInfo
            titleInstance={monographTitle}
          />
        </Router>,
        translationsProperties
      );
    });
    ///
    test('renders the expected publicationType', async () => {
      await KeyValue('Publication type').has({ value: 'Book' });
    });

    test('renders the expected materialType', async () => {
      await KeyValue('Material type').has({ value: 'Electronic' });
    });

    test('renders the expected workIdentifier', async () => {
      await KeyValue('Work identifier').has({ value: '43111' });
    });

    test('renders the expected workIdentifier', async () => {
      await KeyValue('Work identifier type').has({ value: 'projectgutenberg' });
    });

    test('renders the expected firstAuthor', async () => {
      await KeyValue('First author').has({ value: 'Ozawa' });
    });

    test('renders the expected firstEditor', async () => {
      await KeyValue('First editor').has({ value: 'Doe' });
    });

    test('renders the expected edition', async () => {
      await KeyValue('Edition').has({ value: '1. ed.' });
    });

    test('renders the expected volume', async () => {
      await KeyValue('Volume').has({ value: 'Vol. 1' });
    });

    test('renders the expected publicationDate', async () => {
      await KeyValue('Publication date').has({ value: '1/1/2005' });
    });

    test('renders the expected ISBN identifier', async () => {
      await KeyValue('ISBN').has({ value: '9781845425678' });
    });

    test('renders the expected DOI identifier', async () => {
      await KeyValue('DOI').has({ value: '10.4324/9781315185927' });
    });
  });
});
