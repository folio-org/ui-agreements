
import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion } from '@folio/stripes-testing';
import FormLines from './FormLines';
import translationsProperties from '../../../../test/helpers';

const agreementID = '2cf80226-ea96-43c5-8148-496871630300';

let renderComponent;

describe('FormLines', () => {
  describe('FormLines with agreement lines', () => {
    const count = 2;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <FormLines
            agreementId={agreementID}
            agreementLineCount={count}
          />
        </MemoryRouter>, translationsProperties
      );
    });

    test('renders the Agreement lines accordion', async () => {
      await Accordion('Agreement lines').exists();
    });

    test('renders text indicating agreement lines exist', async () => {
      const { getByText } = renderComponent;
      expect(getByText(`Agreement has ${count} agreement lines`)).toBeInTheDocument();
    });

    test('renders the link to agreement lines page', async () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'View in agreement lines search (opens in new tab)' })).toBeInTheDocument();
    });
  });

  describe('FormLines without agreement lines', () => {
    const count = 0;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <FormLines
            agreementId={agreementID}
            agreementLineCount={count}
          />
        </MemoryRouter>, translationsProperties
      );
    });

    test('renders the Agreement lines accordion', async () => {
      await Accordion('Agreement lines').exists();
    });

    test('renders text indicating agreement lines do not exist', () => {
      const { getByText } = renderComponent;
      expect(getByText('No agreement lines for this agreement')).toBeInTheDocument();
    });
  });

  describe('FormLines with undefined agreementLineCount', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <FormLines
            agreementId={agreementID}
          />
        </MemoryRouter>, translationsProperties
      );
    });

    test('renders the Agreement lines accordion', async () => {
      await Accordion('Agreement lines').exists();
    });

    test('renders text indicating agreement lines do not exist', () => {
      const { getByText } = renderComponent;
      expect(getByText('No agreement lines for this agreement')).toBeInTheDocument();
    });
  });

  describe('FormLines with undefined agreementId', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <FormLines />
        </MemoryRouter>, translationsProperties
      );
    });

    test('renders the Agreement lines accordion', async () => {
      await Accordion('Agreement lines').exists();
    });

    test('renders text indicating agreement lines do not exist', () => {
      const { getByText } = renderComponent;
      expect(getByText('No agreement lines for this agreement')).toBeInTheDocument();
    });
  });
});
