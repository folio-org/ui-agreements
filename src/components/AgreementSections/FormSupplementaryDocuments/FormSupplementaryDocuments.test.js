import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { TestForm, renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import FormSupplementaryDocuments from './FormSupplementaryDocuments';
import translationsProperties from '../../../../test/helpers';

/* We mock the DocumentsFieldArray component here and test if that component renders as expected as a part of this test.
We neednt test out the  FormSupplementaryDocuments functionality in theses tests because we shouldnt be concerned with the
underlying implementation of the child component */

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  DocumentsFieldArray: () => <div>DocumentsFieldArray</div>,
}));

const onSubmit = jest.fn();

const data = {
  'documentCategories': [
    {
      'id': '2c91809c7af51530017af51bdc12000c',
      'value': 'license',
      'label': 'License'
    },
    {
      'id': '2c91809c7af51530017af51bdc17000d',
      'value': 'misc',
      'label': 'Misc'
    },
    {
      'id': '2c91809c7af51530017af51bdc1c000e',
      'value': 'consortium_negotiation_document',
      'label': 'Consortium negotiation document'
    }
  ]
};

const intitialValues = {
  'supplementaryDocs': [
    {
      'id': '1720c899-9a04-48ad-b117-230918e7a989',
      'dateCreated': '2021-07-30T18:09:43Z',
      'lastUpdated': '2021-07-30T18:09:43Z',
      'atType': 'license',
      'url': 'http://www.test.com',
      'name': 'test'
    }
  ]
};

const handlers = {
  onUploadFile: () => { },
  onDownloadFile: () => { }
};

describe('FormSupplementaryDocuments', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm intitialValues={intitialValues} onSubmit={onSubmit}>
        <FormSupplementaryDocuments data={data} handlers={handlers} />
      </TestForm>, translationsProperties
    );
  });

  test('renders the Supplementary documents accordion', async () => {
    await Accordion('Supplementary documents').exists();
  });

  test('renders the DocumentsFieldArray component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DocumentsFieldArray')).toBeInTheDocument();
  });
});
