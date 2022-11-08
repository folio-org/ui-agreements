
import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import FormEresourceCard from './FormEresourceCard';
import { internalPackage, externalPackage, initialValuesData, line, handlers, initialValues, interalTitle, externalTitle } from './testResources';
import translationsProperties from '../../../../test/helpers';

jest.mock('../../PackageCardExternal', () => () => <div>PackageCardExternal</div>);
jest.mock('../../PackageCard', () => () => <div>PackageCard</div>);
jest.mock('../../TitleCard', () => () => <div>TitleCard</div>);
jest.mock('../../TitleCardExternal', () => () => <div>TitleCardExternal</div>);

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
            resource={externalPackage}
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

  describe('renders with internal title', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresourceCard
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            resource={interalTitle}
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the TitleCard', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCard')).toBeInTheDocument();
    });
  });

  describe('renders with external title card', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresourceCard
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            resource={externalTitle}
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the TitleCardExternal', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCardExternal')).toBeInTheDocument();
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
            resource={internalPackage}
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
