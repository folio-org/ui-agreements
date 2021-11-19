import { FormattedMessage } from 'react-intl';

const dataWithNoProvider = {
    'input': {
        'name': 'usageDataProviders[0].remoteId',
        'value': '',
        'onBlur': () => {},
        'onChange': () => {},
        'onFocus': () => {}
    },
    'meta': {
        'active': false,
        'data': '{}',
        'dirty': false,
        'dirtySinceLastSubmit': false,
        'error': '<Memo />',
        'invalid': true,
        'modified': false,
        'modifiedSinceLastSubmit': false,
        'pristine': true,
        'submitFailed': false,
        'submitSucceeded': false,
        'submitting': false,
        'touched': false,
        'valid': false,
        'validating': false,
        'visited': false
    },
    'id': 'udp-remoteId-0',
    'index': 0,
    'onUDPSelected': () => {},
    'udp': {}
};

const data = {
    'input': {
        'name': 'usageDataProviders[0].remoteId',
        'value': 'e67924ee-aa00-454e-8fd0-c3f81339d20e',
        'onChange': () => {},
    },
    'meta': {
        'touched': false,
    },
    'id': 'udp-remoteId-0',
    'index': 0,
    'onUDPSelected': () => {},
    'udp': {
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
        'reportErrorCodes': '[]',
        'reportTypes': [
            'JR1'
        ],
        'notes': 'Please fill in your own credentials: customer ID and requestor ID, name and mail are only demonstrational.',
        'metadata': {
            'createdDate': '2021-11-18T01:53:27.011+00:00',
            'updatedDate': '2021-11-18T01:53:27.011+00:00'
        }
    }
};

const errorData = {
    'input': {
        'name': 'usageDataProviders[0].remoteId',
        'value': '',
        'onChange': () => {},
    },
    'meta': {
        'error': <FormattedMessage id="stripes-core.label.missingRequiredField" />,
        'touched': true,
    },
    'id': 'udp-remoteId-0',
    'index': 0,
    'onUDPSelected': () => {},
    'udp': {}
};

export {
    dataWithNoProvider,
    data,
    errorData
};
