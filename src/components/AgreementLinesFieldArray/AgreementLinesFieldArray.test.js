import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { FieldArray } from 'react-final-form-arrays';
import AgreementLinesFieldArray from './AgreementLinesFieldArray';

import translationsProperties from '../../../test/helpers';

jest.mock('../IfEResourcesEnabled', () => () => <div>IfEResourcesEnabled</div>);
jest.mock('./AgreementLineField', () => () => <div>AgreementLineField</div>);

const onSubmit = jest.fn();

const data = {
  'agreementLines': [{
    'id': 'd97db008-c00e-442d-9aca-e58f2f25486e',
    'activeTo': '2021-09-30',
    'tags': '[]',
    'owner': '{agreementStatus: {…}, alternateNames: Array(0), ca…}',
    'resource': '{_object: {…}, class: "org.olf.kb.PackageContentIte…}',
    'activeFrom': '2021-09-01',
    'poLines': '[]',
    'suppressFromDiscovery': false,
    'note': 'note',
    'customCoverage': false,
    'explanation': 'Agreement includes this item from a package specifically',
    'startDate': '2021-09-01',
    'endDate': '2021-09-30',
    'contentUpdated': null,
    'haveAccess': true
  }],
  'agreementLinesToAdd': '[]',
  'agreementStatusValues': '[{…}, {…}, {…}, {…}, {…}]',
  'reasonForClosureValues': '[{…}, {…}, {…}, {…}]',
  'amendmentStatusValues': '[{…}, {…}, {…}, {…}]',
  'basket': [{
    'class': 'org.olf.kb.PackageContentItem',
    'id': 'c4a72ccf-8be1-453a-9147-ab77d078bb56',
    'name': "'200 Years of Ricardian Trade Theory' on Platform 'SpringerLink' in Package Springer eBooks: Economics and Finance 2017",
    '_object': '{addedTimestamp: 1632275874997, class: "org.olf.kb.…}'
  }],
  'contactRoleValues': '[{…}, {…}, {…}, {…}]',
  'documentCategories': '[{…}, {…}, {…}]',
  'externalAgreementLine': '[]',
  'isPerpetualValues': '[{…}, {…}]',
  'licenseLinkStatusValues': '[{…}, {…}, {…}]',
  'orderLines': '[]',
  'orgRoleValues': '[{…}]',
  'renewalPriorityValues': '[{…}, {…}, {…}]',
  'supplementaryProperties': '[]',
  'users': '[]'
};

const items = [{
  'id': 'd97db008-c00e-442d-9aca-e58f2f25486e',
  'poLines': [],
  'activeFrom': '2021-09-01',
  'activeTo': '2021-09-30',
  'note': 'note'
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
            name="items"
          />
        </TestForm>, translationsProperties
      );
    });

    it('renders empty field', () => {
      const { queryAllByTestId } = renderComponent;
      expect(queryAllByTestId(/greementLinesFieldArray\[.*\]/).length).toEqual(0);
    });
  });

  describe('with initial values set', () => {
    let renderComponent;
    beforeEach(async () => {
      renderComponent = renderWithIntl(
        <TestForm
          initialValues={{ items }}
          onSubmit={onSubmit}
        >
          <FieldArray
            component={AgreementLinesFieldArray}
            data={data}
            items={items}
            name="items"
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the IfEResourcesEnabled component', () => {
        const { getByText } = renderComponent;
        expect(getByText('IfEResourcesEnabled')).toBeInTheDocument();
      });

    test('renders the AgreementLineField component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLineField')).toBeInTheDocument();
    });
  });
});
