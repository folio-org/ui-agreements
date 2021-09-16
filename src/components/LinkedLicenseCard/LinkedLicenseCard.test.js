import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { KeyValue } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/helpers';
import LinkedLicenseCard from './LinkedLicenseCard';
import { futureLicense, historicalLicense } from './testLicenses';

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  LicenseCard: () => <div>LicenseCard</div>,
}));
jest.mock('../LicenseAmendmentList', () => () => <div>LicenseAmendmentList</div>);

let renderComponent;
describe('LinkedLicenseCard', () => {
    describe('Future license card', () => {
      beforeEach(() => {
        renderComponent = renderWithIntl(
          <MemoryRouter>
            <LinkedLicenseCard
              id="agreement-future-license-0"
              license={futureLicense}
            />
          </MemoryRouter>,
          translationsProperties
        );
      });

      test('renders LinkedLicenseCard component', () => {
        const { getByTestId } = renderComponent;
        expect(getByTestId('linkedLicense')).toBeInTheDocument();
       });

       test('renders a link with the license name', () => {
        const { getByRole } = renderComponent;
        expect(getByRole('link', { name: futureLicense.remoteId_object.name })).toBeInTheDocument();
      });

      test('renders the LicenseCard', () => {
        const { getByText } = renderComponent;
        expect(getByText('LicenseCard')).toBeInTheDocument();
      });

      if (futureLicense.note) {
        test('renders the expected note value', async () => {
          await KeyValue('Note').has({ value: futureLicense.note });
        });
      }

      if (futureLicense.remoteId_object.amendments.length) {
        test('renders the LicenseAmendmentList', () => {
          const { getByText } = renderComponent;
          expect(getByText('LicenseAmendmentList')).toBeInTheDocument();
        });
      }
    });

    describe('Historical license card', () => {
        beforeEach(() => {
          renderComponent = renderWithIntl(
            <MemoryRouter>
              <LinkedLicenseCard
                id="agreement-historical-license-0"
                license={historicalLicense}
              />
            </MemoryRouter>,
            translationsProperties
          );
        });

        test('renders LinkedLicenseCard component', () => {
          const { getByTestId } = renderComponent;
          expect(getByTestId('linkedLicense')).toBeInTheDocument();
         });

         test('renders a link with the license name', () => {
          const { getByRole } = renderComponent;
          expect(getByRole('link', { name: historicalLicense.remoteId_object.name })).toBeInTheDocument();
        });

        test('renders the LicenseCard', () => {
          const { getByText } = renderComponent;
          expect(getByText('LicenseCard')).toBeInTheDocument();
        });

        if (historicalLicense.note) {
          test('renders the expected note value', async () => {
            await KeyValue('Note').has({ value: historicalLicense.note });
          });
        }

        if (historicalLicense.remoteId_object.amendments.length) {
          test('renders the LicenseAmendmentList', () => {
            const { getByText } = renderComponent;
            expect(getByText('LicenseAmendmentList')).toBeInTheDocument();
          });
        }
    });
});
