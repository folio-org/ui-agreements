import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { renderWithIntl, TestForm, KeyValue, TextField } from '@folio/stripes-erm-testing';
import { Field } from 'react-final-form';
import { detachedData, data } from './testResources';
import AgreementLineField from './AgreementLineField';
import translationsProperties from '../../../test/helpers';

jest.mock('../BasketSelector', () => () => <div>BasketSelector</div>);
jest.mock('../EResourceLink', () => () => <div>EResourceLink</div>);
jest.mock('../EResourceCount', () => () => <div>EResourceCount</div>);
jest.mock('../EResourceProvider', () => () => <div>EResourceProvider</div>);
jest.mock('../CoverageFieldArray', () => () => <div>CoverageFieldArray</div>);
jest.mock('../POLinesFieldArray', () => () => <div>POLinesFieldArray</div>);

const onResourceSelected = jest.fn();
const onDelete = jest.fn();
const onSubmit = jest.fn();

describe('AgreementLineField', () => {
  let renderComponent;
  describe('renders expected component', () => {
    renderComponent = renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <Field
          component={AgreementLineField}
          name="resource"
          onDelete={onDelete}
          onResourceSelected={onResourceSelected}
          resource={{}}
        />
      </TestForm>,
      translationsProperties
    );

    test('renders the BasketSelector component', () => {
      const { getByText } = renderComponent;
      expect(getByText('BasketSelector')).toBeInTheDocument();
    });
  });

  describe('renders expected fields/values without initial values', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <Field
            component={AgreementLineField}
            index={0}
            name="resource"
            onDelete={onDelete}
            onResourceSelected={onResourceSelected}
            resource={data.resource}
          />
        </TestForm>,
        translationsProperties
      );
    });

    it('renders expected values', async () => {
      await KeyValue('Name').has({ value: 'EResourceLink' });
      await KeyValue('Publication type').has({ value: 'Journal' });
      await KeyValue('Titles').has({ value: 'EResourceCount' });
      await KeyValue('Provider').has({ value: 'EResourceProvider' });
      await KeyValue('Default coverage').exists();
    });

    test('renders the CoverageFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('CoverageFieldArray')).toBeInTheDocument();
    });

    test('renders the POLinesFieldArray component', () => {
      const { getByText } = renderComponent;
      expect(getByText('POLinesFieldArray')).toBeInTheDocument();
    });
  });

  describe('renders expected fields/values with detached resource', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <Field
            component={AgreementLineField}
            index={0}
            name="resource"
            onDelete={onDelete}
            onResourceSelected={onResourceSelected}
            resource={detachedData.resource}
          />
        </TestForm>,
        translationsProperties
      );
    });

    it('renders description keyValue', async () => {
      await KeyValue('Description').has({ value: 'agreement line description' });
    });

    test('renders expected fields', () => {
      const { getByTestId, getByRole } = renderComponent;
      expect(getByTestId('agreementLineField')).toBeInTheDocument();
      expect(getByRole('textbox', { name: /active from/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: /active to/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: /note/i })).toBeInTheDocument();
    });
  });

  describe('renders expected fields/values with initial values set', () => {
    test('renders expected fields', () => {
      const { getByTestId, getByRole } = renderWithIntl(
        <TestForm initialValues={{ data }} onSubmit={onSubmit}>
          <Field
            component={AgreementLineField}
            index={0}
            name="resource"
            onDelete={onDelete}
            onResourceSelected={onResourceSelected}
            resource={data.resource}
          />
        </TestForm>,
        translationsProperties
      );

      expect(getByTestId('agreementLineField')).toBeInTheDocument();
      expect(getByRole('textbox', { name: /active from/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: /active to/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: /note/i })).toBeInTheDocument();
    });

    test('date validation fires for invalid end date', async () => {
      const { getAllByText, queryByText } = renderWithIntl(
        <TestForm initialValues={{ data }} onSubmit={onSubmit}>
          <Field
            component={AgreementLineField}
            index={0}
            name="resource"
            onDelete={onDelete}
            onResourceSelected={onResourceSelected}
            resource={data.resource}
          />
        </TestForm>,
        translationsProperties
      );

      await waitFor(async () => {
        await TextField('Active from').fillIn('01/01/2021');
        await TextField('Active to').fillIn('01/01/2002');
      });

      await waitFor(() => expect(getAllByText(/End date must be after the start date./i)?.[0]).toBeInTheDocument());


      await waitFor(async () => {
        await TextField('Active to').clear();
        await TextField('Active to').fillIn('01/01/2022');
      });

      await waitFor(() => expect(queryByText(/End date must be after the start date./i)).not.toBeInTheDocument());
    });
  });
});
