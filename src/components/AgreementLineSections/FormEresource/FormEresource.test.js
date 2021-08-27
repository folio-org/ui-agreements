import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import {
  renderWithIntl,
  TestForm,
} from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import { data, values, line, handlers, initialValues } from './testResources';
import FormEresource from './FormEresource';

const onSubmit = jest.fn();
const isSuppressFromDiscoveryEnabled = jest.fn((_info) => true);

jest.mock('@folio/stripes-erm-components', () => ({
    ...jest.requireActual('@folio/stripes-erm-components'),
    FormEresourceCard: () => <div>FormEresourceCard</div>,
  }));



describe('FormEresource', () => {
  let renderComponent;
  describe('with no initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource
            data={data}
            isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
            values={values}
          />
        </TestForm>,
        translationsProperties
      );
    });
    test('renders link e-resource button', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('renders the Submit button', async () => {
      await Button('Submit').exists();
    });
});

describe('with initialValues', () => {
    beforeEach(() => {
        renderComponent = renderWithIntl(
          <TestForm initialValues={initialValues} onSubmit={onSubmit}>
            <FormEresource
              data={data}
              handlers={handlers}
              isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
              line={line}
            />
          </TestForm>,
        translationsProperties
        );
        test('renders the FormEresourceCard component', () => {
            const { getByText } = renderComponent;
            expect(getByText('FormEresourceCard'));
          });
    });
  });
});
