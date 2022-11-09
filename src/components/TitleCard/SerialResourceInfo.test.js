import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import SerialResourceInfo from './SerialResourceInfo';
import { serialTitleWithRelatedTitles } from './testResources';

describe('SerialResourceInfo', () => {
  describe('with title resource', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <SerialResourceInfo
            titleInstance={serialTitleWithRelatedTitles.pti.titleInstance}
          />
        </Router>,
        translationsProperties
      );
    });
    ///
    test('renders the expected publicationType', async () => {
      await KeyValue('Publication type').has({ value: 'Journal' });
    });

    test('renders the expected materialType', async () => {
      await KeyValue('Material type').has({ value: 'Electronic' });
    });

    test('renders the expected EZB identifier', async () => {
      await KeyValue('EZB').has({ value: '38504' });
    });

    test('renders the expected ZDB identifier', async () => {
      await KeyValue('ZDB').has({ value: '2052442-0' });
    });

    test('renders the expected ISSN identifier', async () => {
      await KeyValue('ISSN').has({ value: '1533-8606' });
    });
  });
});
