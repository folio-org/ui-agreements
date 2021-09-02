
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import FormEresourceCard from './FormEresourceCard';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../PackageCardExternal', () => () => <div>PackageCardExternal</div>);
const onSubmit = jest.fn();

const data = {
  'component': 'ƒ FormEresourceCard() {}',
  'headerEnd': '<ForwardRef />',
};
  const resource = {
    'contentType': 'Aggregated Full Text',
    'customCoverage': {
      'beginCoverage': '',
      'endCoverage': ''
    },
    'isCustom': false,
    'isSelected': true,
    'name': 'i-law.com',
    'packageId': 3581,
    'packageType': 'Variable',
    'providerId': 936,
    'providerName': 'Informa Law & Finance',
    'selectedCount': 181,
    'titleCount': 181,
    'visibilityData': {
      'isHidden': false,
      'reason': ''
    },
    'id': '936-3581',
    'type': 'packages'
  };

let renderComponent;
describe('FormEresourceCard', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresourceCard data={data} resource={resource} />
        </TestForm>, translationsProperties
      );
    });

    test('renders the PackageCardExternal', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCardExternal')).toBeInTheDocument();
    });
});
