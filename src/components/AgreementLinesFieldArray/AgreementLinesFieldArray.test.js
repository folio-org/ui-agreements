
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes-testing';
import { FieldArray } from 'react-final-form-arrays';
import AgreementLinesFieldArray from './AgreementLinesFieldArray';

import translationsProperties from '../../../test/helpers';

jest.mock('../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('./AgreementLineField', () => () => <div>AgreementLineField</div>);

const onSubmit = jest.fn();

const data = {
  'agreementLines': [{
    'id': '648f362b-9a71-4eb6-8fe8-9ed20dffb0dc',
    'dateCreated': '2021-09-23T13:13:43Z',
    'activeTo': '2021-09-04',
    'tags': '[]',
    'lastUpdated': '2021-09-23T13:13:43Z',
    'owner': {
      'id': 'af691ea8-4f2a-41f1-907c-1674e0377d90',
      'cancellationDeadline': '2021-09-28',
      'dateCreated': '2021-09-23T08:02:15Z',
      'isPerpetual': {
        'id': '2c91809c7c1054b5017c105cc2120031',
        'value': 'yes',
        'label': 'Yes'
      },
      'name': 'MR agr test',
      'orgs': [],
      'externalLicenseDocs': [],
      'outwardRelationships': [],
      'customProperties': {},
      'contacts': [],
      'tags': [],
      'lastUpdated': '2021-09-23T13:13:43Z',
      'inwardRelationships': [],
      'renewalPriority': {
        'id': '2c91809c7c1054b5017c105cc2380039',
        'value': 'for_review',
        'label': 'For review'
      },
      'endDate': '2021-09-30',
      'startDate': '2021-09-01',
      'linkedLicenses': [],
      'docs': [],
      'periods': [
        '{cancellationDeadline: "2021-09-28", endDate: "2021…}'
      ],
      'usageDataProviders': [],
      'agreementStatus': {
        'id': '2c91809c7c1054b5017c105cc27f0041',
        'value': 'active',
        'label': 'Active'
      },
      'supplementaryDocs': [],
      'description': 'This is description',
      'items': [
        '{id: "9e46275f-2b11-4235-963e-a63ee04b4241"}',
        '{id: "648f362b-9a71-4eb6-8fe8-9ed20dffb0dc"}'
      ],
      'alternateNames': []
    },
    'resource': {
      'id': 'fe84a421-ab24-4fd0-8a98-b65664ec0126',
      'class': 'org.olf.kb.Pkg',
      'name': 'Brill Test',
      'suppressFromDiscovery': false,
      'tags': [],
      'customCoverage': false,
      '_object': {
        'id': 'fe84a421-ab24-4fd0-8a98-b65664ec0126',
        'dateCreated': '2021-09-23T02:37:26Z',
        'tags': '[]',
        'lastUpdated': '2021-09-23T02:37:26Z',
        'vendor': '{id: "a71f4c10-e238-4d07-8ce1-1a69ae00570b", name: …}',
        'coverage': '[]',
        'source': 'GOKb',
        'remoteKb': '{activationEnabled: false, active: true, cursor: "2…}',
        'name': 'Brill Test',
        'suppressFromDiscovery': false,
        'reference': 'Brill_Test_2',
        'resourceCount': 0,
        'class': 'org.olf.kb.Pkg'
      }
    },
    'activeFrom': '2021-09-01',
    'poLines': [{
      'id': 'e5b1cf47-2548-4913-819a-681720ea9206',
      'poLineId': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
      'owner': '{id: "648f362b-9a71-4eb6-8fe8-9ed20dffb0dc"}'
    }],
    'suppressFromDiscovery': false,
    'note': 'Agreement line note',
    'customCoverage': false,
    'explanation': 'Agreement includes a package containing this item',
    'startDate': '2021-09-01',
    'endDate': '2021-09-04',
    'contentUpdated': null,
    'haveAccess': false
  },
  {
    'id': '9e46275f-2b11-4235-963e-a63ee04b4241',
    'type': 'external',
    'description': 'agreement line description',
    'authority': 'EKB-PACKAGE',
    'reference': '936-3581',
    'explanation': null,
    'startDate': '2021-09-01',
    'endDate': '2021-09-30',
    'activeFrom': '2021-09-01',
    'activeTo': '2021-09-30',
    'contentUpdated': null,
    'haveAccess': true,
    'suppressFromDiscovery': true,
    'note': 'agreement line note',
    'owner': '{agreementStatus: {…}, alternateNames: Array(0), ca…}',
    'poLines': [{
      'id': '971c9ba0-1cca-4238-978e-4d719af3ccff',
      'poLineId': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
      'owner': '{id: "9e46275f-2b11-4235-963e-a63ee04b4241"}'
    }],
    'customCoverage': false,
    'reference_object': {
      'label': 'i-law.com',
      'type': 'Package',
      'provider': 'Informa Law & Finance',
      'titleCount': 181,
      'selectedCount': 181,
      'contentType': 'Aggregated Full Text',
      'providerName': 'Informa Law & Finance',
      'isSelected': true
    }
  }
  ],
  'orderLines': [{
    'id': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
    'edition': 'First edition',
    'checkinItems': false,
    'agreementId': '09c6ed1b-3984-4d9a-8f9b-e1200b68b61c',
    'acquisitionMethod': 'Purchase',
    'alerts': '[]',
    'cancellationRestriction': false,
    'cancellationRestrictionNote': '',
    'claims': '[{…}]',
    'collection': false,
    'contributors': '[]',
    'cost': '{additionalCost: 0, currency: "USD", discount: 0, d…}',
    'description': '',
    'details': '{productIds: Array(1), receivingNote: "", subscript…}',
    'donor': '',
    'fundDistribution': '[{…}]',
    'isPackage': false,
    'locations': '[{…}]',
    'orderFormat': 'Other',
    'paymentStatus': 'Pending',
    'physical': '{materialSupplier: "e0fb5df2-cdf1-11e8-a8d5-f2801f1…}',
    'poLineDescription': '',
    'poLineNumber': '81-1',
    'publicationDate': '1915',
    'publisher': 'American Bar Association',
    'purchaseOrderId': 'c27e60f9-6361-44c1-976e-0c4821a33a7d',
    'receiptStatus': 'Pending',
    'reportingCodes': '[]',
    'requester': '',
    'rush': false,
    'selector': '',
    'source': 'User',
    'tags': '{tagList: Array(1)}',
    'titleOrPackage': 'ABA Journal',
    'vendorDetail': '{instructions: "", noteFromVendor: "", referenceNum…}',
    'metadata': '{createdDate: "2021-09-23T01:53:26.249+00:00", upda…}'
  }],
};

const agreementLines = [{
  'id': '65493666-6a40-4f4e-8737-d6d88d2c0429',
  'coverage': [{
    'id': '81237316-a1f8-4406-8cac-a6eb23b24839',
    'startDate': '2021-09-01',
    'endDate': '2021-09-20',
    'startVolume': '1',
    'startIssue': '6',
    'endVolume': '6',
    'endIssue': '12',
    'summary': 'v1/i6/2021-09-01 - v6/i12/2021-09-20'
  }],
  'poLines': [{
    'id': 'fd6428ff-e727-40d2-a9c2-fd747fb9a9f3',
    'poLineId': 'baec48dd-1594-2712-be8f-de336bc83fcc',
    'owner': {
      'id': '65493666-6a40-4f4e-8737-d6d88d2c0429'
    }
  }],
  'activeFrom': '2021-09-01',
  'activeTo': '2021-09-30',
  'note': 'agreement line note'
}];

describe('AgreementLinesFieldArray', () => {
  describe('with empty initial values', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{}}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={AgreementLinesFieldArray}
            data={{}}
            name="agreementLines"
          />
        </TestForm>, translationsProperties
      );
    });

    test('renders the add agreement line button', async () => {
      await Button('Add agreement line').exists();
    });

    it('renders empty field message', () => {
      const { getByText } = renderComponent;
      expect(getByText('No agreement lines for this agreement')).toBeInTheDocument();
    });

    it('renders empty field', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/agreementLinesFieldArray\[.*\]/).length).toEqual(0);
    });

    it('adding/removing fields using the add/remove works as expected', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: /Add agreement line/i })).toBeInTheDocument();
    });
  });

  describe('with initial values set', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{ agreementLines }}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={AgreementLinesFieldArray}
            data={data}
            items={agreementLines}
            name="agreementLines"
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the submit button', async () => {
      await Button('Submit').exists();
    });

    test('renders the AgreementLineField component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLineField')).toBeInTheDocument();
    });
  });
});
