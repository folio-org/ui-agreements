const usageDataProviders = [{
  id: '2c91809c7d35de64017d37f29bd4004d',
  remoteId: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
  remoteId_object: {
    id: 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
    label: 'American Chemical Society',
    harvestingConfig: {
      harvestingStatus: 'active',
      harvestVia: 'aggregator',
      aggregator: {
        id: '5b6ba83e-d7e5-414e-ba7b-134749c0d950',
        name: 'German National Statistics Server',
        vendorCode: 'ACSO'
      },
      reportRelease: 5,
      requestedReports: [
        'IR',
        'TR'
      ],
      harvestingStart: '2019-01'
    },
    sushiCredentials: {
      customerId: '0000000000',
      requestorId: '00000',
      requestorName: 'Opentown Libraries',
      requestorMail: 'electronic@lib.optentown.edu'
    },
    latestReport: '2018-04',
    earliestReport: '2018-01',
    hasFailedReport: 'no',
    reportErrorCodes: [],
    reportTypes: [
      'JR1'
    ],
    notes: 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
    metadata: {
      createdDate: '2021-11-19T01:53:55.274+00:00',
      updatedDate: '2021-11-19T01:53:55.274+00:00'
    }
  },
  owner: {
    id: '85bbb7c5-6015-40ea-9a35-f8cbff1abf68'
  },
  usageDataProviderNote: 'test note 1'
},
{
  id: '2c91809c7d35de64017d37f29bd4004c',
  remoteId: '00db3e61-e08e-4f8b-93ee-8e60fd402fc8',
  remoteId_object: {
    id: '00db3e61-e08e-4f8b-93ee-8e60fd402fc8',
    label: 'Otto Harrassowitz GmbH & Co. KG',
    harvestingConfig: {
      harvestingStatus: 'active',
      harvestVia: 'sushi',
      sushiConfig: {
        serviceType: 'cs41',
        serviceUrl: 'https://counter.harra.de/counter/webservice/sushi'
      },
      reportRelease: 4,
      requestedReports: [
        'JR1'
      ],
      harvestingStart: '2016-01'
    },
    sushiCredentials: {
      customerId: '0000000000',
      requestorId: '00000000-0000-0000-0000-000000000000',
      requestorName: 'Opentown Libraries',
      requestorMail: 'electronic@lib.optentown.edu'
    },
    hasFailedReport: 'no',
    reportErrorCodes: [],
    reportTypes: [],
    notes: 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
    metadata: {
      createdDate: '2021-11-19T01:53:55.365+00:00',
      updatedDate: '2021-11-19T01:53:55.365+00:00'
    }
  },
  owner: {
    id: '85bbb7c5-6015-40ea-9a35-f8cbff1abf68'
  },
  usageDataProviderNote: 'test note 2'
}
];

export default usageDataProviders;
