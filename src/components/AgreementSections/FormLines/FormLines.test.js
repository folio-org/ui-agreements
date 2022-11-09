import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import FormLines from './FormLines';
import translationsProperties from '../../../../test/helpers';

/* We mock the AgreementLinesFieldArray component here and test if that component renders as expected as a part of this test.
We neednt test out the  FormLines functionality in theses tests because we shouldnt be concerned with the
underlying implementation of the child component */

jest.mock('../../AgreementLinesFieldArray', () => () => <div>AgreementLinesFieldArray</div>);

const onSubmit = jest.fn();

const data = {
  'agreementLines': [
    {
      'id': '6f8cf302-9b57-4b0e-a02a-9803d35c00e4',
      'tags': [],
      'owner': {
        'id': '251d73f1-f8e3-465c-9653-19fc613116cd',
        'name': 'AM ag 1',
        'orgs': [],
        'externalLicenseDocs': [],
        'outwardRelationships': [],
        'customProperties': {},
        'contacts': [],
        'tags': [],
        'inwardRelationships': [],
        'startDate': '2021-07-31',
        'linkedLicenses': [],
        'docs': [],
        'periods': [
          {
            'id': '8584f59c-f223-4026-9c41-310804b1f739',
            'startDate': '2021-07-31',
            'owner': {
              'id': '251d73f1-f8e3-465c-9653-19fc613116cd'
            },
            'periodStatus': 'next'
          }
        ],
        'usageDataProviders': [],
        'agreementStatus': {
          'id': '2c91809c7af51530017af51bdd230041',
          'value': 'active',
          'label': 'Active'
        },
        'supplementaryDocs': [
          {
            'id': '1720c899-9a04-48ad-b117-230918e7a989',
            'dateCreated': '2021-07-30T18:09:43Z',
            'lastUpdated': '2021-07-30T18:30:34Z',
            'atType': {
              'id': '2c91809c7af51530017af51bdc12000c',
              'value': 'license',
              'label': 'License'
            },
            'url': 'http://www.test.com',
            'name': 'test'
          }
        ],
        'endDate': null,
        'cancellationDeadline': null,
        'items': [
          {
            'id': '6f8cf302-9b57-4b0e-a02a-9803d35c00e4'
          }
        ],
        'alternateNames': []
      },
      'resource': {
        'id': '7b6964cb-fcc5-46ee-8c4b-161c8eabc517',
        'class': 'org.olf.kb.Pkg',
        'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
        'suppressFromDiscovery': false,
        'tags': [],
        'customCoverage': false,
        '_object': {
          'id': '7b6964cb-fcc5-46ee-8c4b-161c8eabc517',
          'dateCreated': '2021-07-30T01:54:44Z',
          'tags': [],
          'lastUpdated': '2021-07-30T01:54:44Z',
          'vendor': {
            'id': '00f045d6-555c-40c6-b627-658df1be1555',
            'name': 'Edward Elgar'
          },
          'coverage': [],
          'source': 'GOKb',
          'remoteKb': {
            'id': '5311e878-9501-4d78-a2ac-d42919d73f9e',
            'cursor': '2021-07-27T11:22:13Z',
            'active': true,
            'trustedSourceTI': false,
            'activationEnabled': false,
            'readonly': false,
            'syncStatus': 'idle',
            'lastCheck': 1627667113717,
            'name': 'GOKb_TEST',
            'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
            'fullPrefix': 'gokb',
            'uri': 'https://gokbt.gbv.de/gokb/oai/index',
            'supportsHarvesting': true,
            'rectype': 1
          },
          'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
          'suppressFromDiscovery': false,
          'reference': 'Edward_Elgar:Edward_Elgar_E-Book_Archive_in_Business_&_Management,_Economics_and_Finance:Nationalliz',
          'resourceCount': 2540,
          'class': 'org.olf.kb.Pkg'
        }
      },
      'poLines': [],
      'suppressFromDiscovery': false,
      'customCoverage': false,
      'explanation': 'Agreement includes a package containing this item',
      'startDate': null,
      'endDate': null,
      'activeFrom': null,
      'activeTo': null,
      'contentUpdated': null,
      'haveAccess': true
    }
  ],
  'agreementLinesToAdd': [],
  'agreementStatusValues': [
    {
      'id': '84ecd80b566dbea1563a779b2a3af4a2',
      'value': 'closed',
      'label': 'Closed'
    },
    {
      'id': '2c91809c7af51530017af51bdd14003e',
      'value': 'draft',
      'label': 'Draft'
    },
    {
      'id': '2c91809c7af51530017af51bdd19003f',
      'value': 'requested',
      'label': 'Requested'
    },
    {
      'id': '2c91809c7af51530017af51bdd1d0040',
      'value': 'in_negotiation',
      'label': 'In negotiation'
    },
    {
      'id': '2c91809c7af51530017af51bdd230041',
      'value': 'active',
      'label': 'Active'
    }
  ],
  'reasonForClosureValues': [
    {
      'id': '00e2e3d675c11e3d5cefa3bfcb405121',
      'value': 'rejected',
      'label': 'Rejected'
    },
    {
      'id': '2c91809c7af51530017af51bdcfb003b',
      'value': 'cancelled',
      'label': 'Cancelled'
    },
    {
      'id': '2c91809c7af51530017af51bdd03003c',
      'value': 'ceased',
      'label': 'Ceased'
    },
    {
      'id': '2c91809c7af51530017af51bdd08003d',
      'value': 'superseded',
      'label': 'Superseded'
    }
  ],
  'amendmentStatusValues': [
    {
      'id': '2c91809c7af51530017af51bdc420016',
      'value': 'current',
      'label': 'Current'
    },
    {
      'id': '2c91809c7af51530017af51bdc470017',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c91809c7af51530017af51bdc4b0018',
      'value': 'historical',
      'label': 'Historical'
    },
    {
      'id': '2c91809c7af51530017af51bdc500019',
      'value': 'does_not_apply',
      'label': 'Does not apply'
    }
  ],
  'basket': [
    {
      'id': '7b6964cb-fcc5-46ee-8c4b-161c8eabc517',
      'class': 'org.olf.kb.Pkg',
      'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
      'suppressFromDiscovery': false,
      'tags': [],
      'customCoverage': false,
      '_object': {
        'id': '7b6964cb-fcc5-46ee-8c4b-161c8eabc517',
        'dateCreated': '2021-07-30T01:54:44Z',
        'tags': [],
        'lastUpdated': '2021-07-30T01:54:44Z',
        'vendor': {
          'id': '00f045d6-555c-40c6-b627-658df1be1555',
          'name': 'Edward Elgar',
          'orgsUuid_object': {
            'error': 400,
            'message': 'Bad Request'
          }
        },
        'coverage': [],
        'source': 'GOKb',
        'remoteKb': {
          'id': '5311e878-9501-4d78-a2ac-d42919d73f9e',
          'cursor': '2021-07-27T11:22:13Z',
          'active': true,
          'trustedSourceTI': false,
          'activationEnabled': false,
          'readonly': false,
          'syncStatus': 'idle',
          'lastCheck': 1627667113717,
          'name': 'GOKb_TEST',
          'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
          'fullPrefix': 'gokb',
          'uri': 'https://gokbt.gbv.de/gokb/oai/index',
          'supportsHarvesting': true,
          'rectype': 1
        },
        'name': 'Edward Elgar:Edward Elgar E-Book Archive in Business & Management, Economics and Finance:Nationallizenz',
        'suppressFromDiscovery': false,
        'reference': 'Edward_Elgar:Edward_Elgar_E-Book_Archive_in_Business_&_Management,_Economics_and_Finance:Nationalliz',
        'resourceCount': 2540,
        'class': 'org.olf.kb.Pkg'
      },
      'rowIndex': 1
    }
  ],
  'contactRoleValues': [
    {
      'id': '2c91809c7af51530017af51bdc970029',
      'value': 'agreement_owner',
      'label': 'Agreement owner'
    },
    {
      'id': '2c91809c7af51530017af51bdc9b002a',
      'value': 'authorized_signatory',
      'label': 'Authorized signatory'
    },
    {
      'id': '2c91809c7af51530017af51bdca0002b',
      'value': 'erm_librarian',
      'label': 'ERM librarian'
    },
    {
      'id': '2c91809c7af51530017af51bdca4002c',
      'value': 'subject_specialist',
      'label': 'Subject specialist'
    }
  ],
  'documentCategories': [
    {
      'id': '2c91809c7af51530017af51bdc12000c',
      'value': 'license',
      'label': 'License'
    },
    {
      'id': '2c91809c7af51530017af51bdc17000d',
      'value': 'misc',
      'label': 'Misc'
    },
    {
      'id': '2c91809c7af51530017af51bdc1c000e',
      'value': 'consortium_negotiation_document',
      'label': 'Consortium negotiation document'
    }
  ],
  'externalAgreementLine': [],
  'isPerpetualValues': [
    {
      'id': '2c91809c7af51530017af51bdcb60031',
      'value': 'yes',
      'label': 'Yes'
    },
    {
      'id': '2c91809c7af51530017af51bdcba0032',
      'value': 'no',
      'label': 'No'
    }
  ],
  'licenseLinkStatusValues': [
    {
      'id': '2c91809c7af51530017af51bdc58001b',
      'value': 'controlling',
      'label': 'Controlling'
    },
    {
      'id': '2c91809c7af51530017af51bdc5d001c',
      'value': 'future',
      'label': 'Future'
    },
    {
      'id': '2c91809c7af51530017af51bdc62001d',
      'value': 'historical',
      'label': 'Historical'
    }
  ],
  'orderLines': [],
  'orgRoleValues': [
    {
      'id': '2c91809c7af51530017af51bdc08000a',
      'value': 'content_provider',
      'label': 'Content provider'
    }
  ],
  'renewalPriorityValues': [
    {
      'id': '2c91809c7af51530017af51bdcd90038',
      'value': 'definitely_renew',
      'label': 'Definitely renew'
    },
    {
      'id': '2c91809c7af51530017af51bdcdd0039',
      'value': 'for_review',
      'label': 'For review'
    },
    {
      'id': '2c91809c7af51530017af51bdce2003a',
      'value': 'definitely_cancel',
      'label': 'Definitely cancel'
    }
  ],
  'supplementaryProperties': []
};

describe('FormLines', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <FormLines data={data} />
      </TestForm>, translationsProperties
    );
  });

  test('renders the Agreement lines accordion', async () => {
    await Accordion('Agreement lines').exists();
  });

  test('renders the AgreementLinesFieldArray component', () => {
    const { getByText } = renderComponent;
    expect(getByText('AgreementLinesFieldArray')).toBeInTheDocument();
  });
});
