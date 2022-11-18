import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../test/helpers';
import IdentifierReassignmentForm from './IdentifierReassignmentForm';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const onSubmitMock = jest.fn();
const onCloseMock = jest.fn();

jest.mock('./SourceTitleIdentifierField', () => () => <div>SourceTitleIdentifierField</div>);
jest.mock('./DestinationTitleIdentifierField', () => () => <div>DestinationTitleIdentifierField</div>);
jest.mock('./SourceTitlePreview/SourceTitlePreview', () => () => <div>SourceTitlePreview</div>);
jest.mock('./DestinationTitlePreview/DestinationTitlePreview', () => () => <div>DestinationTitlePreview</div>);

describe('IdentifierReassignmentForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm onClose={onCloseMock} onSubmit={onSubmitMock}>
        <IdentifierReassignmentForm
          data={{}}
          form={{
            change: () => jest.fn(),
          }}
          handlers={{
            onClose: onCloseMock,
          }}
        />
        <div>SourceTitleIdentifierField</div>
        <div>DestinationTitleIdentifierField</div>
        <div>SourceTitlePreview</div>
        <div>DestinationTitlePreview</div>
      </TestForm>,
      translationsProperties
    );
  });

  it('renders the SourceTitleIdentifierField component', () => {
    const { getByText } = renderComponent;
    expect(getByText('SourceTitleIdentifierField')).toBeInTheDocument();
  });

  it('renders the DestinationTitleIdentifierField component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DestinationTitleIdentifierField')).toBeInTheDocument();
  });

  it('renders the SourceTitlePreview component', () => {
    const { getByText } = renderComponent;
    expect(getByText('SourceTitlePreview')).toBeInTheDocument();
  });

  it('renders the DestinationTitlePreview component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DestinationTitlePreview')).toBeInTheDocument();
  });

  test('renders the identifierReassignmentForm form', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('identifierReassignmentForm')).toBeInTheDocument();
  });

  test('renders the submit button', async () => {
    await Button('Submit').exists();
  });

  test('clicking the submit button ', async () => {
    await Button('Submit').click();
    expect(onSubmitMock.mock.calls.length).toBe(1);
  });
});
