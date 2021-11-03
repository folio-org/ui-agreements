import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button, Modal } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import { data, handlers } from './testResources';
import Agreement from './Agreement';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: () => <div>LoadingPane</div>,
}));

jest.mock('../../AgreementSections/AllPeriods', () => () => <div>AllPeriods</div>);
jest.mock('../../AgreementSections/ControllingLicense', () => () => <div>ControllingLicense</div>);
jest.mock('../../AgreementSections/ExternalLicenses', () => () => <div>ExternalLicenses</div>);
jest.mock('../../AgreementSections/FutureLicenses', () => () => <div>FutureLicenses</div>);
jest.mock('../../AgreementSections/Header', () => () => <div>Header</div>);
jest.mock('../../AgreementSections/HistoricalLicenses', () => () => <div>HistoricalLicenses</div>);
jest.mock('../../AgreementSections/Info', () => () => <div>Info</div>);
jest.mock('../../AgreementSections/InternalContacts', () => () => <div>InternalContacts</div>);
jest.mock('../../AgreementSections/Lines', () => () => <div>Lines</div>);
jest.mock('../../AgreementSections/Organizations', () => () => <div>Organizations</div>);
jest.mock('../../AgreementSections/RelatedAgreements', () => () => <div>RelatedAgreements</div>);
jest.mock('../../AgreementSections/SupplementaryDocs', () => () => <div>SupplementaryDocs</div>);
jest.mock('../../AgreementSections/SupplementaryProperties', () => () => <div>SupplementaryProperties</div>);
jest.mock('../../AgreementSections/Terms', () => () => <div>Terms</div>);
jest.mock('../../AgreementSections/UsageData', () => () => <div>UsageData</div>);


describe('Agreement', () => {
  let renderComponent;

  describe('isLoading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Agreement
            data={data}
            handlers={handlers}
            isLoading
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the AllPeriods component', () => {
      const { getByText } = renderComponent;
      expect(getByText('LoadingPane')).toBeInTheDocument();
    });
  });

  describe('after loading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Agreement
            data={data}
            handlers={handlers}
            isLoading={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the AllPeriods component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AllPeriods')).toBeInTheDocument();
    });

    it('renders the ControllingLicense component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ControllingLicense')).toBeInTheDocument();
    });

    it('renders the ExternalLicenses component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ExternalLicenses')).toBeInTheDocument();
    });


    it('renders the FutureLicenses component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FutureLicenses')).toBeInTheDocument();
    });


    it('renders the Header component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Header')).toBeInTheDocument();
    });


    it('renders the HistoricalLicenses component', () => {
      const { getByText } = renderComponent;
      expect(getByText('HistoricalLicenses')).toBeInTheDocument();
    });


    it('renders the Info component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Info')).toBeInTheDocument();
    });


    it('renders the InternalContacts component', () => {
      const { getByText } = renderComponent;
      expect(getByText('InternalContacts')).toBeInTheDocument();
    });


    it('renders the Lines component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Lines')).toBeInTheDocument();
    });


    it('renders the Organizations component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Organizations')).toBeInTheDocument();
    });


    it('renders the RelatedAgreements component', () => {
      const { getByText } = renderComponent;
      expect(getByText('RelatedAgreements')).toBeInTheDocument();
    });


    it('renders the SupplementaryDocs component', () => {
      const { getByText } = renderComponent;
      expect(getByText('SupplementaryDocs')).toBeInTheDocument();
    });


    it('renders the SupplementaryProperties component', () => {
      const { getByText } = renderComponent;
      expect(getByText('SupplementaryProperties')).toBeInTheDocument();
    });


    it('renders the Terms component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Terms')).toBeInTheDocument();
    });

    it('renders the UsageData component', () => {
      const { getByText } = renderComponent;
      expect(getByText('UsageData')).toBeInTheDocument();
    });

    it('renders the Duplicate modal on clicking the duplicate button from the actions dropdown', async () => {
      await Button('Actions').click();
      await Button('Duplicate').click();
      await Modal('Duplicate agreement').exists();
      await Button('Cancel').click(); // close the modal
    });

    it('renders the Confirmation modal on clicking the delete button from the actions dropdown', async () => {
      await Button('Actions').click();
      await Button('Delete').click();
      await Modal('Delete agreement').exists();
      await Button('Cancel').click(); // close the modal
    });

    it('Clicking the export button should trigger the callback', async () => {
      await Button('Actions').click();
      await Button('Export').click();
      expect(handlers.onExportAgreement).toHaveBeenCalled();
    });
  });
});
