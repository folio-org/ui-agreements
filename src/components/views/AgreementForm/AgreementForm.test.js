import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';

import AgreementForm from './AgreementForm';
import { data, initialValues } from './testResources';

const onSubmitMock = jest.fn();
const onCloseMock = jest.fn();
const onBasketLinesAddedMock = jest.fn();

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useAgreementsContexts: jest.fn(() => ({ data: [] }))
}));

jest.mock('../../AgreementSections/FormInfo', () => () => <div>FormInfo</div>);
jest.mock('../../AgreementSections/FormInternalContacts', () => () => <div>FormInternalContacts</div>);
jest.mock('../../AgreementSections/FormLicenses', () => () => <div>FormLicenses</div>);
jest.mock('../../AgreementSections/FormOrganizations', () => () => <div>FormOrganizations</div>);
jest.mock('../../AgreementSections/FormRelatedAgreements', () => () => <div>FormRelatedAgreements</div>);
jest.mock('../../AgreementSections/FormSupplementaryDocuments', () => () => <div>FormSupplementaryDocuments</div>);
jest.mock('../../AgreementSections/FormUsageData', () => () => <div>FormUsageData</div>);

jest.mock('../../IfAccordionIsVisible', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: false }) : children;
});


describe('AgreementForm', () => {
  describe('with no initial values', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementForm
            data={data}
            form={{
              change: () => jest.fn(),
              getRegisteredFields: () => jest.fn(),
              getState: () => jest.fn()
            }}
            handlers={{
              onClose: onCloseMock,
              onBasketLinesAdded: onBasketLinesAddedMock
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

    it('renders the FormInternalContacts component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormInternalContacts')).toBeInTheDocument();
    });

    it('renders the FormLicenses component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormLicenses')).toBeInTheDocument();
    });

    it('renders the FormOrganizations component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormOrganizations')).toBeInTheDocument();
    });

    it('renders the FormRelatedAgreements component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormRelatedAgreements')).toBeInTheDocument();
    });

    it('renders the FormSupplementaryDocuments component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormSupplementaryDocuments')).toBeInTheDocument();
    });

    it('renders the FormUsageData component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormUsageData')).toBeInTheDocument();
    });
  });

  describe('with initial values', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementForm
            data={data}
            form={{
              change: () => jest.fn(),
              getRegisteredFields: () => jest.fn(),
              getState: () => jest.fn()
            }}
            handlers={{
              onClose: onCloseMock,
              onBasketLinesAdded: onBasketLinesAddedMock
            }}
            initialValues={initialValues}
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

    it('renders the FormInternalContacts component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormInternalContacts')).toBeInTheDocument();
    });

    it('renders the FormLicenses component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormLicenses')).toBeInTheDocument();
    });

    it('renders the FormOrganizations component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormOrganizations')).toBeInTheDocument();
    });

    it('renders the FormRelatedAgreements component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormRelatedAgreements')).toBeInTheDocument();
    });

    it('renders the FormSupplementaryDocuments component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormSupplementaryDocuments')).toBeInTheDocument();
    });

    it('renders the FormUsageData component', () => {
      const { getByText } = renderComponent;
      expect(getByText('FormUsageData')).toBeInTheDocument();
    });
  });
});
