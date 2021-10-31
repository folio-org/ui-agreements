const checkedActivedFilters = {
    'publicationType': [
        'database',
        'book',
        'journal'
    ],
    'class': [
        'package',
        'nopackage'
    ],
    'type': [
        'monograph',
        'serial'
    ],
    'tags': [
        'important',
        'catalogingrecords',
        'urgent'
    ],
    'remoteKb': [
        '06c037fe-6089-4f65-b74d-dd9b12d4f89c'
    ]
};

const checkedData = {
    'eresources': [],
    'publicationTypeValues': [{
            'id': '2c91809c7cbf6bf7017cbf7374a00043',
            'value': 'journal',
            'label': 'Journal'
        },
        {
            'id': '2c91809c7cbf6bf7017cbf73b2760046',
            'value': 'book',
            'label': 'Book'
        },
        {
            'id': '2c91809c7cbf6bf7017cbf78f9400049',
            'value': 'database',
            'label': 'Database'
        }
    ],
    'sourceValues': [{
        'id': '06c037fe-6089-4f65-b74d-dd9b12d4f89c',
        'cursor': '2021-09-14T08:22:05Z',
        'active': true,
        'trustedSourceTI': false,
        'activationEnabled': false,
        'readonly': false,
        'syncStatus': 'idle',
        'lastCheck': 1635327967406,
        'name': 'GOKb_TEST',
        'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
        'fullPrefix': 'gokb',
        'uri': 'https://gokbt.gbv.de/gokb/oai/index',
        'supportsHarvesting': true,
        'rectype': 1
    }],
    'typeValues': [{
            'id': '2c91809c7cbf6bf7017cbf736846003d',
            'value': 'monograph',
            'label': 'Monograph'
        },
        {
            'id': '2c91809c7cbf6bf7017cbf73684b003e',
            'value': 'serial',
            'label': 'Serial'
        }
    ],
    'tagsValues': [{
            'id': '64850ef2-ec9e-44d2-a712-006e194e0e4f',
            'label': 'catalogingrecords',
            'metadata': {
                'createdDate': '2021-10-27T08:05:35.089634Z',
                'createdByUserId': 'a5f1a860-1b6a-5a51-a629-f29f14343099'
            }
        },
        {
            'id': '020d81d8-ec15-4db7-bf3b-49af3aae5ffb',
            'label': 'important',
            'metadata': {
                'createdDate': '2021-10-27T01:52:51.763119Z'
            }
        },
        {
            'id': '6f8a28e3-1d72-4c65-8e35-ec6a61f8b82d',
            'label': 'urgent',
            'description': 'Requires urgent attention',
            'metadata': {
                'createdDate': '2021-10-27T01:52:51.763119Z'
            }
        }
    ]
};



const activeFilters = {};

