

import { HTML, including } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import EResourceIdentifier from './EResourceIdentifier';

const titleInstanceWithIdentifier = {
  'id':'e77aa4d1-3f93-4996-ae1e-878612bf2556',
  'subType':{
    'id':'2c9180b476aa415c0176aa41b056001c',
    'value':'electronic',
    'label':'Electronic'
  },
  'dateCreated':'2020-12-28T17:30:51Z',
  'tags':[

  ],
  'lastUpdated':'2020-12-28T17:30:51Z',
  'publicationType':{
    'id':'2c9180b476aa415c0176aa5c6c090049',
    'value':'book',
    'label':'Book'
  },
  'identifiers':[
    {
      'title':{
        'id':'e77aa4d1-3f93-4996-ae1e-878612bf2556'
      },
      'status':{
        'id':'2c9180b476aa415c0176aa41cda80047',
        'value':'approved',
        'label':'approved'
      },
      'identifier':{
        'value':'9781845425678',
        'ns':{
          'value':'isbn'
        }
      }
    },
    {
      'title':{
        'id':'e77aa4d1-3f93-4996-ae1e-878612bf2556'
      },
      'status':{
        'id':'2c9180b476aa415c0176aa41cda80047',
        'value':'approved',
        'label':'approved'
      },
      'identifier':{
        'value':'9781845425679',
        'ns':{
          'value':'isbn'
        }
      }
    }
  ],
  'coverage':[

  ],
  'name':'"Institutions, industrial upgrading, and economic performance in Japan: the ""flying-geese"" paradigm of catch-up growth"',
  'type':{
    'id':'2c9180b476aa415c0176aa41b05d001e',
    'value':'monograph',
    'label':'Monograph'
  },
  'suppressFromDiscovery':false,
  'work':{
    'id':'800989f7-da3f-4f27-81d9-dda8f27373f5'
  },
  'class':'org.olf.kb.TitleInstance',
  'longName':'"Institutions, industrial upgrading, and economic performance in Japan: the ""flying-geese"" paradigm of catch-up growth"',
  'relatedTitles':[

  ]
};

const titleInstanceWithoutIdentifier = {
  'id':'e77aa4d1-3f93-4996-ae1e-878612bf2556',
  'subType':{
    'id':'2c9180b476aa415c0176aa41b056001c',
    'value':'electronic',
    'label':'Electronic'
  },
  'dateCreated':'2020-12-28T17:30:51Z',
  'tags':[

  ],
  'lastUpdated':'2020-12-28T17:30:51Z',
  'publicationType':{
    'id':'2c9180b476aa415c0176aa5c6c090049',
    'value':'book',
    'label':'Book'
  },
  'identifiers':[],
  'coverage':[

  ],
  'name':'"Institutions, industrial upgrading, and economic performance in Japan: the ""flying-geese"" paradigm of catch-up growth"',
  'type':{
    'id':'2c9180b476aa415c0176aa41b05d001e',
    'value':'monograph',
    'label':'Monograph'
  },
  'suppressFromDiscovery':false,
  'work':{
    'id':'800989f7-da3f-4f27-81d9-dda8f27373f5'
  },
  'class':'org.olf.kb.TitleInstance',
  'longName':'"Institutions, industrial upgrading, and economic performance in Japan: the ""flying-geese"" paradigm of catch-up growth"',
  'relatedTitles':[

  ]
};

describe('EResourceIdentifier', () => {
  describe('renders expected identifiers for Title with identifiers', () => {
    renderWithIntl(
      <EResourceIdentifier
        titleInstance={titleInstanceWithIdentifier}
        type="isbn"
      />
    );

    /* the following is a workaround
       if PR https://issues.folio.org/browse/STCOM-1040 is fixed
       write new test(s) with the List and ListItem interactor
       (https://github.com/folio-org/stripes-testing/blob/master/doc/interactors.md#list)
    */

    test('renders the identifier as a List ', async () => {
      await HTML({ className: including('list') }).exists();
    });
  });

  test('renders null for Title with no identifier ', () => {
    const { container } = renderWithIntl(
      <EResourceIdentifier
        titleInstance={titleInstanceWithoutIdentifier}
        type="isbn"
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
