

import { renderWithIntl, Button, Modal } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import { data, handlers } from './testResources';
import Agreement from './Agreement';

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useAgreementsContexts: jest.fn(() => ({ data: [] }))
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
jest.mock('../../AgreementSections/Terms', () => () => <div>Terms</div>);
jest.mock('../../AgreementSections/UsageData', () => () => <div>UsageData</div>);


describe('Agreement', () => {
  let renderComponent;

  describe('isLoading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Agreement
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
            data={data}
            handlers={handlers}
            isLoading
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    it('renders the LoadingPane component', () => {
      const { getByText } = renderComponent;
      expect(getByText('LoadingPane')).toBeInTheDocument();
    });
  });

  describe('after loading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Agreement
            components={{
              HelperComponent: () => <div>HelperComponent</div>,
              TagButton: () => <div>TagButton</div>
            }}
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

    it('renders the CustomPropertiesView component', () => {
      const { getByText } = renderComponent;
      expect(getByText('CustomPropertiesView')).toBeInTheDocument();
    });


    it('renders the RelatedAgreements component', () => {
      const { getByText } = renderComponent;
      expect(getByText('RelatedAgreements')).toBeInTheDocument();
    });


    it('renders the SupplementaryDocs component', () => {
      const { getByText } = renderComponent;
      expect(getByText('SupplementaryDocs')).toBeInTheDocument();
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
      const { getByText } = renderComponent;
      expect(getByText('DuplicateModal')).toBeInTheDocument();
    });

    it('renders the Confirmation modal on clicking the delete button from the actions dropdown', async () => {
      await Button('Actions').click();
      await Button('Delete').click();
      await Modal('Delete agreement').exists();
      await Button('Cancel').click(); // close the modal
    });

    it('Clicking the Export agreement (JSON) button should trigger the callback', async () => {
      await Button('Actions').click();
      await Button('Export agreement (JSON)').click();
      expect(handlers.onExportAgreement).toHaveBeenCalled();
    });
  });
});
