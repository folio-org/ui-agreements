import { renderWithIntl, TextField, TextArea } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import UrlCustomizerForm from './UrlCustomizerForm';

const onSubmitMock = jest.fn();
const onCloseMock = jest.fn();
const initialValues = {
  id: 'b83966b8-7834-43e0-9527-4fefd0de3b1a',
  dateCreated: '2021-11-04T17:11:38Z',
  rule: 'test code',
  context: {
    id: '2c9180b27ce8f985017ce8fb240d0041',
    value: 'urlcustomiser',
    label: 'urlCustomiser'
  },
  lastUpdated: '2021-11-04T17:11:38Z',
  name: 'test name',
  idScopes: [
    'a61f41d3-dcfd-48be-bc0f-19cccfcf9f8f'
  ]
};

describe('UrlCustomizerForm', () => {
  describe('without initialValues', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <UrlCustomizerForm
            handlers={{
              onClose: onCloseMock
            }}
            onSubmit={onSubmitMock}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the expected name text field', async () => {
      await TextField({ id: 'proxy-server-setting-name-edit' }).exists();
    });

    it('renders the expected Customization code text area', async () => {
      await TextArea().exists();
    });
  });

  describe('with initialValues', () => {
    beforeEach(() => {
      renderWithIntl(
        <MemoryRouter>
          <UrlCustomizerForm
            handlers={{
              onClose: onCloseMock
            }}
            initialValues={initialValues}
            onSubmit={onSubmitMock}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the expected name in the text field', async () => {
      await TextField({ id: 'proxy-server-setting-name-edit' }).has({ value: initialValues.name });
    });

    it('renders the expected Customization code in the text area', async () => {
      await TextArea().has({ value: initialValues.rule });
    });
  });
});
