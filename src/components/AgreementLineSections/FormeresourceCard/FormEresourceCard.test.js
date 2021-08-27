
import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import FormEresourceCard from './FormEresourceCard';
import translationsProperties from '../../../../test/helpers';
import { dataTypePackage, resource, line, handlers, initialValues } from './testResources';

jest.mock('../../TitleCardExternal', () => () => <div>TitleCardExternal</div>);
jest.mock('../../PackageCard', () => () => <div>PackageCard</div>);

const onSubmit = jest.fn();
let renderComponent;
describe('FormEresourceCard', () => {
  describe('with no initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <TestForm onSubmit={onSubmit}>
            <FormEresourceCard handlers={handlers} line={line} resource={resource} />
          </TestForm>
        </MemoryRouter>, translationsProperties
      );
    });

    test('renders the TitleCardExternal', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleCardExternal')).toBeInTheDocument();
    });
  });

  describe('with initial values', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <TestForm initialValues={initialValues} onSubmit={onSubmit}>
            <FormEresourceCard handlers={handlers} line={line} resource={resource} />
          </TestForm>
        </MemoryRouter>, translationsProperties
      );
    });
    test('renders the TitleCardExternal', () => {
        const { getByText } = renderComponent;
        expect(getByText('TitleCardExternal')).toBeInTheDocument();
      });
  });

  describe('with type package', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <TestForm onSubmit={onSubmit}>
            <FormEresourceCard dataTypePackage={dataTypePackage} />
          </TestForm>
        </MemoryRouter>, translationsProperties
      );
    });
    test('renders the PackageCard', () => {
        const { getByText } = renderComponent;
        expect(getByText('PackageCard')).toBeInTheDocument();
      });
  });
});
