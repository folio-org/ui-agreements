import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Button, Modal } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import { data, handlers } from './testResources';
import AgreementLine from './AgreementLine';

jest.mock('../../AgreementLineSections/Info', () => () => <div>Info</div>);
jest.mock('../../AgreementLineSections/POLines', () => () => <div>POLines</div>);
jest.mock('../../AgreementLineSections/Documents', () => () => <div>Documents</div>);
jest.mock('../../AgreementLineSections/Coverage', () => () => <div>Coverage</div>);
jest.mock('../../DiscoverySettings', () => () => <div>DiscoverySettings</div>);

describe('AgreementLine', () => {
  let renderComponent;

  describe('isLoading', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementLine
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
          <AgreementLine
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

    it('renders the Info component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Info')).toBeInTheDocument();
    });

    it('renders the POLines component', () => {
      const { getByText } = renderComponent;
      expect(getByText('POLines')).toBeInTheDocument();
    });

    it('renders the Documents component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Documents')).toBeInTheDocument();
    });

    it('renders the Coverage component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Coverage')).toBeInTheDocument();
    });

    it('renders the DiscoverySettings component', () => {
      const { getByText } = renderComponent;
      expect(getByText('DiscoverySettings')).toBeInTheDocument();
    });

    it('renders the Confirmation modal and clicking the delete/cancel button triggers expected callbacks', async () => {
      await waitFor(async () => {
        await Button('Actions').click();
        await Button('Delete').click();
        await Modal('Delete agreement line').exists();
        await Button('Cancel').click(); // close the modal
        await Button('Actions').click();
        await Button('Delete').click();
        await Modal('Delete agreement line').exists();
        await Button('Delete').click(); // delete the line
      });

      expect(handlers.onDelete).toHaveBeenCalled();
    });

    it('triggers the onEdit callback on clicking the edit button from the actions dropdown', async () => {
      await waitFor(async () => {
        await Button('Actions').click();
        await Button('Edit').click();
      });

      expect(handlers.onEdit).toHaveBeenCalled();
    });
  });
});
