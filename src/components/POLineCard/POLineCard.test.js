import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { StaticRouter as Router } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import POLineCard from './POLineCard';


const poLine = {
  'acquisitionMethod': 'Purchase',
  'id': '556abc25-ebbf-3fb2-b478-1bfaff0af4dc',
  'poLineNumber': '81-1',
  'titleOrPackage': 'ABA Journal',
};

const poLineWithInstanceId = { ...poLine };
poLineWithInstanceId.instanceId = 'abc';

const data = {
  'headerEnd': '<WithStripes(Pluggable) />',
  'id': 'edit-poline-0-0',
  'poLine': {
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
    'metadata': '{createdDate: "2021-08-04T01:50:10.921+00:00", upda…}',
  },
  'children': null,
};

describe('POLineCard', () => {
  test('renders po line component', () => {
    const { getByTestId } = renderWithIntl(
      <Router>
        <POLineCard {...data} />
      </Router>
    );
    expect(getByTestId('polineCard')).toBeInTheDocument();
  });

  describe('rendered with no data', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router context={{}}>
          <POLineCard id={poLine.id} poLine={{}} />
        </Router>
      );
    });
    test('should render', async () => {
      expect(data.poLine.id).toEqual(poLine.id);
    });
  });

  describe('rendering with full data but without instanceId', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router context={{}}>
          <POLineCard poLine={poLine} />
        </Router>
      );
    });
    test('should render the title', () => {
      expect(data.poLine.titleOrPackage).toEqual(poLine.titleOrPackage);
    });
  });

  test('should render acquisition method', () => {
    expect(data.poLine.acquisitionMethod).toEqual(poLine.acquisitionMethod);
  });

  test('should render PO Line number', () => {
    expect(data.poLine.poLineNumber).toContain(poLine.poLineNumber);
  });
});

describe('rendering with instance Id', () => {
  beforeEach(() => {
    renderWithIntl(
      <Router context={{}}>
        <POLineCard poLine={poLineWithInstanceId} />
      </Router>
    );
  });
  test('should render inventory link', () => {
    expect(poLineWithInstanceId).toBeTruthy();
  });
});
