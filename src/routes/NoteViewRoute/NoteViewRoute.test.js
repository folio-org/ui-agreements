import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import NoteViewRoute from './NoteViewRoute';

const history = {
  'length': 10,
  'action': 'REPLACE',
  'location': {
    'pathname': '/erm/notes/5ef485ce-83ce-4930-b9e9-af8a7cc629eb',
    'state': {
      'entityName': 'MR agreement',
      'entityType': 'agreement',
      'entityId': '88de2bd2-110e-460d-9076-7a0ccf44631f',
      'referredRecordData': '{}'
    },
    'search': '',
    'hash': '',
    'key': '2u7wlc'
  },
  'createHref': () => {},
  'push': () => {},
  'replace': () => {},
  'go': () => {},
  'goBack': () => {},
  'goForward': () => {},
  'block': () => {},
  'listen': () => {}
};

const location = {
  'pathname': '/erm/notes/5ef485ce-83ce-4930-b9e9-af8a7cc629eb',
  'state': {
    'entityName': 'MR agreement',
    'entityType': 'agreement',
    'entityId': '88de2bd2-110e-460d-9076-7a0ccf44631f',
    'referredRecordData': {}
  },
  'search': '',
  'hash': '',
  'key': '2u7wlc'
};

const match = {
  'path': '/erm/notes/:id',
  'url': '/erm/notes/5ef485ce-83ce-4930-b9e9-af8a7cc629eb',
  'isExact': true,
  'params': {
    'id': '5ef485ce-83ce-4930-b9e9-af8a7cc629eb'
  }
};

describe('NoteViewRoute', () => {
  describe('renders the NoteViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <NoteViewRoute history={history} location={location} match={match} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the NoteViewPage component', () => {
      const { getByText } = renderComponent;
      expect(getByText('NoteViewPage')).toBeInTheDocument();
    });
  });
});
