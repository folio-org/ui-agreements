
import { MemoryRouter } from 'react-router-dom';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { KeyValue } from '@folio/stripes-testing';
import { Field } from 'react-final-form';
import translationsProperties from '../../../../test/helpers';
import UsageDataProviderField from './UsageDataProviderField';

const onUDPSelected = jest.fn();
const onSubmit = jest.fn();

const udp = {
  'id': 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
  'label': 'American Chemical Society',
  'harvestingConfig': {
    'harvestingStatus': 'active',
    'harvestVia': 'aggregator',
    'aggregator': {
      'id': '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
      'name': 'German National Statistics Server',
      'vendorCode': 'ACSO'
    },
    'reportRelease': 5,
    'requestedReports': [
      'IR',
      'TR'
    ],
    'harvestingStart': '2019-01'
  },
  'sushiCredentials': {
    'customerId': '0000000000',
    'requestorId': '00000',
    'requestorName': 'Opentown Libraries',
    'requestorMail': 'electronic@lib.optentown.edu'
  },
  'latestReport': '2018-04',
  'earliestReport': '2018-01',
  'hasFailedReport': 'no',
  'reportErrorCodes': [],
  'reportTypes': [
    'JR1'
  ],
  'notes': 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
  'metadata': {
    'createdDate': '2021-11-19T01:53:55.274+00:00',
    'updatedDate': '2021-11-19T01:53:55.274+00:00'
  }
};

let renderComponent;
describe('UsageDataProviderField', () => {
  describe('renders expected fields with no initial values ', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm onSubmit={onSubmit}>
          <MemoryRouter>
            <Field
              component={UsageDataProviderField}
              index={0}
              name="udp"
              onUDPSelected={onUDPSelected}
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the Usage data provider card header', () => {
      const { getByText } = renderComponent;
      expect(getByText('Usage data provider')).toBeInTheDocument();
    });

    test('renders the default message', () => {
      const { getByText } = renderComponent;
      expect(getByText('Link a usage data provider to get started')).toBeInTheDocument();
    });

    test('renders no usage data provider text', () => {
      const { getByText } = renderComponent;
      expect(getByText('No usage data provider linked')).toBeInTheDocument();
    });
  });

  describe('renders expected fields/values with initial values set ', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <TestForm initialValues={{ udp }} onSubmit={onSubmit}>
          <MemoryRouter>
            <Field
              component={UsageDataProviderField}
              index={0}
              name="udp"
              onUDPSelected={onUDPSelected}
              udp={udp}
            />
          </MemoryRouter>
        </TestForm>,
        translationsProperties
      );
    });

    test('renders the expected name value', async () => {
      await KeyValue('Name').has({ value: 'American Chemical Society' });
    });
  });
});