const data = {
    'eresources': [{
            'id': '748aef4b-aaa4-4185-87aa-b96510a9053d',
            'class': 'org.olf.kb.TitleInstance',
            'name': "\"Institutions, industrial upgrading, and economic performance in Japan: the 'flying-geese' paradigm of catch-up growth\"",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '22fe36fe-13dd-44c0-9012-ab85451d537b',
            'class': 'org.olf.kb.TitleInstance',
            'name': '"Wirtschaftswissenschaft?": [Lujo Brentano zum siebzigsten Geburtstag in alter Verehrung zugeeignet]',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '596beef5-9a94-4808-b01b-daa22df04f35',
            'class': 'org.olf.kb.TitleInstance',
            'name': '#BeWerbung',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '4a2f3358-adff-4ae7-ab4b-2a391ea0850e',
            'class': 'org.olf.kb.TitleInstance',
            'name': '(De)mobilizing the entrepreneurship discourse: exploring entrepreneurial thinking and action',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '02efd7c5-5835-40f2-84a1-99ba4578ae6f',
            'class': 'org.olf.kb.TitleInstance',
            'name': '(In)Security and the Production of International Relations: The Politics of Securitisation in Europe (2015)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'ad0ae3c0-4802-4ca1-928b-9a5eddb5cfbf',
            'class': 'org.olf.kb.TitleInstance',
            'name': '(Re)Imagining Humane Global Governance (2014)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '8123ff37-922f-4625-85cf-8fda3cccda05',
            'class': 'org.olf.kb.TitleInstance',
            'name': '(S)electing the President: The Perils of Democracy (2018)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '27d82ada-a664-463f-8875-b60524bf3bb8',
            'class': 'org.olf.kb.TitleInstance',
            'name': '10 Steps to Repair American Democracy (2012)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'c9a72856-6df7-407d-aece-a17654fad0fa',
            'class': 'org.olf.kb.TitleInstance',
            'name': '100 Questions and Answers to Help You Land Your Dream iOS Job',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'a41db923-bc39-4b5e-80d3-3c5492341a41',
            'class': 'org.olf.kb.TitleInstance',
            'name': '11 September and its Aftermath: The Geopolitics of Terror (2004)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '1aac1e4b-9a64-426c-854f-152f3e3bcfd4',
            'class': 'org.olf.kb.TitleInstance',
            'name': '14th century English mystics newsletter',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f70020", label: "Se…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4ca2fc0043", label: "Jo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'coverage': '[{…}]',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '6a1c2b1f-d9f6-430b-97ef-189c0b96b09e',
            'class': 'org.olf.kb.TitleInstance',
            'name': '180 Keywords Geld- und Währungsrecht',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '2593fd5d-bc46-44df-8b81-1fb4e673050c',
            'class': 'org.olf.kb.TitleInstance',
            'name': '1989 as a Political World Event: Democracy, Europe and the New International System in the Age of Globalization (2014)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '56a1850f-d991-4e91-bbdc-e16d79e40fe7',
            'class': 'org.olf.kb.TitleInstance',
            'name': '19th century music',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f70020", label: "Se…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4ca2fc0043", label: "Jo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'coverage': '[{…}]',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '7f03c3c6-98a7-41c6-af97-b4c21291f88b',
            'class': 'org.olf.kb.TitleInstance',
            'name': '200 Years of Ricardian Trade Theory',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '3b3fef17-6294-44c2-9c07-afd20088f32a',
            'class': 'org.olf.kb.TitleInstance',
            'name': '21st Century Cooperation: Regional Public Goods, Global Governance, and Sustainable Development (2017)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'fc1d8de1-67d0-45ac-8f90-ddf4c97250cc',
            'class': 'org.olf.kb.TitleInstance',
            'name': '21st Century Democracy Promotion in the Americas: Standing up for the Polity (2015)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '22ff13af-eecd-4584-93eb-49c769eeae7d',
            'class': 'org.olf.kb.TitleInstance',
            'name': '21st Century Pedagogy',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f70020", label: "Se…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4ca2fc0043", label: "Jo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'coverage': '[{…}]',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '26799de5-f1e1-4497-9d0d-f601b651e27c',
            'class': 'org.olf.kb.TitleInstance',
            'name': '3 Biotech',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f70020", label: "Se…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4ca2fc0043", label: "Jo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'coverage': '[{…}]',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'ea59fe94-e64b-475b-9312-bfce4196926c',
            'class': 'org.olf.kb.TitleInstance',
            'name': '30 Years of Transition in Europe',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '22acfde5-7e8b-4b9d-9b71-e1b4a88ea28b',
            'class': 'org.olf.kb.TitleInstance',
            'name': '4S review',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f70020", label: "Se…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4ca2fc0043", label: "Jo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'coverage': '[{…}]',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '0e1cd2d5-3d3f-4b13-8a11-873044a13be6',
            'class': 'org.olf.kb.TitleInstance',
            'name': '550 Keywords Bankenaufsichtsrecht',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'eedd4066-c862-4e3c-a736-09e47513bb8e',
            'class': 'org.olf.kb.TitleInstance',
            'name': '5G for Future Wireless Networks',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '6a478eda-5860-40ae-ba43-5abe288e2dd0',
            'class': 'org.olf.kb.TitleInstance',
            'name': '5G for Future Wireless Networks',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '85fc9f48-5826-4a86-8256-eb3485622ee6',
            'class': 'org.olf.kb.TitleInstance',
            'name': '9/11 Ten Years After: Perspectives and Problems (2012)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'a6ea00f4-87e8-4301-a82d-581e376762f9',
            'class': 'org.olf.kb.TitleInstance',
            'name': '9/11 and the Design of Counterterrorism Institutions (2012)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'f6f14f3c-8452-415d-a751-e35221826191',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Beginner's Guide to Scala, Object Orientation and Functional Programming (2nd ed. 2018)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '5d3c4004-d80e-4ea7-a3c9-101ac77e21dd',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Beginners Guide to Python 3 Programming',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'f5abfa13-e4bb-409a-b5d6-150836cfad91',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Bitter Harvest: US Foreign Policy and Afghanistan (2003)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'a7e9234d-1f95-47f6-bcfa-92dc18373e0e',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Brief History of Everything Wireless',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'c4bb9d40-4721-4874-9031-e827d76a5bfe',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Century of Encounters: Writing the Other in Arab North Africa',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '5744f775-4cfa-4aac-b15c-b28fb9d839e0',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Chronology of International Organizations (2008)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '5158f3c5-95f2-4d64-b04a-7b9e883c9c80',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Citizen's Guide to American Foreign Policy: Tragic Choices and the Limits of Rationality (2014)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '9929009c-ab0d-4768-a06f-bed614f7a63e',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Citizen's Guide to Presidential Nominations: The Competition for Leadership (2015)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'f1b0c939-00b1-40cb-8133-d8f869241862',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Citizen's Guide to Terrorism and Counterterrorism (2014)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '28337196-253b-4ffc-b891-466fca83201b',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Citizen's Guide to U.S. Elections: Empowering Democracy in America (2016)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'ecb579bb-4093-460f-afb2-61a02bb8cc1e',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Common Foreign Policy for Europe?: Competing Visions of the CFSP (1999)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '068defb2-cd07-4122-99cb-fb6b4102c915',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Companion to Political Philosophy. Methods, Tools, Topics (2012)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'd568181c-e5a7-4d33-85bd-de1e59739ca5',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Compendium of Armaments and Military Hardware (Routledge Revivals) (1987)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '3f6b6a2f-c164-4a2c-bbba-13ca3ee813b4',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Concise Introduction to Latin American Politics and Development (2. Ed. 2007)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '658516b8-f542-48ec-a90b-fb8267d52af9',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Corporate Form Of Freedom: The Emergence Of The Modern Nonprofit Sector (2001)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'bc2678dd-da21-489b-84c1-d900d2527c85',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Crisis of Global Institutions?: Multilateralism and International Security (2007)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '5535a821-08c2-4939-afdf-eedc98966188',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Crisis of Waste?: Understanding the Rubbish Society (2008)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '4981ef8c-99c8-4b0b-baa5-9d7f6766a84a',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Critical Theory of Counterterrorism: Ontology, Epistemology and Normativity (2018)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'd47db4e0-dce4-4083-9a87-5f9247238aaa',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Cross-Cultural Theory of Voter Behavior (2008)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '8fe4bbc4-dbdc-4543-9d2f-91d43c70773c',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Culture of Its Own: Taking Latin America Seriously (1998)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '15d47c8d-11bf-4905-a244-a10a45e3237a',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Defining Moment: The Presidential Election of 2004: The Presidential Election of 2004 (2005)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '1d25f09c-1460-4315-a713-e6e33fda1229',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Diary of the Euro Crisis in Cyprus',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '400c7e08-6113-40cd-bef0-658b0da626b9',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of Civil Society, Philanthropy and the Third Sector (2005)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '39e4355e-4d78-470d-b05f-5a6d0fc422c2',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of Conservative and Libertarian Thought (Routledge Revivals) (2011)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'c12f7a13-9519-4d92-8943-a56de38a7451',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of Globalization (2008)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '04818d7c-af8c-4b73-9e74-407efb65e985',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of Human Rights (1998)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'cbb88c37-9763-4769-b4c5-7fbdd711756c',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of Human Rights (2. Ed. 2004)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'd23fbaa9-c6d3-4419-bed4-882cb2187df6',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of Modern Politics (2002)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '684eb3e2-44e2-4f5d-b023-1dd413f290d9',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of the European Union (2. Ed. 2004)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'e51cff58-61db-4a99-b0ef-ab555c48be2c',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of the European Union (2002)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '0f4ce7ff-cc6e-4f16-8bc9-7cfa1b4267d1',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of the European Union (7. Ed. 2015)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '069f2520-18f0-4158-b1f5-12c4520ca544',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Dictionary of the European Union (8. Ed. 2017)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '0fc4d030-8e29-47f1-8cdc-6703c2b622ab',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Discourse Analysis of Corruption: Instituting Neoliberalism Against Corruption in Albania, 1998-2005 (2015)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '5253edbf-1d1b-4814-9932-89cfc59b6660',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Fantasy of Reason (1980)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'c9934180-c27b-423c-a587-063e7d032430',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A First Introduction to Quantum Computing and Information',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '1d524c25-59fe-4d94-a585-c0fcbecdd708',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Fourth Way?: Privatization, Property, and the Emergence of New Market Economies (1994)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'c7a8f7ee-9abf-4bb6-a0c0-ae62f744ebdb',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Framework for Survival: Health, Human Rights, and Humanitarian Assistance in Conflicts and Disasters (2. Ed. 1999)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'ad5031c3-595b-4b84-83c2-132932bba3b7',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Futurist's Guide to Emergency Management (2015)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'ca9d60fd-0c1b-4b6f-9624-47a34d7420bf',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Global Political Economy of Democratisation: Beyond the Internal-External Divide (2018)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '70818e98-b92e-423a-a811-1e06549a0252',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Global Security Triangle: European, African and Asian interaction (2010)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '534ad346-8f0b-47a9-858f-7f2a18f29dd3',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Grammar of Politics (Works of Harold J. Laski) (2015)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '8a977a08-9f98-4e43-ab73-5797f9239a1f',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Green Dimension for the European Community: Political Issues and Processes (1993)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'd50f834c-5fe2-49f3-a24c-f84bd44c47f0',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Guide to the Criminal Appeal Act 1995 (1997)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '81ccc2e0-0432-4d6c-91ac-eb864b2ea91c',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Guidebook for Today's Asian Investor",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '878d69bd-4af7-4e2f-b875-e2d1c342f24a',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Handbook of China's International Relations (2010)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'dccb0d2b-0890-40bd-807c-78a140a75349',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of British Actuarial Thought',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'ef474bb2-7936-4145-9613-20a1bbf82ff4',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of Child Welfare (1996)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '7d1181d7-bbac-47fd-a278-801aab081550',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of Greek Political Thought (1967)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '6a2f1e2d-1cd7-462b-af63-288deeb3e88c',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of International Thought: From the Origins of the Modern State to Academic International Relations (2014)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '6f5977c8-1de1-4369-a5cb-61105ce57d3c',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of Political Thought in the 16th Century (1928)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'a9f7f2b6-9cae-4b9b-83bc-9fe80d23494f',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of Socially Responsible Business, c.1600–1950',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'e17e0901-a769-4db5-b1a3-6fb72de875b9',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of Terrorism (2001)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '3b32f418-1540-4277-a8b3-b8504c3b1277',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of Terrorism: Expanded Edition (2016)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'b136367d-36c4-474a-ad50-3054c9781bdb',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of World Order and Resistance: The Making and Unmaking of Global Subjects (2012)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '45582f33-1419-41f0-97e5-ebc02dc855d8',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A History of the Society of Graphical and Allied Trades (1995)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '848a3ed5-ee69-45eb-b479-5a08c1a03fde',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Human Security Doctrine for Europe: Project, Principles, Practicalities (2006)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '7477c0c8-8bc5-4811-a3ae-2cedaeade96c',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Kinder, Gentler Racism?: The Reagan-Bush Civil Rights Legacy (1993)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'af13f5f1-d4ff-4bc2-9b8b-4741eb83eeb7',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Knowledge Representation Practionary',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'ff91e28b-9240-40da-9292-ceda80227f6a',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Legal and Political Interpretation of Articles 224 and 225 of the Treaty of Rome: The Former Yugoslav Republic of Macedonia Cases (1997)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '3f849c87-46df-4a9d-b8c6-bc9b6178ea16',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Life in the Day',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f70020", label: "Se…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4ca2fc0043", label: "Jo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'coverage': '[{…}]',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '49e93155-bb00-4fc6-b950-f5abcb859078',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Model for Islamic Development',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '2b3a0527-a892-40dd-8366-a131def978e4',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Model of Prevention: Life Lessons (2015)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '2886ad2d-9a3e-49b6-8ee8-6e4e3cc994a2',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Modern Guide to Economic Sociology',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'c08a0c08-30cc-4565-ae72-c2d26b720e9d',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Modern Guide to State Intervention',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'd2fd11d3-bb05-4a38-838f-cdaf0db4fd51',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Multi-Industrial Linkages Approach to Cluster Building in East Asia',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '853214a1-4784-448e-aa20-7f093fac37ef',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A National Challenge at the Local Level: Citizens, Elites and Institutions in Reunified Germany (2003)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '758a23b8-9dc3-409e-85e1-a4c22842178f',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A New Construction of Ricardian Theory of International Values',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'dddc2e91-286e-4cd9-a7db-c0dc08a12045',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A New Euro-Mediterranean Cultural Identity (2003)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '3751fa3a-be6b-4722-9dd1-ec9d48d0d3b8',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A New Kind of Computational Biology',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '0152fa56-b82b-4555-a816-96da8f525d54',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A New Perspective on Agglomeration Economies in Japan',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '26d79b31-d759-4b69-8af0-b5029108f6df',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A New Science of International Relations: Modernity, Complexity and the Kosovo Conflict (2010)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '1e5b37c4-2038-483b-b834-c7ae16c0f79d',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A New Trusteeship?: The International Administration of War-torn Territories (2002)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': 'cfdf9401-5679-4b12-b129-eddf3bbb3c6f',
            'class': 'org.olf.kb.TitleInstance',
            'name': 'A Normal Totalitarian Society: How the Soviet Union Functioned and How It Collapsed (2001)',
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        },
        {
            'id': '4926149e-2060-43b3-be96-203739fbe6b8',
            'class': 'org.olf.kb.TitleInstance',
            'name': "A Pact with the Devil: Washington's Bid for World Supremacy and the Betrayal of the American Promise (2007)",
            'suppressFromDiscovery': false,
            'tags': '[]',
            'type': '{id: "2c91809c7cba4524017cba4c99f1001f", label: "Mo…}',
            'publicationType': '{id: "2c91809c7cba4524017cba4cdc830046", label: "Bo…}',
            'subType': '{id: "2c91809c7cba4524017cba4c99e9001d", label: "El…}',
            'customCoverage': false,
            '_object': '{class: "org.olf.kb.TitleInstance", coverage: Array…}'
        }
    ],
    'publicationTypeValues': [{
            'id': '2c91809c7cba4524017cba4ca2fc0043',
            'value': 'journal',
            'label': 'Journal'
        },
        {
            'id': '2c91809c7cba4524017cba4cdc830046',
            'value': 'book',
            'label': 'Book'
        },
        {
            'id': '2c91809c7cba4524017cba5252450049',
            'value': 'database',
            'label': 'Database'
        }
    ],
    'sourceValues': [{
        'id': '94ee72b0-2a67-4ad0-8d1d-1d65beea01f7',
        'cursor': '2021-09-14T08:22:05Z',
        'active': true,
        'trustedSourceTI': false,
        'activationEnabled': false,
        'readonly': false,
        'syncStatus': 'idle',
        'lastCheck': 1635234336444,
        'name': 'GOKb_TEST',
        'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
        'fullPrefix': 'gokb',
        'uri': 'https://gokbt.gbv.de/gokb/oai/index',
        'supportsHarvesting': true,
        'rectype': 1
    }],
    'typeValues': [{
            'id': '2c91809c7cba4524017cba4c99f1001f',
            'value': 'monograph',
            'label': 'Monograph'
        },
        {
            'id': '2c91809c7cba4524017cba4c99f70020',
            'value': 'serial',
            'label': 'Serial'
        }
    ],
    'tagsValues': [{
            'id': 'dc698149-651f-4588-a8b7-edaee781e008',
            'label': 'catalogingrecords',
            'metadata': {
                'createdDate': '2021-10-26T07:22:55.961367Z',
                'createdByUserId': '22b967f7-e12c-5714-a7cc-5d5f56818950'
            }
        },
        {
            'id': '6c296a49-4231-4f85-b6f6-f07e4fb0011f',
            'label': 'important',
            'metadata': {
                'createdDate': '2021-10-26T01:52:23.809974Z'
            }
        },
        {
            'id': '360ef037-c25f-4f97-b789-ee2b0f636ca2',
            'label': 'urgent',
            'description': 'Requires urgent attention',
            'metadata': {
                'createdDate': '2021-10-26T01:52:23.809974Z'
            }
        }
    ]
};
const filterHandlers = {
    state: () => {},
    checkbox: () => {},
    clear: () => {},
    clearGroup: () => {},
    reset: () => {},
};

export {
    checkedActivedFilters,
    checkedData,
    activeFilters,
    data,
    filterHandlers
};
