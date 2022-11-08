import React from 'react';
import '@folio/stripes-erm-testing/jest/directMocks';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { StaticRouter as Router } from 'react-router-dom';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import DestinationTitleIdentifierField from './DestinationTitleIdentifierField';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useFormContext: () => ({
    handleSubmit: () => jest.fn(),
    getValues: () => jest.fn(),
  }),
}));

const onSubmitMock = jest.fn();

const data = {
  'id': 'eced1a01-9259-4560-9f47-ea9a026b4244',
  'subType': {
    'id': '2c91809c80aba37f0180abaa27960010',
    'value': 'electronic',
    'label': 'Electronic'
  },
  'dateCreated': '2022-05-10T02:36:05Z',
  'tags': [],
  'lastUpdated': '2022-05-10T02:36:05Z',
  'normalizedName': '10th aiaa multidisciplinary design optimization conference',
  'publicationType': {
    'id': '2c91809c80aba37f0180abaa3b98006c',
    'value': 'book',
    'label': 'Book'
  },
  'coverage': [],
  'alternateResourceNames': [],
  'name': '10th AIAA Multidisciplinary Design Optimization Conference',
  'type': {
    'id': '2c91809c80aba37f0180abaa279d0012',
    'value': 'monograph',
    'label': 'Monograph'
  },
  'suppressFromDiscovery': false,
  'work': {
    'id': '95c35c86-da19-46ae-8372-5d229773c840'
  },
  'platformInstances': [{
    'id': 'fb5d6fbd-eb56-4a12-a8da-0562f9bba31b'
  }],
  'class': 'org.olf.kb.TitleInstance',
  'longName': '10th AIAA Multidisciplinary Design Optimization Conference',
  'identifiers': [{
    'dateCreated': '2022-05-10T02:36:05Z',
    'lastUpdated': '2022-05-10T02:36:05Z',
    'status': {
      'id': '2c91809c80aba37f0180abaa31f3006b',
      'value': 'approved',
      'label': 'approved'
    },
    'identifier': {
      'value': '978-1-62410-310-0',
      'ns': {
        'value': 'isbn'
      }
    }
  }],
  'relatedTitles': []
};

describe('DestinationTitleIdentifierField', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Router>
        <TestForm onSubmit={onSubmitMock}>
          <DestinationTitleIdentifierField
            data={data}
          />
        </TestForm>,
      </Router>,
      translationsProperties
    );
  });

  it('renders the DestinationTitleIdentifierField card', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('destinationTitleCard')).toBeInTheDocument();
  });

  test('renders the Title text', () => {
    const { getByText } = renderComponent;
    expect(getByText('Title')).toBeInTheDocument();
  });

  test('renders the expected text when no title is selected', () => {
    const { getByText } = renderComponent;
    expect(getByText('No destination title selected')).toBeInTheDocument();
  });

  test('renders the expected text to select destination title', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select the destination title for the identifier(s)')).toBeInTheDocument();
  });

  test('renders the submit button', async () => {
    await Button('Submit').exists();
  });

  test('clicking the submit button ', async () => {
    await Button('Submit').click();
    expect(onSubmitMock.mock.calls.length).toBe(1);
  });
});
