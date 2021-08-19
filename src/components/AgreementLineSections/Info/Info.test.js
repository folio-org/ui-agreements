import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import Info from './Info';

const isSuppressFromDiscoveryEnabled = { 'isSuppressFromDiscoveryEnabled': 'ƒ () {}' };
    const line = {
          'id': '5a1bb143-5d3b-4668-ae43-bcb564c0fe8a',
          'type': 'external',
          'description': 'Description for agreement line section.',
          'authority': 'EKB-PACKAGE',
          'reference': '72-6052',
          'explanation': null,
          'startDate': '2021-08-04',
          'endDate': '2021-08-30',
          'activeFrom': '2021-08-04',
          'activeTo': '2021-08-30',
          'contentUpdated': null,
          'haveAccess': true,
          'suppressFromDiscovery': true,
          'note': 'Note for agreement line section.',
          'tags': '[]',
          'owner': {
            'id': '146e869e-540c-4dd2-96a0-0069a3e5a520',
            'cancellationDeadline': '2021-08-28',
            'dateCreated': '2021-08-19T12:18:26Z',
            'isPerpetual': {
              'id': '2c91809c7b5c1612017b5c1d3305002f',
              'value': 'yes',
              'label': 'Yes'
            },
            'name': 'MR Test Form Info',
            'orgs': [],
            'licenseNote': 'general note test',
            'externalLicenseDocs': [],
            'outwardRelationships': [],
            'customProperties': {},
            'contacts': [
              {
                'id': '64d4eb51-9a45-43f8-b1d3-0080885302f9',
                'owner': {
                  'id': '146e869e-540c-4dd2-96a0-0069a3e5a520'
                },
                'role': {
                  'id': '2c91809c7b5c1612017b5c1d32fb002c',
                  'value': 'erm_librarian',
                  'label': 'ERM librarian'
                },
                'user': '75bc3af6-39a9-5312-b9f3-8ed1043efe3a'
              }
            ],
            'tags': [],
            'lastUpdated': '2021-08-19T12:18:26Z',
            'inwardRelationships': [],
            'renewalPriority': {
              'id': '2c91809c7b5c1612017b5c1d33220036',
              'value': 'definitely_renew',
              'label': 'Definitely renew'
            },
            'endDate': '2021-08-31',
            'startDate': '2021-08-01',
            'linkedLicenses': [],
            'docs': [],
            'periods': [
              {
                'id': '2df9d356-02f6-43e2-a680-6d2cfc9cc2c4',
                'startDate': '2021-08-01',
                'cancellationDeadline': '2021-08-28',
                'owner': {
                  'id': '146e869e-540c-4dd2-96a0-0069a3e5a520'
                },
                'note': 'This is note test.',
                'endDate': '2021-08-31',
                'periodStatus': 'current'
              }
            ],
            'usageDataProviders': [],
            'agreementStatus': {
              'id': '2c91809c7b5c1612017b5c1d335e003f',
              'value': 'active',
              'label': 'Active'
            },
            'supplementaryDocs': [],
            'description': 'This is description',
            'items': [
              '{id: "5a1bb143-5d3b-4668-ae43-bcb564c0fe8a"}'
            ],
            'alternateNames': [
              {
                'id': '1f616afb-5b52-40ec-8887-cb45e03742c1',
                'owner': {
                  'id': '146e869e-540c-4dd2-96a0-0069a3e5a520'
                },
                'name': 'Form Info'
              }
            ]
          },
          'customCoverage': false,
          'reference_object': {
            'label': 'Early American Imprints, Series I: Evans Supplement, 1652-1800',
            'type': 'Package',
            'provider': 'NewsBank',
            'titleCount': 1,
            'selectedCount': 1,
            'contentType': 'Abstract and Index',
            'providerName': 'NewsBank',
            'isSelected': true
          },
          'poLines': '[]'
        };
        const resource = {
          'id': '5a1bb143-5d3b-4668-ae43-bcb564c0fe8a',
          'type': 'external',
          'description': 'Description for agreement line section.',
          'authority': 'EKB-PACKAGE',
          'reference': '72-6052',
          'explanation': null,
          'startDate': '2021-08-04',
          'endDate': '2021-08-30',
          'activeFrom': '2021-08-04',
          'activeTo': '2021-08-30',
          'contentUpdated': null,
          'haveAccess': true,
          'suppressFromDiscovery': true,
          'note': 'Note for agreement line section.',
          'tags': '[]',
          'owner': {
            'id': '146e869e-540c-4dd2-96a0-0069a3e5a520',
            'cancellationDeadline': '2021-08-28',
            'dateCreated': '2021-08-19T12:18:26Z',
            'isPerpetual': {
              'id': '2c91809c7b5c1612017b5c1d3305002f',
              'value': 'yes',
              'label': 'Yes'
            },
            'name': 'MR Test Form Info',
            'orgs': [],
            'licenseNote': 'general note test',
            'externalLicenseDocs': [],
            'outwardRelationships': [],
            'customProperties': {},
            'contacts': [
              {
                'id': '64d4eb51-9a45-43f8-b1d3-0080885302f9',
                'owner': {
                  'id': '146e869e-540c-4dd2-96a0-0069a3e5a520'
                },
                'role': {
                  'id': '2c91809c7b5c1612017b5c1d32fb002c',
                  'value': 'erm_librarian',
                  'label': 'ERM librarian'
                },
                'user': '75bc3af6-39a9-5312-b9f3-8ed1043efe3a'
              }
            ],
            'tags': [],
            'lastUpdated': '2021-08-19T12:18:26Z',
            'inwardRelationships': [],
            'renewalPriority': {
              'id': '2c91809c7b5c1612017b5c1d33220036',
              'value': 'definitely_renew',
              'label': 'Definitely renew'
            },
            'endDate': '2021-08-31',
            'startDate': '2021-08-01',
            'linkedLicenses': [],
            'docs': [],
            'periods': [
              {
                'id': '2df9d356-02f6-43e2-a680-6d2cfc9cc2c4',
                'startDate': '2021-08-01',
                'cancellationDeadline': '2021-08-28',
                'owner': {
                  'id': '146e869e-540c-4dd2-96a0-0069a3e5a520'
                },
                'note': 'This is note test.',
                'endDate': '2021-08-31',
                'periodStatus': 'current'
              }
            ],
            'usageDataProviders': [],
            'agreementStatus': {
              'id': '2c91809c7b5c1612017b5c1d335e003f',
              'value': 'active',
              'label': 'Active'
            },
            'supplementaryDocs': [],
            'description': 'This is description',
            'items': [
              {
                'id': '5a1bb143-5d3b-4668-ae43-bcb564c0fe8a'
              }
            ],
            'alternateNames': [
              {
                'id': '1f616afb-5b52-40ec-8887-cb45e03742c1',
                'owner': {
                  'id': '146e869e-540c-4dd2-96a0-0069a3e5a520'
                },
                'name': 'Form Info'
              }
            ]
          },
          'customCoverage': false,
          'reference_object': {
            'label': 'Early American Imprints, Series I: Evans Supplement, 1652-1800',
            'type': 'Package',
            'provider': 'NewsBank',
            'titleCount': 1,
            'selectedCount': 1,
            'contentType': 'Abstract and Index',
            'providerName': 'NewsBank',
            'isSelected': true
          },
          'poLines': '[]'
      };

      let renderComponent;

      describe('Info', () => {
        beforeEach(() => {
          renderComponent = renderWithIntl(
            <Router>
              <Info
                id="lineInfo"
                isSuppressFromDiscoveryEnabled={isSuppressFromDiscoveryEnabled}
                line={line}
                resource={resource}
              />
            </Router>,
            translationsProperties
          );
        });
        test('displays agreement line name', async () => {
          const { getByTestId } = renderComponent;
          expect(getByTestId(isSuppressFromDiscoveryEnabled)).toBeInTheDocument();
        });

        test('displays parent agreements name', async () => {
          await KeyValue('Parent agreement').has({ value: 'MR Test Form Info' });
        });

          test('displays parent agreement activeFrom date', async () => {
            await KeyValue('Active from').has({ value: '2021-08-04' });
          });

          test('displays parent agreement activeTo date', async () => {
            await KeyValue('Active to').has({ value: '2021-08-30' });
          });

          test('displays parent agreement suppressFromDiscovery', async () => {
            await KeyValue('Suppress from discovery').has({ value: true });
          });

          test('dispalys parent agreement note', async () => {
            await KeyValue('Note').has({ value: 'Note for agreement line section.' });
          });

          test('dispalys parent agreement description', async () => {
            await KeyValue('Description').has({ value: 'Description for agreement line section.' });
          });
    });
