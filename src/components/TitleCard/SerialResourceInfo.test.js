
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import SerialResourceInfo from './SerialResourceInfo';
import { tis } from '../../../test/jest/eresources';

const serialTitle = tis.find(ti => ti.id === '38138ae2-9dd9-412a-a0eb-e8890c9d1274');

describe('SerialResourceInfo', () => {
  describe('with title resource', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <SerialResourceInfo
            titleInstance={serialTitle}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected publicationType', async () => {
      await KeyValue('Publication type').has({ value: 'Journal' });
    });

    test('renders the expected materialType', async () => {
      await KeyValue('Material type').has({ value: 'Electronic' });
    });

    test('renders the expected workIdentifier', async () => {
      await KeyValue('Work identifier').has({ value: '00e46664-9d3b-458e-9fff-1f800fbb707e' });
    });

    test('renders the expected workIdentifier', async () => {
      await KeyValue('Work identifier type').has({ value: 'gokb' });
    });

    test('renders the expected EZB identifier', async () => {
      await KeyValue('EZB').has({ value: '65256' });
    });

    test('renders the expected ZDB identifier', async () => {
      await KeyValue('ZDB').has({ value: '2227388-8' });
    });

    test('renders the expected ISSN identifier', async () => {
      await KeyValue('ISSN').has({ value: '1758-6569' });
    });
  });
});
