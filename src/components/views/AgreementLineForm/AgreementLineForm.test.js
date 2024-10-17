import { renderWithIntl, Checkbox } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import AgreementLineForm from './AgreementLineForm';

const onSubmitMock = jest.fn();
const onCloseMock = jest.fn();
const isSuppressFromDiscoveryEnabledMock = jest.fn();

jest.mock('../../IfEResourcesEnabled', () => ({ children }) => {
  return typeof children === 'function' ? children({ isEnabled: true }) : children;
});

jest.mock('../../AgreementLineSections/FormInfo', () => () => <div>FormInfo</div>);
jest.mock('../../AgreementLineSections/FormPOLines', () => () => <div>FormPOLines</div>);
jest.mock('../../AgreementLineSections/FormDocuments', () => () => <div>FormDocuments</div>);
jest.mock('../../AgreementLineSections/FormCoverage', () => () => <div>FormCoverage</div>);
jest.mock('../../AgreementLineSections/FormEresource', () => () => <div>FormEresource</div>);

describe('AgreementLineForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <AgreementLineForm
          createAnother
          data={{}}
          handlers={{
            onClose: onCloseMock,
            isSuppressFromDiscoveryEnabled: isSuppressFromDiscoveryEnabledMock
          }}
          isEholdingsEnabled
          onSubmit={onSubmitMock}
          toggleCreateAnother={jest.fn()}
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

  it('renders the FormDocuments component', () => {
    const { getByText } = renderComponent;
    expect(getByText('FormDocuments')).toBeInTheDocument();
  });

  it('renders the FormCoverage component', () => {
    const { getByText } = renderComponent;
    expect(getByText('FormCoverage')).toBeInTheDocument();
  });

  it('renders the FormEresource component', () => {
    const { getByText } = renderComponent;
    expect(getByText('FormEresource')).toBeInTheDocument();
  });

  test('renders the create another Checkbox', async () => {
    await Checkbox({ id: 'agreement-line-create-another' }).exists();
  });

  test('renders the create another Checkbox as checked', async () => {
    Checkbox('Create another').is({ checked: true });
  });
});
