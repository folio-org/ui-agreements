import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/helpers';
import MonographResourceInfo from './MonographResourceInfo';
import { monographTitle } from './testResources';

describe('MonographResourceInfo', () => {
  describe('with title resource', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <MonographResourceInfo
            titleInstance={monographTitle.pti.titleInstance}
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

    test('renders the expected firstAuthor', async () => {
      await KeyValue('First author').has({ value: 'Jane' });
    });

    test('renders the expected firstEditor', async () => {
      await KeyValue('First editor').has({ value: 'Doe' });
    });

    test('renders the expected publicationDate', async () => {
      await KeyValue('Publication date').has({ value: '9/14/2017' });
    });

    test('renders the expected edition', async () => {
      await KeyValue('Edition').has({ value: '1. ed.' });
    });

    test('renders the expected volume', async () => {
      await KeyValue('Volume').has({ value: 'Vol. 1' });
    });

    test('renders the expected ISBN identifier', async () => {
      await KeyValue('ISBN').has({ value: '9781315185927' });
    });

    test('renders the expected DOI identifier', async () => {
      await KeyValue('DOI').has({ value: '10.4324/9781315185927' });
    });
  });
});
