
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import FormEresourceCard from './FormEresourceCard';
import { packagesResource, resource, initialValuesData, line, handlers, initialValues } from './testResources';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../PackageCardExternal', () => () => <div>PackageCardExternal</div>);
jest.mock('../../PackageCard', () => () => <div>PackageCard</div>);

const isSuppressFromDiscoveryEnabled = jest.fn().mockImplementation(res => res);
const onSubmit = jest.fn();

describe('FormEresourceCard', () => {
  let renderComponent;
  describe('renders with no initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresourceCard
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            resource={resource}
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the PackageCardExternal', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCardExternal')).toBeInTheDocument();
    });
  });

  describe('renders with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormEresourceCard
            handlers={handlers}
            initialValuesData={initialValuesData}
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            line={line}
            resource={packagesResource}
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the PackageCard', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageCard')).toBeInTheDocument();
    });
  });
});
