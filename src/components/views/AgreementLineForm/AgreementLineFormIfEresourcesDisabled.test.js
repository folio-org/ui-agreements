// adding a second test file here to test the ifEresourcesDisabled branch
import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import AgreementLineForm from './AgreementLineForm';

const onSubmitMock = jest.fn();
const onCloseMock = jest.fn();
const isSuppressFromDiscoveryEnabledMock = jest.fn();

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  handleSaveKeyCommand: () => jest.fn()
}));

jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: false }) : children;
});

jest.mock('../../AgreementLineSections/FormInfo', () => () => <div>FormInfo</div>);
jest.mock('../../AgreementLineSections/FormPOLines', () => () => <div>FormPOLines</div>);
jest.mock('../../AgreementLineSections/FormCoverage', () => () => <div>FormCoverage</div>);
jest.mock('../../AgreementLineSections/FormEresource', () => () => <div>FormEresource</div>);

describe('AgreementLineForm', () => {
  describe('with no initial values', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLineForm
            data={{}}
            form={{
              change: () => jest.fn(),
              getRegisteredFields: () => jest.fn(),
              getState: () => jest.fn()
            }}
            handlers={{
              onClose: onCloseMock,
              isSuppressFromDiscoveryEnabled: isSuppressFromDiscoveryEnabledMock
            }}
            onSubmit={onSubmitMock}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the FormInfo component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormInfo')).toBeInTheDocument();
    });

    it('renders the FormPOLines component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormPOLines')).toBeInTheDocument();
    });

    it('renders the FormEresource component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormEresource')).toBeInTheDocument();
    });
  });
});
