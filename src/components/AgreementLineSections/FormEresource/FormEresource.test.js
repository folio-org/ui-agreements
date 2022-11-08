import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import {
  initialValues,
  handlers,
  data,
  eholdingData,
  emptyAgreementLineSource
} from './testResources';
import FormEresource from './FormEresource';

jest.mock('../EresourceSelector', () => () => <div>EresourceSelector</div>);
jest.mock('../FormEresourceCard', () => () => <div>FormEresourceCard</div>);
jest.mock('../../BasketSelector', () => () => <div>BasketSelector</div>);

const onSubmit = jest.fn();

describe('FormEresource', () => {
  let renderComponent;
  describe('with initialValues', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <FormEresource handlers={handlers} validate={() => { }} />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the submit button', async () => {
      await Button('Submit').exists();
    });

    test('renders the FormEresourceCard component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormEresourceCard')).toBeInTheDocument();
    });
  });

  describe('with agreementLineSource type basket', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource
            agreementLineSource={data.agreementLineSource}
            basket={data.basket}
            line={data.line}
            lineId={data.lineId}
            setFieldData={data.setFieldData}
            validate={() => { }}
            values={data.values}
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders sumbmit button', () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('renders the BasketSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('BasketSelector')).toBeInTheDocument();
    });
  });

  describe('with agreementLineSource type eholding', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource
            agreementLineSource={eholdingData.agreementLineSource}
            basket={eholdingData.basket}
            line={eholdingData.line}
            lineId={eholdingData.lineId}
            setFieldData={eholdingData.setFieldData}
            validate={() => { }}
            values={eholdingData.values}
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the EresourceSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('EresourceSelector')).toBeInTheDocument();
    });
  });

  describe('with empty agreementLineSource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <FormEresource
            agreementLineSource={emptyAgreementLineSource.agreementLineSource}
          />
        </TestForm>,
        translationsProperties
      );
    });
    test('renders null', () => {
      const { queryByText } = renderComponent;
      expect(queryByText('FormEresource')).toBeNull();
    });
  });
});
