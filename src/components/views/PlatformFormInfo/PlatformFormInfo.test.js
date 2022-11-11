

import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { Button, KeyValue, TextField } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import PlatformFormInfo from './PlatformFormInfo';

const onSubmit = jest.fn();

const initialValues = {
  'id': 'fc990353-7148-4cc7-9bc4-731c2db995b3',
  'dateCreated': '2021-09-30T02:13:32Z',
  'lastUpdated': '2021-09-30T15:26:35Z',
  'name': 'ACS Publications',
  'localCode': 'test code',
  'locators': [
    {
      'id': '7ac48264-24a5-41ca-9c13-2abd92ab207a',
      'domainName': 'pubs.acs.org'
    }
  ]
};

const name = 'ACS Publications';

describe('PlatformFormInfo', () => {
  describe('should', () => {
    beforeEach(() => renderWithIntl(
      <TestForm onSubmit={onSubmit}>
        <PlatformFormInfo name={name} />
      </TestForm>,
      translationsProperties
    ));

    test('render the platform name', async () => {
      await KeyValue('Name').has({ value: 'ACS Publications' });
    });

    test('render Local platform code TextField', async () => {
      await TextField({ 'id': 'edit-local-platform-code' }).exists();
    });

    test('trigger onSubmit with expected values on submitting the form', async () => {
      await TextField({ 'id': 'edit-local-platform-code' }).fillIn('testCode'); // adding this test to cover the `parse={v => v}` condition
      await Button('Submit').click();
      expect(onSubmit.mock.calls[0][0]).toEqual({ 'localCode': 'testCode' });
    });
  });

  describe('with initialValues', () => {
    beforeEach(() => renderWithIntl(
      <TestForm initialValues={initialValues} onSubmit={onSubmit}>
        <PlatformFormInfo name={name} />
      </TestForm>,
      translationsProperties
    ));

    test('renders the platform name', async () => {
      await KeyValue('Name').has({ value: 'ACS Publications' });
    });

    test('renders Local platform code TextField', async () => {
      await TextField({ 'id': 'edit-local-platform-code' }).has({ value: 'test code' });
    });
  });
});
