import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import {
  eholdingsData,
  basketData,
  basketSelectordata,
  handlers,
  initialValues
} from './testResources';
import FormEresource from './FormEresource';

jest.mock('../EresourceSelector', () => () => <div>EresourceSelector</div>);
jest.mock('../FormEresourceCard', () => () => <div>FormEresourceCard</div>);
jest.mock('../BasketSelector', () => () => <div>BasketSelector</div>);

const onSubmit = jest.fn();

describe('FormEresource', () => {
  let renderComponent;
  describe('with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormEresource handlers={handlers} />
        </TestForm>,
        translationsProperties
      );

      test('renders the submit button', async () => {
        await Button('Submit').exists();
      });
    });
  });

  describe('renders agreementLineSource type eholdings', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource basket={eholdingsData.basket} line={eholdingsData.line} resourec={eholdingsData.resource} values={eholdingsData.values} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders link e-resource button', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('renders the EresourceSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EresourceSelector')).toBeInTheDocument();
    });
  });


  // describe('renders agreementLineSource with empty basket', () => {
  //   beforeEach(() => {
  //     renderComponent = renderWithIntl(
  //       <TestForm onSubmit={onSubmit}>
  //         <FormEresource basket={basketSelectordata.basket} line={basketSelectordata.line} resource={basketData.resource} values={basketSelectordata.values} />
  //       </TestForm>,
  //       translationsProperties
  //     );

  //     test('renders the BasketSelector component', () => {
  //       const { getByText } = renderComponent;
  //       expect(getByText('BasketSelector')).toBeInTheDocument();
  //     });
  //   });
  // });
});
