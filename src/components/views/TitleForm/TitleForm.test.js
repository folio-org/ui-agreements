import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';

import TitleForm from './TitleForm';

const onSubmitMock = jest.fn();
const isSuppressFromDiscoveryEnabledMock = jest.fn();
const onCloseMock = jest.fn();
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

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  handleSaveKeyCommand: () => jest.fn()
}));

jest.mock('../../TitleCard/TitleCardInfo', () => () => <div>TitleCardInfo</div>);
jest.mock('../TitleFormInfo', () => () => <div>TitleFormInfo</div>);

describe('TitleForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <TitleForm
          handlers={{
            onClose: onCloseMock,
            isSuppressFromDiscoveryEnabled: isSuppressFromDiscoveryEnabledMock
          }}
          initialValues={initialValues}
          onSubmit={onSubmitMock}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  it('renders the TitleFormInfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('TitleFormInfo')).toBeInTheDocument();
  });

  it('renders the TitleCardInfo component', () => {
    const { getByText } = renderComponent;
    expect(getByText('TitleCardInfo')).toBeInTheDocument();
  });
});
