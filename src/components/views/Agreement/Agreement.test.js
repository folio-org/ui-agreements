

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button, Modal, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Agreement from './Agreement';
import { data, handlers } from './testResources';

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

    describe('opening actions menu', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Actions').click();
        });
      });

      describe('clicking duplicate modal', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Duplicate').click();
          });
        });

        test('renders the Duplicate modal', async () => {
          const { getByText } = renderComponent;
          await waitFor(async () => {
            expect(getByText('DuplicateModal')).toBeInTheDocument();
          });
        });
      });

      describe('clicking delete', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Delete').click();
          });
        });

        test('renders the confirmation modal', async () => {
          await waitFor(async () => {
            await Modal('Delete agreement').exists();
          });
        });

        describe('cancelling confirmation modal', () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button('Cancel').click(); // close the modal
            });
          });

          test('confirmation modal no longer renders', async () => {
            await waitFor(async () => {
              await Modal('Delete agreement').absent();
            });
          });
        });
      });

      describe('clicking export agreement (JSON)', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button('Export agreement (JSON)').click();
          });
        });

        test('correct callback is triggered', async () => {
          await waitFor(async () => {
            expect(handlers.onExportAgreement).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
