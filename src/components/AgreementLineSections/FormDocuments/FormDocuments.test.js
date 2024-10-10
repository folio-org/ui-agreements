import { TestForm, renderWithIntl, Accordion } from '@folio/stripes-erm-testing';
import FormDocuments from './FormDocuments';
import translationsProperties from '../../../../test/helpers';

const onSubmit = jest.fn();

const intitialValues = {
  docs: [
    {
      id: 'bce1b2d6-b21b-450e-aaf8-c8af4ae63136',
      dateCreated: '2024-09-24T19:47:53Z',
      lastUpdated: '2024-09-24T19:51:56Z',
      atType: 'license',
      url: 'http://www.test.com',
      name: 'test1',
    },
  ],
};

const handlers = {
  onUploadFile: () => {},
  onDownloadFile: () => {},
};

describe('FormDocuments', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <TestForm intitialValues={intitialValues} onSubmit={onSubmit}>
        <FormDocuments handlers={handlers} />
      </TestForm>,
      translationsProperties
    );
  });

  test('renders the Documents accordion', async () => {
    await Accordion('Documents').exists();
  });

  test('renders the DocumentsFieldArray component', () => {
    const { getByText } = renderComponent;
    expect(getByText('DocumentsFieldArray')).toBeInTheDocument();
  });
});
