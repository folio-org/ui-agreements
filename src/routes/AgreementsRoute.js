import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { getSASParams } from '@folio/stripes-erm-components';

import View from '../components/views/Agreements';
import NoPermissions from '../components/NoPermissions';
import { urls } from '../components/utilities';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

class AgreementsRoute extends React.Component {
  static manifest = Object.freeze({
    agreements: {
      type: 'okapi',
      path: 'erm/sas',
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      params: getSASParams({
        searchKey: 'name',
        filterKeys: {
          orgs: 'orgs.org',
          role: 'orgs.role',
          tags: 'tags.value',
        },
      }),
    },
    agreementStatusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/agreementStatus',
      shouldRefresh: () => false,
    },
    renewalPriorityValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/renewalPriority',
      shouldRefresh: () => false,
    },
    isPerpetualValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreement/isPerpetual',
      shouldRefresh: () => false,
    },
    orgRoleValues: {
      type: 'okapi',
      path: 'erm/refdataValues/SubscriptionAgreementOrg/role',
      shouldRefresh: () => false,
    },
    tagsValues: {
      type: 'okapi',
      path: 'tags?limit=100',
      records: 'tags',
    },
    basket: { initialValue: [] },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-agreements.agreements.view'),
    };
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'agreements');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }

    this.props.mutator.basket.replace([
      {
        id: 'bf7007db-eae3-4668-a21b-d906dc322656',
        'class': 'org.olf.kb.PackageContentItem',
        name: '\'14th century English mystics newsletter\' on Platform \'JSTOR\' in Package JSTOR : Arts & Sciences V Collection : NK',
        coverage: [
          {
            id: 'ba9aab23-6d6d-4cc8-9435-3202880a2499',
            startDate: '1974-01-01',
            endDate: '1983-12-31',
            startVolume: '1',
            startIssue: '1',
            endVolume: '9',
            endIssue: '4',
            summary: 'v1/i1/1974-01-01 - v9/i4/1983-12-31'
          }
        ],
        customCoverage: false,
        _object: {
          id: 'bf7007db-eae3-4668-a21b-d906dc322656',
          dateCreated: '2019-06-21T14:46:08Z',
          lastUpdated: '2019-06-21T14:46:08Z',
          depth: 'Fulltext',
          coverage: [
            {
              id: 'ba9aab23-6d6d-4cc8-9435-3202880a2499',
              startDate: '1974-01-01',
              endDate: '1983-12-31',
              startVolume: '1',
              startIssue: '1',
              endVolume: '9',
              endIssue: '4',
              summary: 'v1/i1/1974-01-01 - v9/i4/1983-12-31'
            }
          ],
          pti: {
            id: 'db7339e9-3cc4-47be-9a97-b8dda4e27459',
            dateCreated: '2019-06-21T14:46:08Z',
            lastUpdated: '2019-06-21T14:46:08Z',
            platform: {
              id: 'c9dfa54a-bfa1-4671-9e3b-73c24a924624',
              name: 'JSTOR'
            },
            coverage: [
              {
                id: 'da3f1e15-7e54-413c-bab0-d7fc64df024f',
                startDate: '1974-01-01',
                endDate: '1983-12-31',
                startVolume: '1',
                startIssue: '1',
                endVolume: '9',
                endIssue: '4',
                summary: 'v1/i1/1974-01-01 - v9/i4/1983-12-31'
              }
            ],
            entitlements: [],
            titleInstance: {
              id: '048185bf-b9de-404a-9faf-8998e4a0c3d3',
              subType: {
                id: '1883e41b6b7a7f69016b7a80265d000b',
                value: 'electronic',
                label: 'Electronic'
              },
              dateCreated: '2019-06-21T14:46:08Z',
              lastUpdated: '2019-06-21T14:46:08Z',
              identifiers: [
                {
                  title: {
                    id: '048185bf-b9de-404a-9faf-8998e4a0c3d3'
                  },
                  status: {
                    id: '1883e41b6b7a7f69016b7a80329b002e',
                    value: 'approved',
                    label: 'Approved'
                  },
                  identifier: {
                    value: '2581465-5',
                    ns: {
                      value: 'zdb'
                    }
                  }
                },
                {
                  title: {
                    id: '048185bf-b9de-404a-9faf-8998e4a0c3d3'
                  },
                  status: {
                    id: '1883e41b6b7a7f69016b7a80329b002e',
                    value: 'approved',
                    label: 'Approved'
                  },
                  identifier: {
                    value: '148228',
                    ns: {
                      value: 'ezb'
                    }
                  }
                }
              ],
              coverage: [
                {
                  id: '066fa94b-d9f7-4f06-b10f-6a8ae0a78428'
                }
              ],
              name: '14th century English mystics newsletter',
              type: {
                id: '1883e41b6b7a7f69016b7a80266c000d',
                value: 'journal',
                label: 'Journal'
              },
              work: {
                id: '63286160-9df4-442e-9e6f-9d659e075296'
              },
              platformInstances: [
                {
                  id: 'db7339e9-3cc4-47be-9a97-b8dda4e27459'
                }
              ]
            },
            url: 'http://www.jstor.org/action/showPublication?journalCode=14centengmystnew',
            name: '\'14th century English mystics newsletter\' on Platform \'JSTOR\'',
            packageOccurences: [
              {
                id: 'bf7007db-eae3-4668-a21b-d906dc322656'
              }
            ]
          },
          pkg: {
            id: 'f6ab5609-ec44-49b6-8fe4-faf3610b608a',
            dateCreated: '2019-06-21T14:46:08Z',
            lastUpdated: '2019-06-21T14:46:08Z',
            vendor: {
              id: '7156b9a2-f367-4558-a1f0-4cdddcac70c5',
              name: 'JSTOR',
              orgsUuid_object: {
                error: 400,
                message: 'Bad Request'
              }
            },
            coverage: [],
            source: 'GOKb',
            remoteKb: {
              id: '919e1c91-d726-4967-96ad-d2fc00c1e8b2',
              cursor: '2019-06-14T06:50:44-0400',
              active: true,
              activationEnabled: false,
              name: 'GOKb_TEST',
              type: 'org.olf.kb.adapters.GOKbOAIAdapter',
              fullPrefix: 'gokb',
              uri: 'http://gokbt.gbv.de/gokb/oai/index/packages',
              supportsHarvesting: true,
              rectype: 1
            },
            entitlements: [
              {
                id: '9031b9f2-0e4c-4757-8c68-ea2073994307'
              }
            ],
            name: 'JSTOR : Arts & Sciences V Collection : NK',
            reference: 'JSTOR_:_Arts_&_Sciences_V_Collection_:_NK'
          },
          addedTimestamp: 1561128368252,
          entitlements: [
            {
              id: 'f0916bf6-8be1-4db0-bb30-aaec5eff3b5c'
            }
          ],
          name: '\'14th century English mystics newsletter\' on Platform \'JSTOR\' in Package JSTOR : Arts & Sciences V Collection : NK',
          lastSeenTimestamp: 1561128368252
        },
        rowIndex: 1
      },
      {
        id: 'f6ab5609-ec44-49b6-8fe4-faf3610b608a',
        'class': 'org.olf.kb.Pkg',
        name: 'JSTOR : Arts & Sciences V Collection : NK',
        customCoverage: false,
        _object: {
          id: 'f6ab5609-ec44-49b6-8fe4-faf3610b608a',
          dateCreated: '2019-06-21T14:46:08Z',
          lastUpdated: '2019-06-21T14:46:08Z',
          vendor: {
            id: '7156b9a2-f367-4558-a1f0-4cdddcac70c5',
            name: 'JSTOR',
            orgsUuid_object: {
              error: 400,
              message: 'Bad Request'
            }
          },
          coverage: [],
          source: 'GOKb',
          remoteKb: {
            id: '919e1c91-d726-4967-96ad-d2fc00c1e8b2',
            cursor: '2019-06-14T06:50:44-0400',
            active: true,
            activationEnabled: false,
            name: 'GOKb_TEST',
            type: 'org.olf.kb.adapters.GOKbOAIAdapter',
            fullPrefix: 'gokb',
            uri: 'http://gokbt.gbv.de/gokb/oai/index/packages',
            supportsHarvesting: true,
            rectype: 1
          },
          entitlements: [
            {
              id: '9031b9f2-0e4c-4757-8c68-ea2073994307'
            }
          ],
          name: 'JSTOR : Arts & Sciences V Collection : NK',
          reference: 'JSTOR_:_Arts_&_Sciences_V_Collection_:_NK'
        },
        rowIndex: 0
      },
      {
        id: 'ebde4749-6b94-45db-924f-b3ceea04f15b',
        'class': 'org.olf.kb.PackageContentItem',
        name: '\'19th century music\' on Platform \'JSTOR\' in Package JSTOR : Arts & Sciences III Collection : NK',
        coverage: [
          {
            id: 'cd619a1a-9ca9-4010-b815-e326b146fbfc',
            startDate: '1977-01-01',
            startVolume: '1',
            startIssue: '1',
            summary: 'v1/i1/1977-01-01 - v*/i*/*'
          }
        ],
        customCoverage: false,
        _object: {
          id: 'ebde4749-6b94-45db-924f-b3ceea04f15b',
          dateCreated: '2019-06-21T14:46:59Z',
          lastUpdated: '2019-06-21T14:46:59Z',
          depth: 'Fulltext',
          coverage: [
            {
              id: 'cd619a1a-9ca9-4010-b815-e326b146fbfc',
              startDate: '1977-01-01',
              startVolume: '1',
              startIssue: '1',
              summary: 'v1/i1/1977-01-01 - v*/i*/*'
            }
          ],
          pti: {
            id: '818e4f78-a0ac-4418-8fdd-93133b1ff4ac',
            dateCreated: '2019-06-21T14:46:59Z',
            lastUpdated: '2019-06-21T14:46:59Z',
            platform: {
              id: 'c9dfa54a-bfa1-4671-9e3b-73c24a924624',
              name: 'JSTOR'
            },
            coverage: [
              {
                id: 'da98ebd3-a06a-451e-89ce-acb0efb19ab8',
                startDate: '1977-01-01',
                startVolume: '1',
                startIssue: '1',
                summary: 'v1/i1/1977-01-01 - v*/i*/*'
              }
            ],
            entitlements: [],
            titleInstance: {
              id: '2472d3d5-3c37-44dd-bf63-5df783ce91c6',
              subType: {
                id: '1883e41b6b7a7f69016b7a80265d000b',
                value: 'electronic',
                label: 'Electronic'
              },
              dateCreated: '2019-06-21T14:46:59Z',
              lastUpdated: '2019-06-21T14:46:59Z',
              identifiers: [
                {
                  title: {
                    id: '2472d3d5-3c37-44dd-bf63-5df783ce91c6'
                  },
                  status: {
                    id: '1883e41b6b7a7f69016b7a80329b002e',
                    value: 'approved',
                    label: 'Approved'
                  },
                  identifier: {
                    value: '1533-8606',
                    ns: {
                      value: 'eissn'
                    }
                  }
                },
                {
                  title: {
                    id: '2472d3d5-3c37-44dd-bf63-5df783ce91c6'
                  },
                  status: {
                    id: '1883e41b6b7a7f69016b7a80329b002e',
                    value: 'approved',
                    label: 'Approved'
                  },
                  identifier: {
                    value: '38504',
                    ns: {
                      value: 'ezb'
                    }
                  }
                },
                {
                  title: {
                    id: '2472d3d5-3c37-44dd-bf63-5df783ce91c6'
                  },
                  status: {
                    id: '1883e41b6b7a7f69016b7a80329b002e',
                    value: 'approved',
                    label: 'Approved'
                  },
                  identifier: {
                    value: '2052442-0',
                    ns: {
                      value: 'zdb'
                    }
                  }
                }
              ],
              coverage: [
                {
                  id: 'a9f61d0f-ab2d-4336-a1a2-3097d2d12222'
                }
              ],
              name: '19th century music',
              type: {
                id: '1883e41b6b7a7f69016b7a80266c000d',
                value: 'journal',
                label: 'Journal'
              },
              work: {
                id: '654889cd-4bbc-4a20-a056-dadd6fd602f9'
              },
              platformInstances: [
                {
                  id: '818e4f78-a0ac-4418-8fdd-93133b1ff4ac'
                }
              ]
            },
            url: 'http://www.jstor.org/action/showPublication?journalCode=19thcenturymusic',
            name: '\'19th century music\' on Platform \'JSTOR\'',
            packageOccurences: [
              {
                id: 'ebde4749-6b94-45db-924f-b3ceea04f15b'
              }
            ]
          },
          pkg: {
            id: '7f5dbf37-4bf6-4733-8607-a9a57884a2d9',
            dateCreated: '2019-06-21T14:46:59Z',
            lastUpdated: '2019-06-21T14:46:59Z',
            vendor: {
              id: '7156b9a2-f367-4558-a1f0-4cdddcac70c5',
              name: 'JSTOR',
              orgsUuid_object: {
                error: 400,
                message: 'Bad Request'
              }
            },
            coverage: [],
            source: 'GOKb',
            remoteKb: {
              id: '919e1c91-d726-4967-96ad-d2fc00c1e8b2',
              cursor: '2019-06-14T06:50:44-0400',
              active: true,
              activationEnabled: false,
              name: 'GOKb_TEST',
              type: 'org.olf.kb.adapters.GOKbOAIAdapter',
              fullPrefix: 'gokb',
              uri: 'http://gokbt.gbv.de/gokb/oai/index/packages',
              supportsHarvesting: true,
              rectype: 1
            },
            entitlements: [],
            name: 'JSTOR : Arts & Sciences III Collection : NK',
            reference: 'JSTOR_:_Arts_&_Sciences_III_Collection_:_NK'
          },
          addedTimestamp: 1561128419597,
          entitlements: [],
          name: '\'19th century music\' on Platform \'JSTOR\' in Package JSTOR : Arts & Sciences III Collection : NK',
          lastSeenTimestamp: 1561128419597
        },
        rowIndex: 0
      },
      {
        id: '3dae17c6-912c-4b66-bb7c-dcf06f115d4f',
        'class': 'org.olf.kb.PackageContentItem',
        name: '\'21 for 21\' on Platform \'Emerald Insight\' in Package Emerald Business Management and Economics Purchase',
        customCoverage: false,
        _object: {
          id: '3dae17c6-912c-4b66-bb7c-dcf06f115d4f',
          dateCreated: '2019-06-21T14:48:28Z',
          lastUpdated: '2019-06-21T14:48:28Z',
          depth: 'Fulltext',
          coverage: [],
          pti: {
            id: '8435dab0-a25e-488d-acc3-87511b6fd3ec',
            dateCreated: '2019-06-21T14:48:28Z',
            lastUpdated: '2019-06-21T14:48:28Z',
            platform: {
              id: '0da6d1d2-59b3-4163-a9f1-0f81659dd9c6',
              name: 'Emerald Insight'
            },
            coverage: [],
            entitlements: [],
            titleInstance: {
              id: '44d5799a-c5d0-45bb-ac3e-92d27e8e59d0',
              subType: {
                id: '1883e41b6b7a7f69016b7a80265d000b',
                value: 'electronic',
                label: 'Electronic'
              },
              dateCreated: '2019-06-21T14:48:28Z',
              lastUpdated: '2019-06-21T14:48:28Z',
              identifiers: [
                {
                  title: {
                    id: '44d5799a-c5d0-45bb-ac3e-92d27e8e59d0'
                  },
                  status: {
                    id: '1883e41b6b7a7f69016b7a80329b002e',
                    value: 'approved',
                    label: 'Approved'
                  },
                  identifier: {
                    value: '10.1108/9781787437876',
                    ns: {
                      value: 'doi'
                    }
                  }
                },
                {
                  title: {
                    id: '44d5799a-c5d0-45bb-ac3e-92d27e8e59d0'
                  },
                  status: {
                    id: '1883e41b6b7a7f69016b7a80329b002e',
                    value: 'approved',
                    label: 'Approved'
                  },
                  identifier: {
                    value: '978-1-78743-787-6',
                    ns: {
                      value: 'isbn'
                    }
                  }
                }
              ],
              coverage: [],
              name: '21 for 21',
              type: {
                id: '1883e41b6b7a7f69016b7a802676000e',
                value: 'book',
                label: 'Book'
              },
              work: {
                id: '0373f9d5-7bc2-4457-b1f0-75e927f9872a'
              },
              platformInstances: [
                {
                  id: '8435dab0-a25e-488d-acc3-87511b6fd3ec'
                }
              ]
            },
            url: 'https://www.emeraldinsight.com/doi/book/10.1108/9781787437876',
            name: '\'21 for 21\' on Platform \'Emerald Insight\'',
            packageOccurences: [
              {
                id: '3dae17c6-912c-4b66-bb7c-dcf06f115d4f'
              }
            ]
          },
          pkg: {
            id: '26c1ac6f-12f4-4b36-b9eb-0e0f07d07176',
            dateCreated: '2019-06-21T14:48:28Z',
            lastUpdated: '2019-06-21T14:48:28Z',
            vendor: {
              id: '9371331f-01e9-4f49-be39-06ea5fac24b6',
              name: 'Emerald',
              orgsUuid_object: {
                error: 400,
                message: 'Bad Request'
              }
            },
            coverage: [],
            source: 'GOKb',
            remoteKb: {
              id: '919e1c91-d726-4967-96ad-d2fc00c1e8b2',
              cursor: '2019-06-14T06:50:44-0400',
              active: true,
              activationEnabled: false,
              name: 'GOKb_TEST',
              type: 'org.olf.kb.adapters.GOKbOAIAdapter',
              fullPrefix: 'gokb',
              uri: 'http://gokbt.gbv.de/gokb/oai/index/packages',
              supportsHarvesting: true,
              rectype: 1
            },
            entitlements: [],
            name: 'Emerald Business Management and Economics Purchase',
            reference: 'Emerald_Business_Management_and_Economics_Purchase'
          },
          addedTimestamp: 1561128508587,
          entitlements: [],
          name: '\'21 for 21\' on Platform \'Emerald Insight\' in Package Emerald Business Management and Economics Purchase',
          lastSeenTimestamp: 1561128508587
        },
        rowIndex: 0
      }
    ]);

  }

  componentDidUpdate(prevProps) {
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'agreements');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`${urls.agreementView(record.id)}${location.search}`);
      }
    }
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  }

  querySetter = ({ nsValues, state }) => {
    const defaults = {
      filters: null,
      query: null,
      sort: null,
    };

    if (/reset/.test(state.changeType)) {
      // A mutator's `replace()` function doesn't update the URL of the page. As a result,
      // we always use `update()` but fully specify the values we want to null out.
      this.props.mutator.query.update({ ...defaults, ...nsValues });
    } else {
      this.props.mutator.query.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  render() {
    const { children, location, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'agreements');
    }

    if (!this.state.hasPerms) return <NoPermissions />;

    return (
      <View
        data={{
          agreements: get(resources, 'agreements.records', []),
          agreementStatusValues: get(resources, 'agreementStatusValues.records', []),
          renewalPriorityValues: get(resources, 'renewalPriorityValues.records', []),
          isPerpetualValues: get(resources, 'isPerpetualValues.records', []),
          orgRoleValues: get(resources, 'orgRoleValues.records', []),
          tags: get(resources, 'tags.records', []),
        }}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        source={this.source}
      >
        {children}
      </View>
    );
  }
}

export default stripesConnect(AgreementsRoute);
