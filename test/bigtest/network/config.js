// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
import { get, isEmpty } from 'lodash';
import { faker } from '@bigtest/mirage';
import parseQueryString from './util';

const getItems = (schema, request, recordName) => {
  const queryString = request.url.split('?')[1];
  const params = parseQueryString(queryString);
  let { filters } = params;
  // when there is only one filter and its not an array
  if (filters && !isEmpty(filters) && !Array.isArray(filters)) filters = [filters];

  // returns a flattened array of { name, value } pairs of filter name and its value
  const parsed = filters && filters.map((filter) => {
    return filter.split('||').map(f => {
      const [name, value] = f.split('==');
      return { name, value };
    });
  }).flat();

  let results;
  if (parsed) {
    results = schema[recordName].where(record => {
      return parsed.reduce((acc, { name, value }) => {
        return acc || get(record, name) === value;
      }, false);
    }).models;
  } else {
    results = schema[recordName].all().models;
  }

  return { results, totalRecords: results.length };
};

export default function config() {
  this.get('/configurations/entries', {
    configs: []
  });

  this.get('/erm/resource/electronic', (schema, request) => {
    return getItems(schema, request, 'eresources');
  });

  this.get('/erm/resource/:id', (schema, request) => {
    return schema.eresources.find(request.params.id).attrs;
  });

  this.get('/erm/kbs', () => []);

  this.get('/erm/resource/:id/entitlementOptions', () => []);

  this.get('/erm/custprops', () => []);

  this.get('/erm/resource/:id/entitlements/related', () => ({ results: [] }));

  this.get('/erm/resource/:id/entitlements', () => ({ results: [] }));

  this.get('/erm/resource/:id/related', () => ({ results: [] }));

  this.get('/erm/packages/:id/content/current', (schema) => ({
    results: schema.pcis.where(pci => new Date(pci.accessStart).getTime() < new Date().getTime() && new Date(pci.accessEnd).getTime() > new Date().getTime()).models,
  }));

  this.get('/erm/packages/:id/content/future', (schema) => ({
    results: schema.pcis.where(pci => !pci.accessEnd && new Date(pci.accessStart).getTime() > new Date().getTime()).models,
  }));

  this.get('/erm/packages/:id/content/dropped', (schema) => ({
    results: schema.pcis.where(pci => !pci.accessStart && new Date(pci.accessEnd).getTime() < new Date().getTime()).models,
  }));

  this.get('/note-links/domain/agreements/type/eresource/id/:id', () => []);

  this.get('/erm/sas', (schema, request) => {
    return getItems(schema, request, 'agreements');
  });

  this.post('erm/sas', (_, request) => {
    const body = JSON.parse(request.requestBody);
    return this.create('agreement', body).attrs;
  });

  this.get('/erm/sas/:id', (schema, request) => {
    return schema.agreements.find(request.params.id);
  });

  const getAgreementCoveredResources = (schema, request, shouldInclude) => {
    const agreement = schema.agreements.find(request.params.id).attrs;
    if (!agreement.items) return { results: [] };
    const itemIds = agreement.items.map(item => item.resource.id);
    const resources = schema.pcis.all().models.filter(pci => itemIds.includes(pci.pkg.id) && shouldInclude(pci));

    return {
      results: resources.map(resource => ({
        class: 'org.olf.kb.PackageContentItem',
        coverage: [],
        customCoverage: false,
        id: resource.id,
        _object: resource
      }))
    };
  };

  this.get('/erm/sas/:id/resources', (schema, request) => {
    return getAgreementCoveredResources(schema, request, () => true);
  });

  this.get('/erm/sas/:id/resources/current', (schema, request) => {
    return getAgreementCoveredResources(schema, request, pci => (new Date(pci.accessStart).getTime() < new Date().getTime() && new Date(pci.accessEnd).getTime() > new Date().getTime()));
  });

  this.get('/erm/sas/:id/resources/future', (schema, request) => {
    return getAgreementCoveredResources(schema, request, pci => (new Date(pci.accessStart).getTime() > new Date().getTime()));
  });

  this.get('/erm/sas/:id/resources/dropped', (schema, request) => {
    return getAgreementCoveredResources(schema, request, pci => (new Date(pci.accessEnd).getTime() < new Date().getTime()));
  });

  this.get('/erm/entitlements', (schema, request) => {
    return getItems(schema, request, 'agreementLines');
  });

  this.get('/erm/contacts', { results: [] });

  this.get('/erm/org', () => []);

  this.get('/note-links/domain/agreements/type/agreement/id/:id', () => { });

  this.get('/note-types', () => { });

  this.get('/erm/refdata', ({ pickLists }) => {
    return pickLists.all().models;
  });

  this.get('/erm/refdata/:id', (schema, request) => {
    return (request.params.id !== 'undefined') && schema.pickLists.find(request.params.id).attrs;
  });

  this.get('/orders/order-lines', (schema, request) => {
    // query will look something like `id==123 or id==456`
    const { query } = request.queryParams;

    if (!query) return { poLines: [], totalRecords: 0 };

    const poLineIds = query.split(' or ')
      .map(idEquality => idEquality.substring('id=='.length)); // strip leading `id==`

    const { number, words } = faker.random;

    return {
      poLines: poLineIds.map(id => ({
        id,
        acquisitionMethod: faker.finance.transactionType(),
        poLineNumber: `${number()}-${number()}`,
        title: words(),
      })),
      totalRecords: poLineIds.length,
    };
  });

  this.get('/licenses/custprops', () => []);

  this.get('/tags', { tags: [] });

  this.get('/erm/refdata/TitleInstance/type', () => {
    return [
      { 'id': '188389636d9ece46016d9ed0184b0027', 'value': 'journal', 'label': 'Journal' },
      { 'id': '188389636d9ece46016d9ed018550028', 'value': 'book', 'label': 'Book' }
    ];
  });

  this.get('/erm/refdata/SubscriptionAgreement/agreementStatus', () => {
    return [
      { 'id': '188389636d9ece46016d9ed0177f0010', 'value': 'draft', 'label': 'Draft' },
      { 'id': '188389636d9ece46016d9ed017880011', 'value': 'requested', 'label': 'Requested' },
      { 'id': '188389636d9ece46016d9ed0179a0012', 'value': 'in_negotiation', 'label': 'In negotiation' },
      { 'id': '188389636d9ece46016d9ed017b30014', 'value': 'active', 'label': 'Active' },
      { 'id': '3ce500b0ab45998006d16bbd3361b9bc', 'value': 'closed', 'label': 'Closed' }];
  });

  this.get('/erm/refdata/SubscriptionAgreement/reasonForClosure', () => {
    return [
      { 'id': 'df1c93f9c99b26bc99a5a9d72b40a1a5', 'value': 'rejected', 'label': 'Rejected' },
      { 'id': '188389636db6c763016db6ca076e0000', 'value': 'cancelled', 'label': 'Cancelled' },
      { 'id': '188389636db6c763016db6ca07820001', 'value': 'ceased', 'label': 'Ceased' },
      { 'id': '188389636db6c763016db6ca07900002', 'value': 'superseded', 'label': 'Superseded' }];
  });

  this.get('/erm/refdata/LicenseAmendmentStatus/status', () => {
    return [
      { 'id': '188389636d9ece46016d9ed018bd0033', 'value': 'current', 'label': 'Current' },
      { 'id': '188389636d9ece46016d9ed018ca0034', 'value': 'future', 'label': 'Future' },
      { 'id': '188389636d9ece46016d9ed018d30035', 'value': 'historical', 'label': 'Historical' },
      { 'id': '188389636d9ece46016d9ed018dc0036', 'value': 'does_not_apply', 'label': 'Does not apply' }];
  });

  this.get('/erm/refdata/InternalContact/role', () => {
    return [
      { 'id': '188389636d9ece46016d9ed0180c001f', 'value': 'agreement_owner', 'label': 'Agreement owner' },
      { 'id': '188389636d9ece46016d9ed018160020', 'value': 'authorized_signatory', 'label': 'Authorized signatory' },
      { 'id': '188389636d9ece46016d9ed018200021', 'value': 'erm_librarian', 'label': 'ERM librarian' },
      { 'id': '188389636d9ece46016d9ed018280022', 'value': 'subject_specialist', 'label': 'Subject specialist' }];
  });

  this.get('/erm/refdata/SubscriptionAgreement/isPerpetual', () => {
    return [
      { 'id': '188389636d9ece46016d9ed01759000d', 'value': 'yes', 'label': 'Yes' },
      { 'id': '188389636d9ece46016d9ed01766000e', 'value': 'no', 'label': 'No' }
    ];
  });

  this.get('/erm/refdata/RemoteLicenseLink/status', () => {
    return [
      { 'id': '188389636d9ece46016d9ed017ed001b', 'value': 'controlling', 'label': 'Controlling' },
      { 'id': '188389636d9ece46016d9ed017f4001c', 'value': 'future', 'label': 'Future' },
      { 'id': '188389636d9ece46016d9ed017fc001d', 'value': 'historical', 'label': 'Historical' }
    ];
  });

  this.get('/erm/refdata/SubscriptionAgreementOrg/role', () => {
    return [
      { 'id': '188389636d9ece46016d9ed018ee0038', 'value': 'content_provider', 'label': 'Content Provider' },
      { 'id': '188389636d9ece46016d9ed018f60039', 'value': 'subscription_agent', 'label': 'Subscription Agent' },
      { 'id': '188389636d9ece46016d9ed018fd003a', 'value': 'vendor', 'label': 'Vendor' }
    ];
  });

  this.get('/erm/refdata/SubscriptionAgreement/renewalPriority', () => {
    return [
      { 'id': '188389636d9ece46016d9ed017290009', 'value': 'definitely_renew', 'label': 'Definitely renew' },
      { 'id': '188389636d9ece46016d9ed01735000a', 'value': 'for_review', 'label': 'For review' },
      { 'id': '188389636d9ece46016d9ed01745000b', 'value': 'definitely_cancel', 'label': 'Definitely cancel' }
    ];
  });

  this.get('/erm/refdata/DocumentAttachment/atType', () => ([
    { 'id': '18836ea8717e097901717e1c09370027', 'value': 'license', 'label': 'License' },
    { 'id': '18836ea8717e097901717e1c093d0028', 'value': 'misc', 'label': 'Misc' },
    { 'id': '18836ea8717e097901717e1c09440029', 'value': 'consortium_negotiation_document', 'label': 'Consortium negotiation document' },
  ]));

  this.get('/users', (schema) => {
    const users = schema.contacts.all().models;

    return {
      users,
      totalRecords: users.length,
    };
  });

  this.get('note-links/domain/agreements/type/agreement/id/:id', () => { });

  this.post('erm/sas/:id/clone', (schema, request) => {
    const agreement = schema.agreements.find(request.params.id);

    if (request.requestBody.internalContacts === false) {
      return this.create('agreement', { name: agreement.name });
    }

    const agreementData = {
      name: agreement.name,
      internalContactData: agreement.internalContactData
    };

    return this.create('agreement', 'withContacts', agreementData);
  });

  this.get('/_/proxy/tenants/diku/modules', () => [{
    'id' : 'edge-oai-pmh-2.2.0-SNAPSHOT.33',
    'name' : 'OAI-PMH Edge API',
    'requires' : [{
      'id' : 'oai-pmh',
      'version' : '1.1 2.0'
    }, {
      'id' : 'login',
      'version' : '5.0 6.0'
    }],
    'provides' : [],
    'permissionSets' : [],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/edge-oai-pmh:2.2.0-SNAPSHOT.33',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 268435456
        }
      }
    }
  }, {
    'id' : 'edge-orders-2.2.0-SNAPSHOT.34',
    'name' : 'Acquisitions - Orders Edge API',
    'requires' : [{
      'id' : 'gobi',
      'version' : '1.8'
    }, {
      'id' : 'login',
      'version' : '5.0 6.0'
    }],
    'provides' : [],
    'permissionSets' : [],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/edge-orders:2.2.0-SNAPSHOT.34',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 268435456
        }
      }
    }
  }, {
    'id' : 'edge-patron-4.1.0-SNAPSHOT.49',
    'name' : 'Patron Services Edge API',
    'requires' : [{
      'id' : 'patron',
      'version' : '4.0'
    }, {
      'id' : 'login',
      'version' : '5.0 6.0'
    }],
    'provides' : [],
    'permissionSets' : [],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/edge-patron:4.1.0-SNAPSHOT.49',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 268435456
        }
      }
    }
  }, {
    'id' : 'edge-rtac-2.0.2-SNAPSHOT.57',
    'name' : 'Real Time Availability Check Edge API',
    'requires' : [{
      'id' : 'rtac',
      'version' : '1.3'
    }, {
      'id' : 'login',
      'version' : '5.0 6.0'
    }],
    'provides' : [],
    'permissionSets' : [],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/edge-rtac:2.0.2-SNAPSHOT.57',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 268435456
        }
      }
    }
  }, {
    'id' : 'mod-agreements-2.1.0-SNAPSHOT.182',
    'name' : 'mod-agreements',
    'provides' : [{
      'id' : 'erm',
      'version' : '2.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas',
        'permissionsRequired' : ['erm.agreements.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/publicLookup',
        'modulePermissions' : ['licenses.licenses.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}',
        'permissionsRequired' : ['erm.agreements.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/export',
        'permissionsRequired' : ['erm.agreements.export']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/export/*',
        'permissionsRequired' : ['erm.agreements.export']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/linkedLicenses',
        'permissionsRequired' : ['erm.agreements.linkedLicenses.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/linkedLicenses',
        'permissionsRequired' : ['erm.agreements.linkedLicenses.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/usageDataProviders',
        'permissionsRequired' : ['erm.agreements.usageDataProviders.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/usageDataProviders',
        'permissionsRequired' : ['erm.agreements.usageDataProviders.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/resources',
        'permissionsRequired' : ['erm.agreements.item.resources.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/resources/*',
        'permissionsRequired' : ['erm.agreements.item.resources.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/resources/export',
        'permissionsRequired' : ['erm.agreements.export']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/sas/{id}/resources/export/*',
        'permissionsRequired' : ['erm.agreements.export']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/erm/sas',
        'permissionsRequired' : ['erm.agreements.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/erm/sas/{id}',
        'permissionsRequired' : ['erm.agreements.item.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/erm/sas/{id}/clone',
        'permissionsRequired' : ['erm.agreements.item.clone']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/erm/sas/{id}',
        'permissionsRequired' : ['erm.agreements.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/export',
        'permissionsRequired' : ['erm.agreements.export']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/export/*',
        'permissionsRequired' : ['erm.agreements.export']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/entitlements',
        'permissionsRequired' : ['erm.entitlements.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/entitlements/{id}',
        'permissionsRequired' : ['erm.entitlements.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/files',
        'permissionsRequired' : ['erm.files.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/files/{id}',
        'permissionsRequired' : ['erm.files.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/files/{id}/*',
        'permissionsRequired' : ['erm.files.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/erm/files',
        'permissionsRequired' : ['erm.files.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/erm/files/{id}',
        'permissionsRequired' : ['erm.files.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/erm/files/{id}',
        'permissionsRequired' : ['erm.files.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/contacts',
        'permissionsRequired' : ['erm.contacts.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/contacts/{id}',
        'permissionsRequired' : ['erm.contacts.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/org',
        'permissionsRequired' : ['erm.orgs.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/org/{id}',
        'permissionsRequired' : ['erm.orgs.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/packages',
        'permissionsRequired' : ['erm.packages.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/packages/{id}',
        'permissionsRequired' : ['erm.packages.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/packages/{id}/content',
        'permissionsRequired' : ['erm.packages.item.content.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/packages/{id}/content/*',
        'permissionsRequired' : ['erm.packages.item.content.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/jobs',
        'permissionsRequired' : ['erm.jobs.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/jobs/{id}',
        'permissionsRequired' : ['erm.jobs.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/jobs/{id}/fullLog',
        'permissionsRequired' : ['erm.jobs.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/jobs/{id}/errorLog',
        'permissionsRequired' : ['erm.jobs.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/jobs/{id}/infoLog',
        'permissionsRequired' : ['erm.jobs.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/erm/jobs/{type}',
        'permissionsRequired' : ['erm.jobs.item.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/erm/jobs/{id}',
        'permissionsRequired' : ['erm.jobs.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/refdata',
        'permissionsRequired' : ['erm.refdata.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/refdata/{domain}/{property}',
        'permissionsRequired' : ['erm.refdata.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/refdata/{id}',
        'permissionsRequired' : ['erm.refdata.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/erm/refdata',
        'permissionsRequired' : ['erm.refdata.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/erm/refdata/{id}',
        'permissionsRequired' : ['erm.refdata.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/erm/refdata/{id}',
        'permissionsRequired' : ['erm.refdata.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/kbs',
        'permissionsRequired' : ['erm.kbs.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/kbs/{id}',
        'permissionsRequired' : ['erm.kbs.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/erm/kbs',
        'permissionsRequired' : ['erm.kbs.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/erm/kbs/{id}',
        'permissionsRequired' : ['erm.kbs.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/erm/kbs/{id}',
        'permissionsRequired' : ['erm.kbs.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/resource',
        'permissionsRequired' : ['erm.resources.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/resource/electronic',
        'permissionsRequired' : ['erm.resources.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/resource/{id}',
        'permissionsRequired' : ['erm.resources.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/resource/{id}/entitlements',
        'permissionsRequired' : ['erm.resources.item.entitlement.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/resource/{id}/entitlementOptions',
        'permissionsRequired' : ['erm.resources.item.entitlementOptions.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/titles',
        'permissionsRequired' : ['erm.titles.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/titles/entitled',
        'permissionsRequired' : ['erm.titles.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm/titles/{id}',
        'permissionsRequired' : ['erm.titles.item.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant/disable'
      }]
    }, {
      'id' : 'codex',
      'version' : '3.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances',
        'permissionsRequired' : ['codex.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances/{id}',
        'permissionsRequired' : ['codex.item.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'erm.agreements.view',
      'subPermissions' : ['erm.agreements.collection.get', 'erm.agreements.item.get', 'erm.agreements.item.resources.get', 'erm.agreements.export', 'erm.agreements.linkedLicenses.get', 'erm.agreements.usageDataProviders.get', 'erm.resources.view']
    }, {
      'permissionName' : 'erm.agreements.edit',
      'subPermissions' : ['erm.agreements.view', 'erm.agreements.item.post', 'erm.agreements.item.put', 'erm.agreements.item.clone']
    }, {
      'permissionName' : 'erm.agreements.manage',
      'subPermissions' : ['erm.agreements.edit', 'erm.agreements.item.delete']
    }, {
      'permissionName' : 'erm.files.view',
      'subPermissions' : ['erm.files.collection.get', 'erm.files.item.get']
    }, {
      'permissionName' : 'erm.files.edit',
      'subPermissions' : ['erm.files.view', 'erm.files.item.post', 'erm.files.item.put']
    }, {
      'permissionName' : 'erm.files.manage',
      'subPermissions' : ['erm.files.edit', 'erm.files.item.delete']
    }, {
      'permissionName' : 'erm.contacts.view',
      'subPermissions' : ['erm.contacts.collection.get', 'erm.contacts.item.get']
    }, {
      'permissionName' : 'erm.orgs.view',
      'subPermissions' : ['erm.orgs.collection.get', 'erm.orgs.item.get']
    }, {
      'permissionName' : 'erm.packages.view',
      'subPermissions' : ['erm.packages.collection.get', 'erm.packages.item.get', 'erm.packages.item.content.get']
    }, {
      'permissionName' : 'erm.jobs.view',
      'subPermissions' : ['erm.jobs.collection.get', 'erm.jobs.item.get']
    }, {
      'permissionName' : 'erm.jobs.edit',
      'subPermissions' : ['erm.jobs.item.post']
    }, {
      'permissionName' : 'erm.jobs.manage',
      'subPermissions' : ['erm.jobs.edit', 'erm.jobs.item.delete']
    }, {
      'permissionName' : 'erm.refdata.view',
      'subPermissions' : ['erm.refdata.collection.get', 'erm.refdata.item.get']
    }, {
      'permissionName' : 'erm.refdata.edit',
      'subPermissions' : ['erm.refdata.view', 'erm.refdata.item.post', 'erm.refdata.item.put']
    }, {
      'permissionName' : 'erm.refdata.manage',
      'subPermissions' : ['erm.refdata.edit', 'erm.refdata.item.delete']
    }, {
      'permissionName' : 'erm.kbs.view',
      'subPermissions' : ['erm.kbs.collection.get', 'erm.kbs.item.get']
    }, {
      'permissionName' : 'erm.kbs.edit',
      'subPermissions' : ['erm.kbs.view', 'erm.kbs.item.post', 'erm.kbs.item.put']
    }, {
      'permissionName' : 'erm.kbs.manage',
      'subPermissions' : ['erm.kbs.edit', 'erm.kbs.item.delete']
    }, {
      'permissionName' : 'erm.resources.view',
      'subPermissions' : ['erm.resources.collection.get', 'erm.resources.item.get', 'erm.resources.item.entitlement.get', 'erm.resources.item.entitlementOptions.get', 'erm.entitlements.collection.get', 'erm.entitlements.item.get', 'erm.kbs.collection.get']
    }, {
      'permissionName' : 'erm.titles.view',
      'subPermissions' : ['erm.titles.collection.get', 'erm.titles.item.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-agreements:2.1.0-SNAPSHOT.182',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-server -XX:+UseContainerSupport -XX:MaxRAMPercentage=50.0 -XX:+PrintFlagsFinal'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '50'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8080/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 872415232
        }
      }
    }
  }, {
    'id' : 'mod-authtoken-2.5.0-SNAPSHOT.63',
    'name' : 'authtoken',
    'requires' : [{
      'id' : 'permissions',
      'version' : '5.2'
    }, {
      'id' : 'users',
      'version' : '15.0'
    }],
    'provides' : [{
      'id' : 'authtoken',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/token'
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/refreshtoken'
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/refresh'
      }]
    }],
    'filters' : [{
      'methods' : ['*'],
      'pathPattern' : '/*',
      'phase' : 'auth',
      'type' : 'headers'
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-authtoken:2.5.0-SNAPSHOT.63',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0 -Dcache.permissions=true'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-calendar-1.8.0-SNAPSHOT.104',
    'name' : 'Calendar module',
    'requires' : [],
    'provides' : [{
      'id' : 'calendar',
      'version' : '4.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/calendar/periods',
        'permissionsRequired' : ['calendar.opening-hours.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/calendar/periods/{servicePointId}/period',
        'permissionsRequired' : ['calendar.periods.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/calendar/periods/{servicePointId}/period',
        'permissionsRequired' : ['calendar.periods.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/calendar/periods/{servicePointId}/period/{periodId}',
        'permissionsRequired' : ['calendar.periods.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/calendar/periods/{servicePointId}/period/{periodId}',
        'permissionsRequired' : ['calendar.periods.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/calendar/periods/{servicePointId}/period/{periodId}',
        'permissionsRequired' : ['calendar.periods.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/calendar/periods/{servicePointId}/calculateopening',
        'permissionsRequired' : ['calendar.opening-hours.collection.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'calendar.opening-hours.collection.get',
      'displayName' : 'List calendar opening hours',
      'description' : ''
    }, {
      'permissionName' : 'calendar.periods.collection.get',
      'displayName' : 'List calendar periods descriptions',
      'description' : ''
    }, {
      'permissionName' : 'calendar.periods.item.get',
      'displayName' : 'Get period description',
      'description' : ''
    }, {
      'permissionName' : 'calendar.periods.item.post',
      'displayName' : 'Add new calendar period description',
      'description' : ''
    }, {
      'permissionName' : 'calendar.periods.item.put',
      'displayName' : 'Update existing calendar period description',
      'description' : ''
    }, {
      'permissionName' : 'calendar.periods.item.delete',
      'displayName' : 'Remove calendar period description',
      'description' : ''
    }, {
      'permissionName' : 'calendar.all',
      'displayName' : 'Calendar - all permissions',
      'description' : 'All permission for mod-calendar module',
      'subPermissions' : ['calendar.opening-hours.collection.get', 'calendar.periods.collection.get', 'calendar.periods.item.post', 'calendar.periods.item.get', 'calendar.periods.item.put', 'calendar.periods.item.delete'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-calendar:1.8.0-SNAPSHOT.104',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-circulation-18.0.0-SNAPSHOT.487',
    'name' : 'Circulation Module',
    'requires' : [{
      'id' : 'loan-storage',
      'version' : '6.4'
    }, {
      'id' : 'circulation-rules-storage',
      'version' : '1.0'
    }, {
      'id' : 'item-storage',
      'version' : '8.0'
    }, {
      'id' : 'instance-storage',
      'version' : '4.0 5.0 6.0 7.0'
    }, {
      'id' : 'holdings-storage',
      'version' : '1.3 2.0 3.0 4.0'
    }, {
      'id' : 'request-storage',
      'version' : '3.2'
    }, {
      'id' : 'request-storage-batch',
      'version' : '0.2'
    }, {
      'id' : 'users',
      'version' : '14.2 15.0'
    }, {
      'id' : 'locations',
      'version' : '3.0'
    }, {
      'id' : 'material-types',
      'version' : '2.0'
    }, {
      'id' : 'loan-policy-storage',
      'version' : '1.2 2.0'
    }, {
      'id' : 'request-policy-storage',
      'version' : '1.0'
    }, {
      'id' : 'fixed-due-date-schedules-storage',
      'version' : '2.0'
    }, {
      'id' : 'service-points',
      'version' : '3.0'
    }, {
      'id' : 'calendar',
      'version' : '3.0 4.0'
    }, {
      'id' : 'patron-notice-policy-storage',
      'version' : '0.11'
    }, {
      'id' : 'patron-notice',
      'version' : '1.0'
    }, {
      'id' : 'configuration',
      'version' : '2.0'
    }, {
      'id' : 'cancellation-reason-storage',
      'version' : '1.1'
    }, {
      'id' : 'loan-types',
      'version' : '2.2'
    }, {
      'id' : 'scheduled-notice-storage',
      'version' : '0.1'
    }, {
      'id' : 'feesfines',
      'version' : '15.0'
    }, {
      'id' : 'location-units',
      'version' : '2.0'
    }, {
      'id' : 'patron-action-session-storage',
      'version' : '0.1'
    }],
    'provides' : [{
      'id' : 'requests-reports',
      'version' : '0.6',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/circulation/requests-reports/hold-shelf-clearance/{id}',
        'permissionsRequired' : ['circulation.requests.hold-shelf-clearance-report.get'],
        'modulePermissions' : ['modperms.circulation.requests.hold-shelf-clearance-report.get']
      }]
    }, {
      'id' : 'inventory-reports',
      'version' : '0.3',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/inventory-reports/items-in-transit',
        'permissionsRequired' : ['circulation.inventory.items-in-transit-report.get'],
        'modulePermissions' : ['modperms.inventory.items-in-transit-report.get']
      }]
    }, {
      'id' : 'pick-slips',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/circulation/pick-slips/{servicePointId}',
        'permissionsRequired' : ['circulation.pick-slips.get'],
        'modulePermissions' : ['modperms.circulation.pick-slips.get']
      }]
    }, {
      'id' : 'request-move',
      'version' : '0.6',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/circulation/requests/{id}/move',
        'permissionsRequired' : ['circulation.requests.item.move.post'],
        'modulePermissions' : ['modperms.circulation.requests.item.move.post']
      }]
    }, {
      'id' : 'loan-anonymization',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/loan-anonymization/by-user/{userId}',
        'permissionsRequired' : ['circulation.loans.collection.anonymize.user.post'],
        'modulePermissions' : ['modperms.circulation.loans.anonymize']
      }]
    }, {
      'id' : 'declare-item-lost',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/circulation/loans/{id}/declare-item-lost',
        'permissionsRequired' : ['circulation.loans.declare-item-lost.post'],
        'modulePermissions' : ['modperms.circulation.loans.declare-item-lost.post']
      }]
    }, {
      'id' : 'circulation',
      'version' : '9.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/circulation/check-out-by-barcode',
        'permissionsRequired' : ['circulation.check-out-by-barcode.post'],
        'modulePermissions' : ['modperms.circulation.check-out-by-barcode.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/override-check-out-by-barcode',
        'permissionsRequired' : ['circulation.override-check-out-by-barcode.post'],
        'modulePermissions' : ['modperms.circulation.override-check-out-by-barcode.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/check-in-by-barcode',
        'permissionsRequired' : ['circulation.check-in-by-barcode.post'],
        'modulePermissions' : ['modperms.circulation.check-in-by-barcode.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/renew-by-barcode',
        'permissionsRequired' : ['circulation.renew-by-barcode.post'],
        'modulePermissions' : ['modperms.circulation.renew-by-barcode.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/override-renewal-by-barcode',
        'permissionsRequired' : ['circulation.override-renewal-by-barcode.post'],
        'modulePermissions' : ['modperms.circulation.override-renewal-by-barcode.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/renew-by-id',
        'permissionsRequired' : ['circulation.renew-by-id.post'],
        'modulePermissions' : ['modperms.circulation.renew-by-id.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/loans',
        'permissionsRequired' : ['circulation.loans.collection.get'],
        'modulePermissions' : ['modperms.circulation.loans.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/loans',
        'permissionsRequired' : ['circulation.loans.item.post'],
        'modulePermissions' : ['modperms.circulation.loans.item.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/circulation/loans',
        'permissionsRequired' : ['circulation.loans.collection.delete'],
        'modulePermissions' : ['circulation-storage.loans.collection.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/loans/{id}',
        'permissionsRequired' : ['circulation.loans.item.get'],
        'modulePermissions' : ['modperms.circulation.loans.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/circulation/loans/{id}',
        'permissionsRequired' : ['circulation.loans.item.put'],
        'modulePermissions' : ['modperms.circulation.loans.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/circulation/loans/{id}',
        'permissionsRequired' : ['circulation.loans.item.delete'],
        'modulePermissions' : ['circulation-storage.loans.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/requests',
        'permissionsRequired' : ['circulation.requests.collection.get'],
        'modulePermissions' : ['modperms.circulation.requests.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/requests',
        'permissionsRequired' : ['circulation.requests.item.post'],
        'modulePermissions' : ['modperms.circulation.requests.item.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/circulation/requests',
        'permissionsRequired' : ['circulation.requests.collection.delete'],
        'modulePermissions' : ['circulation-storage.requests.collection.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/requests/{id}',
        'permissionsRequired' : ['circulation.requests.item.get'],
        'modulePermissions' : ['modperms.circulation.requests.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/circulation/requests/{id}',
        'permissionsRequired' : ['circulation.requests.item.put'],
        'modulePermissions' : ['modperms.circulation.requests.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/circulation/requests/{id}',
        'permissionsRequired' : ['circulation.requests.item.delete'],
        'modulePermissions' : ['circulation-storage.requests.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/requests/queue/{id}',
        'permissionsRequired' : ['circulation.requests.queue.collection.get'],
        'modulePermissions' : ['modperms.circulation.requests.queue.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/requests/queue/{itemId}/reorder',
        'permissionsRequired' : ['circulation.requests.queue.reorder.collection.post'],
        'modulePermissions' : ['modperms.circulation.requests.queue.reorder.collection.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/requests/instances',
        'permissionsRequired' : ['circulation.requests.instances.item.post'],
        'modulePermissions' : ['modperms.circulation.requests.instances.item.post']
      }]
    }, {
      'id' : 'circulation-rules',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules',
        'permissionsRequired' : ['circulation.rules.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/circulation/rules',
        'permissionsRequired' : ['circulation.rules.put'],
        'modulePermissions' : ['circulation-storage.circulation-rules.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/loan-policy',
        'permissionsRequired' : ['circulation.rules.loan-policy.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/loan-policy-all',
        'permissionsRequired' : ['circulation.rules.loan-policy-all.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/overdue-fine-policy',
        'permissionsRequired' : ['circulation.rules.overdue-fine-policy.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/overdue-fine-policy-all',
        'permissionsRequired' : ['circulation.rules.overdue-fine-policy-all.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/lost-item-policy',
        'permissionsRequired' : ['circulation.rules.lost-item-policy.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/lost-item-policy-all',
        'permissionsRequired' : ['circulation.rules.lost-item-all.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/request-policy',
        'permissionsRequired' : ['circulation.rules.request-policy.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/request-policy-all',
        'permissionsRequired' : ['circulation.rules.request-policy-all.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/notice-policy',
        'permissionsRequired' : ['circulation.rules.notice-policy.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/circulation/rules/notice-policy-all',
        'permissionsRequired' : ['circulation.rules.notice-policy-all.get'],
        'modulePermissions' : ['circulation-storage.circulation-rules.get', 'inventory-storage.locations.item.get']
      }]
    }, {
      'id' : 'patron-action-session',
      'version' : '0.2',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/circulation/end-patron-action-session',
        'permissionsRequired' : ['circulation.end-patron-action-session.post'],
        'modulePermissions' : ['patron-action-session-storage.patron-action-sessions.collection.get', 'circulation-storage.loans.collection.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.instances.collection.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.location-units.campuses.collection.get', 'inventory-storage.location-units.institutions.collection.get', 'inventory-storage.material-types.collection.get', 'circulation-storage.loan-policies.collection.get', 'users.item.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'patron-notice.post', 'patron-action-session-storage.patron-action-sessions.item.delete']
      }]
    }, {
      'id' : '_timer',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/circulation/notice-session-expiration-by-timeout',
        'unit' : 'minute',
        'delay' : '3',
        'modulePermissions' : ['patron-action-session-storage.expired-session-patron-ids.collection.get', 'patron-action-session-storage.patron-action-sessions.collection.get', 'circulation-storage.loans.collection.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.instances.collection.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.location-units.campuses.collection.get', 'inventory-storage.location-units.institutions.collection.get', 'inventory-storage.material-types.collection.get', 'circulation-storage.loan-policies.collection.get', 'users.item.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'patron-notice.post', 'patron-action-session-storage.patron-action-sessions.item.delete', 'configuration.entries.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/due-date-scheduled-notices-processing',
        'unit' : 'minute',
        'delay' : '5',
        'modulePermissions' : ['scheduled-notice-storage.scheduled-notices.collection.get', 'scheduled-notice-storage.scheduled-notices.item.delete', 'scheduled-notice-storage.scheduled-notices.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.holdings.item.get', 'inventory-storage.loan-types.item.get', 'inventory-storage.service-points.item.get', 'inventory-storage.instances.item.get', 'circulation.rules.loan-policy.get', 'configuration.entries.collection.get', 'patron-notice.post', 'users.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/due-date-not-real-time-scheduled-notices-processing',
        'unit' : 'minute',
        'delay' : '2',
        'modulePermissions' : ['scheduled-notice-storage.scheduled-notices.collection.get', 'scheduled-notice-storage.scheduled-notices.item.delete', 'scheduled-notice-storage.scheduled-notices.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.holdings.item.get', 'inventory-storage.loan-types.item.get', 'inventory-storage.service-points.item.get', 'inventory-storage.instances.item.get', 'circulation.rules.loan-policy.get', 'configuration.entries.collection.get', 'patron-notice.post', 'users.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/request-scheduled-notices-processing',
        'unit' : 'minute',
        'delay' : '2',
        'modulePermissions' : ['scheduled-notice-storage.scheduled-notices.collection.get', 'scheduled-notice-storage.scheduled-notices.item.delete', 'scheduled-notice-storage.scheduled-notices.item.put', 'inventory-storage.items.item.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.holdings.item.get', 'inventory-storage.loan-types.item.get', 'inventory-storage.service-points.item.get', 'inventory-storage.instances.item.get', 'circulation-storage.loans.collection.get', 'circulation-storage.requests.item.get', 'patron-notice.post', 'users.item.get', 'usergroups.collection.get', 'configuration.entries.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/circulation/scheduled-anonymize-processing',
        'unit' : 'minute',
        'delay' : '1',
        'modulePermissions' : ['circulation-storage.loans.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.loan-types.item.get', 'users.item.get', 'users.collection.get', 'proxiesfor.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'configuration.entries.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post', 'patron-notice.post', 'anonymize-storage-loans.post', 'accounts.collection.get', 'feefineactions.collection.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'circulation.requests.queue.reorder.collection.post',
      'displayName' : 'circulation - reorder queue for an item',
      'description' : 'change request positions in queue for an item'
    }, {
      'permissionName' : 'circulation.check-out-by-barcode.post',
      'displayName' : 'circulation - check out item by barcode',
      'description' : 'check out an item using barcodes for item and loanee'
    }, {
      'permissionName' : 'circulation.override-check-out-by-barcode.post',
      'displayName' : 'circulation - override item checkout by barcode',
      'description' : 'override item check out using barcodes for item and loanee'
    }, {
      'permissionName' : 'circulation.check-in-by-barcode.post',
      'displayName' : 'circulation - checkin loan by barcode',
      'description' : 'checkin a loan using barcodes for item and loanee'
    }, {
      'permissionName' : 'circulation.renew-by-barcode.post',
      'displayName' : 'circulation - renew loan by barcode',
      'description' : 'renew a loan using barcodes for item and loanee'
    }, {
      'permissionName' : 'circulation.renew-by-id.post',
      'displayName' : 'circulation - renew loan using id',
      'description' : 'renew a loan using IDs for item and loanee'
    }, {
      'permissionName' : 'circulation.override-renewal-by-barcode.post',
      'displayName' : 'circulation - override renewal by barcode',
      'description' : 'override renewal using barcodes for item and loanee'
    }, {
      'permissionName' : 'circulation.loans.collection.get',
      'displayName' : 'circulation - get loan collection',
      'description' : 'get loan collection'
    }, {
      'permissionName' : 'circulation.loans.collection.delete',
      'displayName' : 'circulation - delete entire loan collection',
      'description' : 'delete entire loan collection'
    }, {
      'permissionName' : 'circulation.loans.item.get',
      'displayName' : 'circulation - get individual loan',
      'description' : 'get individual loan'
    }, {
      'permissionName' : 'circulation.loans.item.post',
      'displayName' : 'circulation - create individual loan',
      'description' : 'create individual loan'
    }, {
      'permissionName' : 'circulation.loans.item.put',
      'displayName' : 'circulation - modify loan',
      'description' : 'modify individual loan'
    }, {
      'permissionName' : 'circulation.loans.collection.anonymize.user.post',
      'displayName' : 'circulation - anonymize loans',
      'description' : 'anonymize loans'
    }, {
      'permissionName' : 'circulation.loans.item.delete',
      'displayName' : 'circulation - delete individual loan',
      'description' : 'delete individual loan'
    }, {
      'permissionName' : 'circulation.loans.declare-item-lost.post',
      'displayName' : 'circulation - declare the loaned item lost',
      'description' : 'declares the loaned item lost'
    }, {
      'permissionName' : 'circulation.rules.get',
      'displayName' : 'Circulation - get circulation rules',
      'description' : 'Get circulation rules'
    }, {
      'permissionName' : 'circulation.rules.put',
      'displayName' : 'Circulation - modify circulation rules',
      'description' : 'Modify circulation rules'
    }, {
      'permissionName' : 'circulation.rules.loan-policy.get',
      'displayName' : 'Circulation - use circulation rules to get matching loan policy',
      'description' : 'Apply circulation rules to get matching loan policy'
    }, {
      'permissionName' : 'circulation.rules.loan-policy-all.get',
      'displayName' : 'Circulation - use circulation rules to get all matching loan policies',
      'description' : 'Apply circulation rules to get all matching loan policies'
    }, {
      'permissionName' : 'circulation.rules.request-policy.get',
      'displayName' : 'Circulation - use circulation rules to get matching request policy',
      'description' : 'Apply circulation rules to get matching request policy'
    }, {
      'permissionName' : 'circulation.rules.request-policy-all.get',
      'displayName' : 'Circulation - use circulation rules to get all matching request policies',
      'description' : 'Apply circulation rules to get all matching request policies'
    }, {
      'permissionName' : 'circulation.rules.notice-policy.get',
      'displayName' : 'Circulation - use circulation rules to get matching notice policy',
      'description' : 'Apply circulation rules to get matching notice policy'
    }, {
      'permissionName' : 'circulation.rules.notice-policy-all.get',
      'displayName' : 'Circulation - use circulation rules to get all matching notice policies',
      'description' : 'Apply circulation rules to get all matching notice policies'
    }, {
      'permissionName' : 'circulation.requests.collection.get',
      'displayName' : 'circulation - get request collection',
      'description' : 'get request collection'
    }, {
      'permissionName' : 'circulation.requests.collection.delete',
      'displayName' : 'circulation - delete entire request collection',
      'description' : 'delete entire request collection'
    }, {
      'permissionName' : 'circulation.requests.item.get',
      'displayName' : 'circulation - get individual request',
      'description' : 'get individual request'
    }, {
      'permissionName' : 'circulation.requests.item.post',
      'displayName' : 'circulation - create individual requests',
      'description' : 'create individual request'
    }, {
      'permissionName' : 'circulation.requests.item.put',
      'displayName' : 'circulation - modify request',
      'description' : 'modify individual request'
    }, {
      'permissionName' : 'circulation.requests.item.delete',
      'displayName' : 'circulation - delete individual request',
      'description' : 'delete individual request'
    }, {
      'permissionName' : 'circulation.requests.item.move.post',
      'displayName' : 'circulation - move individual requests to another item',
      'description' : 'move individual request to another item'
    }, {
      'permissionName' : 'circulation.requests.queue.collection.get',
      'displayName' : 'circulation - request queue for an item',
      'description' : 'get request queue for an item'
    }, {
      'permissionName' : 'circulation.requests.instances.item.post',
      'displayName' : 'circulation - create instance level request',
      'description' : 'create a request given an instance'
    }, {
      'permissionName' : 'circulation.requests.hold-shelf-clearance-report.get',
      'displayName' : 'circulation - request hold shelf clearance report',
      'description' : 'get all hold shelf clearance requests to generating a report'
    }, {
      'permissionName' : 'circulation.inventory.items-in-transit-report.get',
      'displayName' : 'circulation - items in transit report',
      'description' : 'get all items in transit to generating a report'
    }, {
      'permissionName' : 'circulation.pick-slips.get',
      'displayName' : 'circulation - pick slips',
      'description' : 'get items for pick slips generation'
    }, {
      'permissionName' : 'circulation.end-patron-action-session.post',
      'displayName' : 'circulation - end patron action session',
      'description' : 'end patron action session'
    }, {
      'permissionName' : 'circulation.all',
      'displayName' : 'circulation - all permissions',
      'description' : 'Entire set of permissions needed to use the circulation',
      'subPermissions' : ['circulation.check-out-by-barcode.post', 'circulation.override-check-out-by-barcode.post', 'circulation.check-in-by-barcode.post', 'circulation.renew-by-barcode.post', 'circulation.renew-by-id.post', 'circulation.override-renewal-by-barcode.post', 'circulation.loans.collection.get', 'circulation.loans.item.get', 'circulation.loans.item.post', 'circulation.loans.item.put', 'circulation.loans.item.delete', 'circulation.loans.collection.delete', 'circulation.rules.put', 'circulation.rules.get', 'circulation.rules.loan-policy.get', 'circulation.rules.loan-policy-all.get', 'circulation.rules.request-policy.get', 'circulation.rules.request-policy-all.get', 'circulation.rules.notice-policy.get', 'circulation.rules.notice-policy-all.get', 'circulation.requests.collection.get', 'circulation.requests.item.get', 'circulation.requests.item.post', 'circulation.requests.item.put', 'circulation.requests.item.delete', 'circulation.requests.item.move.post', 'circulation.requests.collection.delete', 'circulation.requests.queue.collection.get', 'circulation.requests.queue.reorder.collection.post', 'circulation.requests.instances.item.post', 'circulation.requests.hold-shelf-clearance-report.get', 'circulation.inventory.items-in-transit-report.get', 'circulation.pick-slips.get']
    }, {
      'permissionName' : 'modperms.circulation.requests.hold-shelf-clearance-report.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'circulation-storage.requests.item.get', 'circulation-storage.requests.collection.get', 'users.collection.get', 'users.item.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.item.move.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.requests.item.put', 'circulation-storage.requests.item.post', 'circulation-storage.request-batch.item.post', 'inventory-storage.items.item.put', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.get', 'circulation-storage.loans.item.put', 'circulation-storage.loans.collection.get', 'circulation-storage.request-policies.item.get', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'proxiesfor.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'patron-notice.post', 'circulation-storage.cancellation-reasons.item.get', 'inventory-storage.loan-types.item.get', 'configuration.entries.collection.get', 'calendar.opening-hours.collection.get', 'circulation.internal.apply-rules'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.check-out-by-barcode.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.post', 'calendar.opening-hours.collection.get', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation-storage.request-batch.item.post', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'proxiesfor.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'configuration.entries.collection.get', 'users.collection.get', 'inventory-storage.loan-types.item.get', 'scheduled-notice-storage.scheduled-notices.item.post', 'usergroups.collection.get', 'usergroups.item.get', 'patron-action-session-storage.patron-action-sessions.item.post', 'circulation.rules.overdue-fine-policy.get', 'circulation.rules.lost-item-policy.get', 'overdue-fines-policies.collection.get', 'lost-item-fees-policies.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.override-check-out-by-barcode.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.post', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'circulation-storage.request-batch.item.post', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'proxiesfor.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'circulation-storage.patron-notice-policies.item.get', 'patron-notice.post', 'circulation.rules.notice-policy.get', 'configuration.entries.collection.get', 'users.collection.get', 'inventory-storage.loan-types.item.get', 'scheduled-notice-storage.scheduled-notices.item.post', 'usergroups.collection.get', 'usergroups.item.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.check-in-by-barcode.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.collection.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'addresstypes.item.get', 'proxiesfor.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'circulation-storage.patron-notice-policies.item.get', 'patron-notice.post', 'circulation.rules.notice-policy.get', 'inventory-storage.loan-types.item.get', 'patron-action-session-storage.patron-action-sessions.item.post'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.renew-by-barcode.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.loan-types.item.get', 'users.item.get', 'users.collection.get', 'proxiesfor.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'calendar.opening-hours.collection.get', 'configuration.entries.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post', 'patron-notice.post'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.override-renewal-by-barcode.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.loan-types.item.get', 'users.item.get', 'users.collection.get', 'proxiesfor.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'configuration.entries.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post', 'patron-notice.post'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.loans.anonymize',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.loan-types.item.get', 'users.item.get', 'users.collection.get', 'proxiesfor.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'configuration.entries.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post', 'patron-notice.post', 'anonymize-storage-loans.post', 'feefineactions.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.renew-by-id.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.put', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.loan-types.item.get', 'users.item.get', 'users.collection.get', 'proxiesfor.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'calendar.opening-hours.collection.get', 'configuration.entries.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post', 'patron-notice.post'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.loans.item.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.post', 'circulation-storage.loans.item.get', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'proxiesfor.collection.get', 'inventory-storage.material-types.item.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.loans.collection.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.collection.get', 'users.item.get', 'inventory-storage.locations.collection.get', 'accounts.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'feefineactions.collection.get', 'feefineactions.item.get', 'overdue-fines-policies.collection.get', 'lost-item-fees-policies.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.loans.item.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'accounts.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'overdue-fines-policies.collection.get', 'lost-item-fees-policies.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.collection.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.requests.item.get', 'circulation-storage.requests.collection.get', 'circulation-storage.loans.collection.get', 'circulation-storage.loans.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'inventory-storage.location-units.libraries.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.item.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation.rules.loan-policy.get', 'circulation-storage.requests.item.post', 'inventory-storage.items.item.put', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.get', 'circulation-storage.request-batch.item.post', 'circulation-storage.loans.item.put', 'circulation-storage.loans.collection.get', 'circulation-storage.loans.item.get', 'circulation-storage.loan-policies.item.get', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'proxiesfor.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'circulation.rules.request-policy.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.requests.item.put', 'patron-notice.post', 'inventory-storage.loan-types.item.get', 'calendar.opening-hours.collection.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post', 'configuration.entries.collection.get', 'manualblocks.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.item.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.requests.item.get', 'circulation-storage.requests.collection.get', 'circulation-storage.loans.collection.get', 'circulation-storage.loans.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'inventory-storage.location-units.libraries.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.item.put',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['calendar.opening-hours.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.item.put', 'circulation-storage.requests.item.post', 'circulation-storage.request-batch.item.post', 'inventory-storage.items.item.put', 'circulation-storage.request-policies.item.get', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loans.item.get', 'circulation-storage.loans.item.put', 'circulation-storage.loans.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'proxiesfor.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'patron-notice.post', 'circulation-storage.cancellation-reasons.item.get', 'inventory-storage.loan-types.item.get', 'configuration.entries.collection.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.queue.collection.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.requests.item.get', 'circulation-storage.requests.collection.get', 'circulation-storage.loans.collection.get', 'circulation-storage.loans.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.queue.reorder.collection.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.requests.item.get', 'circulation-storage.request-batch.item.post', 'circulation-storage.requests.collection.get', 'circulation-storage.loans.collection.get', 'circulation-storage.loans.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.requests.instances.item.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.requests.item.post', 'circulation-storage.requests.item.put', 'inventory-storage.items.item.put', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loans.item.get', 'circulation-storage.loans.item.put', 'circulation-storage.loans.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'users.item.get', 'users.collection.get', 'usergroups.collection.get', 'usergroups.item.get', 'proxiesfor.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'patron-notice.post', 'inventory-storage.loan-types.item.get', 'calendar.opening-hours.collection.get', 'configuration.entries.collection.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.loans.declare-item-lost.post',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.put', 'users.item.get', 'inventory-storage.items.item.put'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.loans.item.put',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['circulation-storage.loans.item.put', 'circulation-storage.loans.collection.get', 'circulation.rules.loan-policy.get', 'circulation.rules.request-policy.get', 'circulation-storage.requests.item.put', 'circulation-storage.requests.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.items.item.put', 'inventory-storage.items.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'proxiesfor.collection.get', 'users.item.get', 'proxiesfor.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.loan-types.item.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'scheduled-notice-storage.scheduled-notices.item.post'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.inventory.items-in-transit-report.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.locations.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'circulation-storage.requests.item.get', 'circulation-storage.requests.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.collection.get', 'circulation-storage.loans.collection.get', 'circulation-storage.loans.item.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.circulation.pick-slips.get',
      'displayName' : 'module permissions for one op',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['inventory-storage.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'circulation-storage.requests.item.get', 'circulation-storage.requests.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'circulation.internal.apply-rules',
      'displayName' : 'Apply circulation rules',
      'description' : 'Internal permission set for applying circulation rules',
      'subPermissions' : ['circulation.rules.loan-policy.get', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation.rules.request-policy.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.request-policies.collection.get', 'circulation.rules.notice-policy.get', 'circulation-storage.patron-notice-policies.item.get', 'circulation-storage.patron-notice-policies.collection.get'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-circulation:18.0.0-SNAPSHOT.487',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '9801/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-circulation-storage-10.1.0-SNAPSHOT.226',
    'name' : 'Circulation Storage Module',
    'provides' : [{
      'id' : 'request-storage-batch',
      'version' : '0.2',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/request-storage-batch/requests',
        'permissionsRequired' : ['circulation-storage.request-batch.item.post']
      }]
    }, {
      'id' : 'loan-storage',
      'version' : '6.5',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/loan-storage/loans',
        'permissionsRequired' : ['circulation-storage.loans.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/loan-storage/loans/{id}',
        'permissionsRequired' : ['circulation-storage.loans.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/loan-storage/loans',
        'permissionsRequired' : ['circulation-storage.loans.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/loan-storage/loans/{id}',
        'permissionsRequired' : ['circulation-storage.loans.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/loan-storage/loans/{id}',
        'permissionsRequired' : ['circulation-storage.loans.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/loan-storage/loans',
        'permissionsRequired' : ['circulation-storage.loans.collection.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/loan-storage/loan-history',
        'permissionsRequired' : ['circulation-storage.loans-history.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/loan-storage/loans/anonymize/{userId}',
        'permissionsRequired' : ['circulation-storage.loans.collection.anonymize.user.post']
      }]
    }, {
      'id' : 'anonymize-storage-loans',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/anonymize-storage-loans',
        'permissionsRequired' : ['anonymize-storage-loans.post']
      }]
    }, {
      'id' : 'circulation-rules-storage',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/circulation-rules-storage',
        'permissionsRequired' : ['circulation-storage.circulation-rules.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/circulation-rules-storage',
        'permissionsRequired' : ['circulation-storage.circulation-rules.put']
      }]
    }, {
      'id' : 'loan-policy-storage',
      'version' : '2.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/loan-policy-storage/loan-policies',
        'permissionsRequired' : ['circulation-storage.loan-policies.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/loan-policy-storage/loan-policies/{id}',
        'permissionsRequired' : ['circulation-storage.loan-policies.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/loan-policy-storage/loan-policies',
        'permissionsRequired' : ['circulation-storage.loan-policies.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/loan-policy-storage/loan-policies/{id}',
        'permissionsRequired' : ['circulation-storage.loan-policies.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/loan-policy-storage/loan-policies/{id}',
        'permissionsRequired' : ['circulation-storage.loan-policies.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/loan-policy-storage/loan-policies',
        'permissionsRequired' : ['circulation-storage.loan-policies.collection.delete']
      }]
    }, {
      'id' : 'request-storage',
      'version' : '3.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/request-storage/requests',
        'permissionsRequired' : ['circulation-storage.requests.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/request-storage/requests/{id}',
        'permissionsRequired' : ['circulation-storage.requests.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/request-storage/requests',
        'permissionsRequired' : ['circulation-storage.requests.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/request-storage/requests/{id}',
        'permissionsRequired' : ['circulation-storage.requests.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/request-storage/requests/{id}',
        'permissionsRequired' : ['circulation-storage.requests.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/request-storage/requests',
        'permissionsRequired' : ['circulation-storage.requests.collection.delete']
      }]
    }, {
      'id' : 'fixed-due-date-schedules-storage',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/fixed-due-date-schedule-storage/fixed-due-date-schedules',
        'permissionsRequired' : ['circulation-storage.fixed-due-date-schedules.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/fixed-due-date-schedule-storage/fixed-due-date-schedules/{id}',
        'permissionsRequired' : ['circulation-storage.fixed-due-date-schedules.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/fixed-due-date-schedule-storage/fixed-due-date-schedules',
        'permissionsRequired' : ['circulation-storage.fixed-due-date-schedules.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/fixed-due-date-schedule-storage/fixed-due-date-schedules/{id}',
        'permissionsRequired' : ['circulation-storage.fixed-due-date-schedules.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/fixed-due-date-schedule-storage/fixed-due-date-schedules/{id}',
        'permissionsRequired' : ['circulation-storage.fixed-due-date-schedules.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/fixed-due-date-schedule-storage/fixed-due-date-schedules',
        'permissionsRequired' : ['circulation-storage.fixed-due-date-schedules.collection.delete']
      }]
    }, {
      'id' : 'staff-slips-storage',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/staff-slips-storage/staff-slips',
        'permissionsRequired' : ['circulation-storage.staff-slips.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/staff-slips-storage/staff-slips',
        'permissionsRequired' : ['circulation-storage.staff-slips.item.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/staff-slips-storage/staff-slips',
        'permissionsRequired' : ['circulation-storage.staff-slips.collection.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/staff-slips-storage/staff-slips/{id}',
        'permissionsRequired' : ['circulation-storage.staff-slips.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/staff-slips-storage/staff-slips/{id}',
        'permissionsRequired' : ['circulation-storage.staff-slips.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/staff-slips-storage/staff-slips/{id}',
        'permissionsRequired' : ['circulation-storage.staff-slips.item.delete']
      }]
    }, {
      'id' : 'cancellation-reason-storage',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/cancellation-reason-storage/cancellation-reasons',
        'permissionsRequired' : ['circulation-storage.cancellation-reasons.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/cancellation-reason-storage/cancellation-reasons/{id}',
        'permissionsRequired' : ['circulation-storage.cancellation-reasons.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/cancellation-reason-storage/cancellation-reasons',
        'permissionsRequired' : ['circulation-storage.cancellation-reasons.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/cancellation-reason-storage/cancellation-reasons/{id}',
        'permissionsRequired' : ['circulation-storage.cancellation-reasons.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/cancellation-reason-storage/cancellation-reasons',
        'permissionsRequired' : ['circulation-storage.cancellation-reasons.collection.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/cancellation-reason-storage/cancellation-reasons/{id}',
        'permissionsRequired' : ['circulation-storage.cancellation-reasons.item.delete']
      }]
    }, {
      'id' : 'patron-notice-policy-storage',
      'version' : '0.11',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/patron-notice-policy-storage/patron-notice-policies',
        'permissionsRequired' : ['circulation-storage.patron-notice-policies.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/patron-notice-policy-storage/patron-notice-policies/{id}',
        'permissionsRequired' : ['circulation-storage.patron-notice-policies.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/patron-notice-policy-storage/patron-notice-policies/{id}',
        'permissionsRequired' : ['circulation-storage.patron-notice-policies.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/patron-notice-policy-storage/patron-notice-policies',
        'permissionsRequired' : ['circulation-storage.patron-notice-policies.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/patron-notice-policy-storage/patron-notice-policies/{id}',
        'permissionsRequired' : ['circulation-storage.patron-notice-policies.item.get']
      }]
    }, {
      'id' : 'request-policy-storage',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/request-policy-storage/request-policies',
        'permissionsRequired' : ['circulation-storage.request-policies.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/request-policy-storage/request-policies/{id}',
        'permissionsRequired' : ['circulation-storage.request-policies.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/request-policy-storage/request-policies',
        'permissionsRequired' : ['circulation-storage.request-policies.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/request-policy-storage/request-policies/{id}',
        'permissionsRequired' : ['circulation-storage.request-policies.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/request-policy-storage/request-policies/{id}',
        'permissionsRequired' : ['circulation-storage.request-policies.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/request-policy-storage/request-policies',
        'permissionsRequired' : ['circulation-storage.request-policies.collection.delete']
      }]
    }, {
      'id' : 'request-preference-storage',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/request-preference-storage/request-preference',
        'permissionsRequired' : ['circulation-storage.request-preferences.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/request-preference-storage/request-preference/{id}',
        'permissionsRequired' : ['circulation-storage.request-preferences.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/request-preference-storage/request-preference/{id}',
        'permissionsRequired' : ['circulation-storage.request-preferences.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/request-preference-storage/request-preference',
        'permissionsRequired' : ['circulation-storage.request-preferences.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/request-preference-storage/request-preference/{id}',
        'permissionsRequired' : ['circulation-storage.request-preferences.item.get']
      }]
    }, {
      'id' : 'scheduled-notice-storage',
      'version' : '0.3',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/scheduled-notice-storage/scheduled-notices',
        'permissionsRequired' : ['scheduled-notice-storage.scheduled-notices.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/scheduled-notice-storage/scheduled-notices/{id}',
        'permissionsRequired' : ['scheduled-notice-storage.scheduled-notices.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/scheduled-notice-storage/scheduled-notices',
        'permissionsRequired' : ['scheduled-notice-storage.scheduled-notices.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/scheduled-notice-storage/scheduled-notices/{id}',
        'permissionsRequired' : ['scheduled-notice-storage.scheduled-notices.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/scheduled-notice-storage/scheduled-notices',
        'permissionsRequired' : ['scheduled-notice-storage.scheduled-notices.collection.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/scheduled-notice-storage/scheduled-notices/{id}',
        'permissionsRequired' : ['scheduled-notice-storage.scheduled-notices.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }, {
      'id' : 'patron-action-session-storage',
      'version' : '0.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/patron-action-session-storage/patron-action-sessions',
        'permissionsRequired' : ['patron-action-session-storage.patron-action-sessions.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/patron-action-session-storage/patron-action-sessions/{id}',
        'permissionsRequired' : ['patron-action-session-storage.patron-action-sessions.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/patron-action-session-storage/patron-action-sessions',
        'permissionsRequired' : ['patron-action-session-storage.patron-action-sessions.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/patron-action-session-storage/patron-action-sessions/{id}',
        'permissionsRequired' : ['patron-action-session-storage.patron-action-sessions.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/patron-action-session-storage/patron-action-sessions/{id}',
        'permissionsRequired' : ['patron-action-session-storage.patron-action-sessions.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/patron-action-session-storage/expired-session-patron-ids',
        'permissionsRequired' : ['patron-action-session-storage.expired-session-patron-ids.collection.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'circulation-storage.loans.collection.get',
      'displayName' : 'Circulation storage - get loan collection',
      'description' : 'Get loan collection from storage'
    }, {
      'permissionName' : 'circulation-storage.loans.collection.delete',
      'displayName' : 'Circulation storage - delete entire loan collection',
      'description' : 'Delete entire loan collection from storage'
    }, {
      'permissionName' : 'circulation-storage.loans.item.get',
      'displayName' : 'Circulation storage - get individual loan',
      'description' : 'Get individual loan from storage'
    }, {
      'permissionName' : 'circulation-storage.loans.item.post',
      'displayName' : 'Circulation storage - create individual loan',
      'description' : 'Create individual loan in storage'
    }, {
      'permissionName' : 'circulation-storage.loans.item.put',
      'displayName' : 'Circulation storage - modify loan',
      'description' : 'Modify loan in storage'
    }, {
      'permissionName' : 'circulation-storage.loans.item.delete',
      'displayName' : 'Circulation storage - delete individual loan',
      'description' : 'Delete individual loan from storage'
    }, {
      'permissionName' : 'circulation-storage.loans.collection.anonymize.user.post',
      'displayName' : 'Circulation storage - anonymize loans for a user',
      'description' : 'Anonymize closed loans for a single user'
    }, {
      'permissionName' : 'anonymize-storage-loans.post',
      'displayName' : 'circulation - anonymize loans',
      'description' : 'anonymize a list of loans'
    }, {
      'permissionName' : 'circulation-storage.circulation-rules.get',
      'displayName' : 'Circulation storage - get circulation rules',
      'description' : 'Get circulation rules from storage'
    }, {
      'permissionName' : 'circulation-storage.circulation-rules.put',
      'displayName' : 'Circulation storage - modify circulation rules',
      'description' : 'Modify circulation rules in storage'
    }, {
      'permissionName' : 'circulation-storage.loan-policies.collection.get',
      'displayName' : 'Circulation storage - get loan policy collection',
      'description' : 'Get loan policy collection from storage'
    }, {
      'permissionName' : 'circulation-storage.loan-policies.collection.delete',
      'displayName' : 'Circulation storage - delete entire loan collection',
      'description' : 'Delete entire loan collection from storage'
    }, {
      'permissionName' : 'circulation-storage.loan-policies.item.get',
      'displayName' : 'Circulation storage - get individual loan policy',
      'description' : 'Get individual loan policy from storage'
    }, {
      'permissionName' : 'circulation-storage.loan-policies.item.post',
      'displayName' : 'Circulation storage - create individual loan policy',
      'description' : 'Create individual loan policy in storage'
    }, {
      'permissionName' : 'circulation-storage.loan-policies.item.put',
      'displayName' : 'Circulation storage - modify loan policy',
      'description' : 'Modify loan policy in storage'
    }, {
      'permissionName' : 'circulation-storage.loan-policies.item.delete',
      'displayName' : 'Circulation storage - delete individual loan policy',
      'description' : 'Delete individual loan policy from storage'
    }, {
      'permissionName' : 'circulation-storage.loans-history.collection.get',
      'displayName' : 'Circulation storage - get loan history collection',
      'description' : 'Get loan history collection from storage'
    }, {
      'permissionName' : 'circulation-storage.requests.collection.get',
      'displayName' : 'Circulation storage - get request collection',
      'description' : 'Get request collection from storage'
    }, {
      'permissionName' : 'circulation-storage.requests.collection.delete',
      'displayName' : 'Circulation storage - delete entire request collection',
      'description' : 'Delete entire request collection from storage'
    }, {
      'permissionName' : 'circulation-storage.requests.item.get',
      'displayName' : 'Circulation storage - get individual request',
      'description' : 'Get individual request from storage'
    }, {
      'permissionName' : 'circulation-storage.requests.item.post',
      'displayName' : 'Circulation storage - create individual request',
      'description' : 'Create individual request in storage'
    }, {
      'permissionName' : 'circulation-storage.requests.item.put',
      'displayName' : 'Circulation storage - modify request',
      'description' : 'Modify request in storage'
    }, {
      'permissionName' : 'circulation-storage.request-batch.item.post',
      'displayName' : 'Circulation storage batch - modify requests',
      'description' : 'Modify requests in storage'
    }, {
      'permissionName' : 'circulation-storage.requests.item.delete',
      'displayName' : 'Circulation storage - delete individual request',
      'description' : 'Delete individual request from storage'
    }, {
      'permissionName' : 'circulation-storage.fixed-due-date-schedules.collection.get',
      'displayName' : 'Circulation storage - get fixed due date collection',
      'description' : 'Get fixed due date collection from storage'
    }, {
      'permissionName' : 'circulation-storage.fixed-due-date-schedules.item.get',
      'displayName' : 'Circulation storage - get individual fixed due date',
      'description' : 'Get individual fixed due date from storage'
    }, {
      'permissionName' : 'circulation-storage.fixed-due-date-schedules.item.post',
      'displayName' : 'Circulation storage - create individual fixed due date',
      'description' : 'Create individual fixed due date from storage'
    }, {
      'permissionName' : 'circulation-storage.fixed-due-date-schedules.item.put',
      'displayName' : 'Circulation storage - modify individual fixed due date',
      'description' : 'Modify individual fixed due date from storage'
    }, {
      'permissionName' : 'circulation-storage.fixed-due-date-schedules.item.delete',
      'displayName' : 'Circulation storage - delete individual fixed due date',
      'description' : 'Delete individual fixed due date from storage'
    }, {
      'permissionName' : 'circulation-storage.fixed-due-date-schedules.collection.delete',
      'displayName' : 'Circulation storage - delete collection of fixed due date',
      'description' : 'Delete collection of fixed due date from storage'
    }, {
      'permissionName' : 'circulation-storage.staff-slips.collection.get',
      'displayName' : 'Circulation storage - get staff slip collection from storage',
      'description' : 'Get staff slip collection from storage'
    }, {
      'permissionName' : 'circulation-storage.staff-slips.collection.delete',
      'displayName' : 'Circulation storage - delete entire staff slipp collection',
      'description' : 'Delete entire staff slip collection'
    }, {
      'permissionName' : 'circulation-storage.staff-slips.item.post',
      'displayName' : 'Circulation storage - create indavidual staff slip in storage',
      'description' : 'Create individual staff slip in storage'
    }, {
      'permissionName' : 'circulation-storage.staff-slips.item.get',
      'displayName' : 'Circulation storage - get indavidual staff slip from storage',
      'description' : 'Get individual staff slip from storage'
    }, {
      'permissionName' : 'circulation-storage.staff-slips.item.delete',
      'displayName' : 'Circulation storage - delete indavidual staff slip from storage',
      'description' : 'Delete individual staff slip from storage'
    }, {
      'permissionName' : 'circulation-storage.staff-slips.item.put',
      'displayName' : 'Circulation storage - modify indavidual staff slip in storage',
      'description' : 'Modify individual staff slip in storage'
    }, {
      'permissionName' : 'circulation-storage.cancellation-reasons.collection.get',
      'displayName' : 'Circulation storage - get cancellation reasons collection',
      'description' : 'Get cancellation reasons from storage'
    }, {
      'permissionName' : 'circulation-storage.cancellation-reasons.item.get',
      'displayName' : 'Circulation storage - get individual cancellation reason',
      'description' : 'Get individual cancellation reason by id'
    }, {
      'permissionName' : 'circulation-storage.cancellation-reasons.item.post',
      'displayName' : 'Circulation storage - create individual cancellation reason',
      'description' : 'Create individual cancellation reason'
    }, {
      'permissionName' : 'circulation-storage.cancellation-reasons.item.put',
      'displayName' : 'Circulation storage - put individual cancellation reason',
      'description' : 'Modify individual cancellation reason by id'
    }, {
      'permissionName' : 'circulation-storage.cancellation-reasons.collection.delete',
      'displayName' : 'Circulation storage - delete cancellation reasons',
      'description' : 'Delete entire cancellation reasons collection'
    }, {
      'permissionName' : 'circulation-storage.cancellation-reasons.item.delete',
      'displayName' : 'Circulation storage - delete individual cancellation reason',
      'description' : 'Delete individual cancellation reason by id'
    }, {
      'permissionName' : 'circulation-storage.patron-notice-policies.item.post',
      'displayName' : 'Circulation storage - post individual patron notice policy',
      'description' : 'Post individual patron notice policy'
    }, {
      'permissionName' : 'circulation-storage.patron-notice-policies.item.put',
      'displayName' : 'Circulation storage - put individual patron notice policy',
      'description' : 'Put individual patron notice policy by id'
    }, {
      'permissionName' : 'circulation-storage.patron-notice-policies.item.delete',
      'displayName' : 'Circulation storage - delete patron notice policy',
      'description' : 'Delete patron notice policy by id'
    }, {
      'permissionName' : 'circulation-storage.patron-notice-policies.collection.get',
      'displayName' : 'Circulation storage - get patron notice policy collection',
      'description' : 'Get patron notice policy collection from storage'
    }, {
      'permissionName' : 'circulation-storage.patron-notice-policies.item.get',
      'displayName' : 'Circulation storage - get individual patron notice policy',
      'description' : 'Get individual patron notice policy by id'
    }, {
      'permissionName' : 'circulation-storage.request-preferences.item.post',
      'displayName' : 'Circulation storage - post individual request preference',
      'description' : 'Post individual request preference'
    }, {
      'permissionName' : 'circulation-storage.request-preferences.item.put',
      'displayName' : 'Circulation storage - put individual request preference',
      'description' : 'Put individual request preference by id'
    }, {
      'permissionName' : 'circulation-storage.request-preferences.item.delete',
      'displayName' : 'Circulation storage - delete request preference',
      'description' : 'Delete request preference by id'
    }, {
      'permissionName' : 'circulation-storage.request-preferences.collection.get',
      'displayName' : 'Circulation storage - get request preference collection',
      'description' : 'Get request preference collection from storage'
    }, {
      'permissionName' : 'circulation-storage.request-preferences.item.get',
      'displayName' : 'Circulation storage - get individual request preference',
      'description' : 'Get individual request preference by id'
    }, {
      'permissionName' : 'scheduled-notice-storage.scheduled-notices.collection.get',
      'displayName' : 'Circulation storage - get scheduled notice collection',
      'description' : 'Get scheduled notice collection from storage'
    }, {
      'permissionName' : 'scheduled-notice-storage.scheduled-notices.item.get',
      'displayName' : 'Circulation storage - get individual scheduled notice',
      'description' : 'Get individual scheduled notice by id'
    }, {
      'permissionName' : 'scheduled-notice-storage.scheduled-notices.item.post',
      'displayName' : 'Circulation storage - post individual scheduled notice',
      'description' : 'Create individual scheduled notice'
    }, {
      'permissionName' : 'scheduled-notice-storage.scheduled-notices.item.put',
      'displayName' : 'Circulation storage - put individual scheduled notice',
      'description' : 'Put individual scheduled notice by id'
    }, {
      'permissionName' : 'scheduled-notice-storage.scheduled-notices.item.delete',
      'displayName' : 'Circulation storage - delete individual scheduled notice',
      'description' : 'Delete individual scheduled notice by id'
    }, {
      'permissionName' : 'scheduled-notice-storage.scheduled-notices.collection.delete',
      'displayName' : 'Circulation storage - delete all scheduled notices',
      'description' : 'Delete all scheduled notices from storage'
    }, {
      'permissionName' : 'patron-action-session-storage.patron-action-sessions.collection.get',
      'displayName' : 'Circulation storage - get patron action session collection',
      'description' : 'Get patron action session collection from storage'
    }, {
      'permissionName' : 'patron-action-session-storage.patron-action-sessions.item.get',
      'displayName' : 'Circulation storage - get patron action session',
      'description' : 'Get individual patron action session by id'
    }, {
      'permissionName' : 'patron-action-session-storage.patron-action-sessions.item.post',
      'displayName' : 'Circulation storage - post patron action session',
      'description' : 'Create individual patron action session'
    }, {
      'permissionName' : 'patron-action-session-storage.patron-action-sessions.item.put',
      'displayName' : 'Circulation storage - put patron action session',
      'description' : 'Put patron action session by id'
    }, {
      'permissionName' : 'patron-action-session-storage.patron-action-sessions.item.delete',
      'displayName' : 'Circulation storage - delete patron action session',
      'description' : 'Delete patron action session by id'
    }, {
      'permissionName' : 'circulation-storage.all',
      'displayName' : 'Circulation storage module - all permissions',
      'description' : 'Entire set of permissions needed to use the circulation storage module',
      'subPermissions' : ['circulation-storage.loans.collection.get', 'circulation-storage.loans.item.get', 'circulation-storage.loans.item.post', 'circulation-storage.loans.item.put', 'circulation-storage.loans.item.delete', 'circulation-storage.loans.collection.delete', 'circulation-storage.loans.collection.anonymize.user.post', 'circulation-storage.loans-history.collection.get', 'circulation-storage.circulation-rules.get', 'circulation-storage.circulation-rules.put', 'circulation-storage.loan-policies.collection.get', 'circulation-storage.loan-policies.item.get', 'circulation-storage.loan-policies.item.post', 'circulation-storage.loan-policies.item.put', 'circulation-storage.loan-policies.item.delete', 'circulation-storage.loan-policies.collection.delete', 'circulation-storage.requests.collection.get', 'circulation-storage.requests.item.get', 'circulation-storage.requests.item.post', 'circulation-storage.requests.item.put', 'circulation-storage.requests.item.delete', 'circulation-storage.requests.collection.delete', 'circulation-storage.fixed-due-date-schedules.collection.delete', 'circulation-storage.fixed-due-date-schedules.item.delete', 'circulation-storage.fixed-due-date-schedules.item.put', 'circulation-storage.fixed-due-date-schedules.item.post', 'circulation-storage.fixed-due-date-schedules.item.get', 'circulation-storage.fixed-due-date-schedules.collection.get', 'circulation-storage.staff-slips.item.delete', 'circulation-storage.staff-slips.collection.delete', 'circulation-storage.staff-slips.collection.get', 'circulation-storage.staff-slips.item.post', 'circulation-storage.staff-slips.item.put', 'circulation-storage.staff-slips.item.get', 'circulation-storage.cancellation-reasons.collection.get', 'circulation-storage.cancellation-reasons.item.get', 'circulation-storage.cancellation-reasons.item.post', 'circulation-storage.cancellation-reasons.item.put', 'circulation-storage.cancellation-reasons.collection.delete', 'circulation-storage.cancellation-reasons.item.delete', 'circulation-storage.patron-notice-policies.item.post', 'circulation-storage.patron-notice-policies.item.put', 'circulation-storage.patron-notice-policies.item.delete', 'circulation-storage.patron-notice-policies.collection.get', 'circulation-storage.patron-notice-policies.item.get', 'circulation-storage.request-preferences.item.post', 'circulation-storage.request-preferences.item.put', 'circulation-storage.request-preferences.item.delete', 'circulation-storage.request-preferences.collection.get', 'circulation-storage.request-preferences.item.get', 'circulation-storage.request-policies.collection.get', 'circulation-storage.request-policies.item.get', 'circulation-storage.request-policies.collection.delete', 'circulation-storage.request-policies.item.delete', 'circulation-storage.request-policies.item.post', 'circulation-storage.request-policies.item.put', 'circulation-storage.request-batch.item.post', 'scheduled-notice-storage.scheduled-notices.collection.get', 'scheduled-notice-storage.scheduled-notices.item.get', 'scheduled-notice-storage.scheduled-notices.item.post', 'scheduled-notice-storage.scheduled-notices.item.put', 'scheduled-notice-storage.scheduled-notices.item.delete', 'scheduled-notice-storage.scheduled-notices.collection.delete', 'anonymize-storage-loans.post', 'patron-action-session-storage.patron-action-sessions.collection.get', 'patron-action-session-storage.patron-action-sessions.item.get', 'patron-action-session-storage.patron-action-sessions.item.post', 'patron-action-session-storage.patron-action-sessions.item.put', 'patron-action-session-storage.patron-action-sessions.item.delete', 'patron-action-session-storage.expired-session-patron-ids.collection.get']
    }, {
      'permissionName' : 'circulation-storage.request-policies.collection.get',
      'displayName' : 'Circulation storage - get request policy collection',
      'description' : 'Get request policy collection from storage'
    }, {
      'permissionName' : 'circulation-storage.request-policies.collection.delete',
      'displayName' : 'Circulation storage - delete entire request policy collection',
      'description' : 'Delete entire request policy collection from storage'
    }, {
      'permissionName' : 'circulation-storage.request-policies.item.get',
      'displayName' : 'Circulation storage - get individual request policy',
      'description' : 'Get individual request policy from storage'
    }, {
      'permissionName' : 'circulation-storage.request-policies.item.post',
      'displayName' : 'Circulation storage - create individual request policy',
      'description' : 'Create individual request policy in storage'
    }, {
      'permissionName' : 'circulation-storage.request-policies.item.put',
      'displayName' : 'Circulation storage - modify individual request policy',
      'description' : 'Modify request policy in storage'
    }, {
      'permissionName' : 'circulation-storage.request-policies.item.delete',
      'displayName' : 'Circulation storage - delete individual request policy',
      'description' : 'Delete individual request policy from storage'
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-circulation-storage:10.1.0-SNAPSHOT.226',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 536870912
        }
      }
    }
  }, {
    'id' : 'mod-codex-ekb-1.5.1-SNAPSHOT.99',
    'name' : 'EBSCO Knowledge Base Codex',
    'requires' : [{
      'id' : 'configuration',
      'version' : '2.0'
    }],
    'provides' : [{
      'id' : 'codex',
      'version' : '3.1',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances',
        'permissionsRequired' : ['codex-ekb.instances.collection.get'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances/{id}',
        'permissionsRequired' : ['codex-ekb.instances.item.get'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances-sources',
        'permissionsRequired' : ['codex-ekb.instances-sources.collection.get']
      }]
    }, {
      'id' : 'codex-packages',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/codex-packages',
        'permissionsRequired' : ['codex-ekb.packages.collection.get'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-packages/{id}',
        'permissionsRequired' : ['codex-ekb.packages.item.get'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-packages-sources',
        'permissionsRequired' : ['codex-ekb.packages-sources.collection.get']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }, {
      'id' : '_ramls',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/ramls'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'codex-ekb.instances.collection.get',
      'displayName' : 'Codex - get instances',
      'description' : 'Get instance collection'
    }, {
      'permissionName' : 'codex-ekb.instances.item.get',
      'displayName' : 'Codex - get individual instance',
      'description' : 'Get individual instance'
    }, {
      'permissionName' : 'codex-ekb.instances-sources.collection.get',
      'displayName' : 'get codex instances sources',
      'description' : 'Get codex instances sources'
    }, {
      'permissionName' : 'codex-ekb.packages.collection.get',
      'displayName' : 'Codex - get packages',
      'description' : 'Get package collection'
    }, {
      'permissionName' : 'codex-ekb.packages.item.get',
      'displayName' : 'Codex - get individual package',
      'description' : 'Get individual package'
    }, {
      'permissionName' : 'codex-ekb.packages-sources.collection.get',
      'displayName' : 'get codex package sources',
      'description' : 'Get codex package sources'
    }, {
      'permissionName' : 'codex-ekb.all',
      'displayName' : 'Codex - all permissions',
      'description' : 'Entire set of permissions needed to use the codex module',
      'subPermissions' : ['codex-ekb.instances.collection.get', 'codex-ekb.instances.item.get', 'codex-ekb.instances-sources.collection.get', 'codex-ekb.packages.collection.get', 'codex-ekb.packages.item.get', 'codex-ekb.packages-sources.collection.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-codex-ekb:1.5.1-SNAPSHOT.99',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-codex-inventory-1.6.0-SNAPSHOT.75',
    'name' : 'Codex wrapper for Inventory',
    'requires' : [{
      'id' : 'instance-storage',
      'version' : '7.0'
    }, {
      'id' : 'contributor-name-types',
      'version' : '1.0'
    }, {
      'id' : 'instance-types',
      'version' : '1.0 2.0'
    }, {
      'id' : 'instance-formats',
      'version' : '1.0 2.0'
    }, {
      'id' : 'identifier-types',
      'version' : '1.0'
    }, {
      'id' : 'locations',
      'version' : '2.1 3.0'
    }],
    'provides' : [{
      'id' : 'codex',
      'version' : '3.2',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances'
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances/{id}'
      }]
    }],
    'permissionSets' : [],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-codex-inventory:1.6.0-SNAPSHOT.75',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-codex-mux-2.7.1-SNAPSHOT.90',
    'name' : 'Codex Multiplexer',
    'requires' : [],
    'provides' : [{
      'id' : 'codex',
      'version' : '3.3',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances',
        'permissionsRequired' : ['codex-mux.instances.collection.get'],
        'modulePermissions' : ['codex-ekb.instances.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances/{id}',
        'permissionsRequired' : ['codex-mux.instances.item.get'],
        'modulePermissions' : ['codex-ekb.instances.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-instances-sources',
        'permissionsRequired' : ['codex-mux.instances-sources.collection.get'],
        'modulePermissions' : ['codex-ekb.instances-sources.collection.get']
      }]
    }, {
      'id' : 'codex-packages',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/codex-packages',
        'permissionsRequired' : ['codex-mux.packages.collection.get'],
        'modulePermissions' : ['codex-ekb.packages.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-packages/{id}',
        'permissionsRequired' : ['codex-mux.packages.item.get'],
        'modulePermissions' : ['codex-ekb.packages.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/codex-packages-sources',
        'permissionsRequired' : ['codex-mux.packages-sources.collection.get'],
        'modulePermissions' : ['codex-ekb.packages-sources.collection.get']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }, {
      'id' : '_ramls',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/ramls'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'codex-mux.instances.collection.get',
      'displayName' : 'get codex instances',
      'description' : 'Get codex instances'
    }, {
      'permissionName' : 'codex-mux.instances.item.get',
      'displayName' : 'get codex instance',
      'description' : 'Get codex instance'
    }, {
      'permissionName' : 'codex-mux.instances-sources.collection.get',
      'displayName' : 'get codex instances sources',
      'description' : 'Get codex instances sources'
    }, {
      'permissionName' : 'codex-mux.packages.collection.get',
      'displayName' : 'get codex packages',
      'description' : 'Get codex packages'
    }, {
      'permissionName' : 'codex-mux.packages.item.get',
      'displayName' : 'get codex package',
      'description' : 'Get codex package'
    }, {
      'permissionName' : 'codex-mux.packages-sources.collection.get',
      'displayName' : 'get codex package sources',
      'description' : 'Get codex package sources'
    }, {
      'permissionName' : 'codex-mux.all',
      'displayName' : 'Codex Multiplexer - all permissions',
      'description' : 'All permissions for Codex Multiplexer',
      'subPermissions' : ['codex-mux.instances.collection.get', 'codex-mux.instances.item.get', 'codex-mux.instances-sources.collection.get', 'codex-mux.packages.collection.get', 'codex-mux.packages.item.get', 'codex-mux.packages-sources.collection.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-codex-mux:2.7.1-SNAPSHOT.90',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-configuration-5.4.0-SNAPSHOT.68',
    'name' : 'Configuration',
    'provides' : [{
      'id' : 'configuration',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/configurations/entries',
        'permissionsRequired' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/configurations/entries/{id}',
        'permissionsRequired' : ['configuration.entries.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/configurations/entries',
        'permissionsRequired' : ['configuration.entries.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/configurations/entries/{id}',
        'permissionsRequired' : ['configuration.entries.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/configurations/entries/{id}',
        'permissionsRequired' : ['configuration.entries.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/configurations/audit',
        'permissionsRequired' : ['configuration.audit.collection.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'configuration.entries.collection.get',
      'displayName' : 'configuration - get configuration entries collection',
      'description' : 'get configuration entries from storage'
    }, {
      'permissionName' : 'configuration.entries.item.get',
      'displayName' : 'configuration - get configuration entry',
      'description' : 'get individual configuration entry from storage'
    }, {
      'permissionName' : 'configuration.entries.item.post',
      'displayName' : 'configuration - create configuration entry',
      'description' : 'create individual configuration entry in storage'
    }, {
      'permissionName' : 'configuration.entries.item.put',
      'displayName' : 'configuration - modify configuration entry',
      'description' : 'modify individual configuration entry in storage'
    }, {
      'permissionName' : 'configuration.entries.item.delete',
      'displayName' : 'configuration - delete configuration entry',
      'description' : 'delete individual configuration entry in storage'
    }, {
      'permissionName' : 'configuration.audit.collection.get',
      'displayName' : 'configuration - get configuration audit entries collection',
      'description' : 'get configuration audit entries from storage'
    }, {
      'permissionName' : 'configuration.all',
      'displayName' : 'configuration module - all permissions',
      'description' : 'entire set of permissions needed to use the configuration module',
      'subPermissions' : ['configuration.entries.collection.get', 'configuration.entries.item.get', 'configuration.entries.item.post', 'configuration.entries.item.put', 'configuration.entries.item.delete', 'configuration.audit.collection.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-configuration:5.4.0-SNAPSHOT.68',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-courses-0.0.17-SNAPSHOT.57',
    'name' : 'Courses Storage Module',
    'requires' : [{
      'id' : 'item-storage',
      'version' : '7.0 8.0'
    }, {
      'id' : 'instance-storage',
      'version' : '7.2'
    }, {
      'id' : 'holdings-storage',
      'version' : '2.0 3.0 4.0'
    }, {
      'id' : 'locations',
      'version' : '2.0 3.0'
    }, {
      'id' : 'service-points',
      'version' : '3.0'
    }],
    'provides' : [{
      'id' : 'course-reserves-storage',
      'version' : '0.3',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings',
        'permissionsRequired' : ['course-reserves-storage.courselistings.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/courselistings',
        'permissionsRequired' : ['course-reserves-storage.courselistings.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings/{id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/courselistings/{id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/courselistings/{id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings/{id}/courses',
        'permissionsRequired' : ['course-reserves-storage.courselistings.courses.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/courselistings/{id}/courses',
        'permissionsRequired' : ['course-reserves-storage.courselisting.courses.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings/{id}/courses/{c_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.courses.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/courselistings/{id}/courses/{c_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.courses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/courselistings/{id}/courses/{c_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.courses.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings/{id}/instructors',
        'permissionsRequired' : ['course-reserves-storage.courselistings.instructors.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/courselistings/{id}/instructors',
        'permissionsRequired' : ['course-reserves-storage.courselistings.instructors.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings/{id}/instructors/{i_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.instructors.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/courselistingss/{id}/instructors/{i_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.instructors.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/courselistings/{id}/instructors/{i_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.instructors.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings/{id}/reserves',
        'permissionsRequired' : ['course-reserves-storage.courselistings.reserves.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/courselistings/{id}/reserves',
        'permissionsRequired' : ['course-reserves-storage.courselistings.reserves.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courselistings/{id}/reserves/{r_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.reserves.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/courselistings/{id}/reserves/{r_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.reserves.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/courselistings/{id}/reserves/{r_id}',
        'permissionsRequired' : ['course-reserves-storage.courselistings.reserves.item.delete']
      }]
    }, {
      'id' : 'term-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/terms',
        'permissionsRequired' : ['course-reserves-storage.terms.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/terms',
        'permissionsRequired' : ['course-reserves-storage.terms.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/terms/{id}',
        'permissionsRequired' : ['course-reserves-storage.terms.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/terms/{id}',
        'permissionsRequired' : ['course-reserves-storage.terms.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/terms/{id}',
        'permissionsRequired' : ['course-reserves-storage.terms.item.delete']
      }]
    }, {
      'id' : 'department-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/departments',
        'permissionsRequired' : ['course-reserves-storage.departments.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/departments',
        'permissionsRequired' : ['course-reserves-storage.departments.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/departments/{id}',
        'permissionsRequired' : ['course-reserves-storage.departments.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/departments/{id}',
        'permissionsRequired' : ['course-reserves-storage.departments.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/departments/{id}',
        'permissionsRequired' : ['course-reserves-storage.departments.item.delete']
      }]
    }, {
      'id' : 'course-type-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/coursetypes',
        'permissionsRequired' : ['course-reserves-storage.course-types.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/coursetypes',
        'permissionsRequired' : ['course-reserves-storage.course-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/coursetypes/{id}',
        'permissionsRequired' : ['course-reserves-storage.course-types.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/coursetypes/{id}',
        'permissionsRequired' : ['course-reserves-storage.course-types.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/coursetypes/{id}',
        'permissionsRequired' : ['course-reserves-storage.course-types.item.delete']
      }]
    }, {
      'id' : 'processing-status-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/processingstatuses',
        'permissionsRequired' : ['course-reserves-storage.processing-statuses.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/processingstatuses/{id}',
        'permissionsRequired' : ['course-reserves-storage.processing-statuses.item.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/processingstatuses',
        'permissionsRequired' : ['course-reserves-storage.processing-statuses.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/processingstatuses/{id}',
        'permissionsRequired' : ['course-reserves-storage.processing-statuses.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/processingstatuses/{id}',
        'permissionsRequired' : ['course-reserves-storage.processing-statuses.item.delete']
      }]
    }, {
      'id' : 'copyright-status-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/copyrightstatuses',
        'permissionsRequired' : ['course-reserves-storage.copyright-statuses.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/copyrightstatuses',
        'permissionsRequired' : ['course-reserves-storage.copyright-statuses.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/copyrightstatuses/{id}',
        'permissionsRequired' : ['course-reserves-storage.copyright-statuses.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/copyrightstatuses/{id}',
        'permissionsRequired' : ['course-reserves-storage.copyright-statuses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/copyrightstatuses/{id}',
        'permissionsRequired' : ['course-reserves-storage.copyright-statuses.item.delete']
      }]
    }, {
      'id' : 'role-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/roles',
        'permissionsRequired' : ['course-reserves-storage.roles.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/roles',
        'permissionsRequired' : ['course-reserves-storage.roles.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/roles/{id}',
        'permissionsRequired' : ['course-reserves-storage.roles.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/roles/{id}',
        'permissionsRequired' : ['course-reserves-storage.roles.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/roles/{id}',
        'permissionsRequired' : ['course-reserves-storage.roles.item.delete']
      }]
    }, {
      'id' : 'course-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courses',
        'permissionsRequired' : ['course-reserves-storage.courses.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/courses',
        'permissionsRequired' : ['course-reserves-storage.courses.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/courses/{id}',
        'permissionsRequired' : ['course-reserves-storage.courses.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/courses/{id}',
        'permissionsRequired' : ['course-reserves-storage.courses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/courses/{id}',
        'permissionsRequired' : ['course-reserves-storage.courses.item.delete']
      }]
    }, {
      'id' : 'reserves-storage',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/reserves',
        'permissionsRequired' : ['course-reserves-storage.reserves.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/coursereserves/reserves',
        'permissionsRequired' : ['course-reserves-storage.reserves.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/coursereserves/reserves/{id}',
        'permissionsRequired' : ['course-reserves-storage.reserves.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/coursereserves/reserves/{id}',
        'permissionsRequired' : ['course-reserves-storage.reserves.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/coursereserves/reserves/{id}',
        'permissionsRequired' : ['course-reserves-storage.reserves.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'course-reserves-storage.courselistings.collection.get',
      'displayName' : 'course reserves get courselistings collection',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.item.post',
      'displayName' : 'course reserves post courselistings item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.item.get',
      'displayName' : 'course reserves get courselisting item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.item.put',
      'displayName' : 'course reserves put courselisting item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.item.delete',
      'displayName' : 'course reserves delete courselisting item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.courses.collection.get',
      'displayName' : 'course reserves get courses collection for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselisting.courses.item.post',
      'displayName' : 'course reserves post course item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.courses.item.get',
      'displayName' : 'course reserves get course item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.courses.item.put',
      'displayName' : 'course reserves put course item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.courses.item.delete',
      'displayName' : 'course reserves delete course item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.instructors.collection.get',
      'displayName' : 'course reserves get instructors collection for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.instructors.item.post',
      'displayName' : 'course reserves post instructors item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.instructors.item.get',
      'displayName' : 'course reserves get instructors item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.instructors.item.put',
      'displayName' : 'course reserves put instructors item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.instructors.item.delete',
      'displayName' : 'course reserves delete instructors item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.reserves.collection.get',
      'displayName' : 'course reserves get reserves collection for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.reserves.item.post',
      'displayName' : 'course reserves post reserves item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.reserves.item.get',
      'displayName' : 'course reserves get reserves item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.reserves.item.put',
      'displayName' : 'course reserves put reserves item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.reserves.item.delete',
      'displayName' : 'course reserves delete reserves item for courselisting',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.read',
      'displayName' : 'read permissions for coursereserves courselisting',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.courselistings.collection.get', 'course-reserves-storage.courselistings.item.get', 'course-reserves-storage.courselistings.courses.collection.get', 'course-reserves-storage.courselistings.courses.item.get', 'course-reserves-storage.courselistings.instructors.collection.get', 'course-reserves-storage.courselistings.instructors.item.get', 'course-reserves-storage.courselistings.reserves.collection.get', 'course-reserves-storage.courselistings.reserves.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.courselistings.write',
      'displayName' : 'write permissions for coursereserves courselisting',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.courselistings.read', 'course-reserves-storage.courselistings.item.post', 'course-reserves-storage.courselistings.item.put', 'course-reserves-storage.courselistings.item.delete', 'course-reserves-storage.courselisting.courses.item.post', 'course-reserves-storage.courselistings.courses.item.put', 'course-reserves-storage.courselistings.courses.item.delete', 'course-reserves-storage.courselistings.instructors.item.post', 'course-reserves-storage.courselistings.instructors.item.put', 'course-reserves-storage.courselistings.instructors.item.delete', 'course-reserves-storage.courselistings.reserves.item.post', 'course-reserves-storage.courselistings.reserves.item.put', 'course-reserves-storage.courselistings.reserves.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.terms.collection.get',
      'displayName' : 'course reserves get terms collection',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.terms.item.post',
      'displayName' : 'course reserves post terms item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.terms.item.get',
      'displayName' : 'course reserves get terms item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.terms.item.put',
      'displayName' : 'course reserves put terms item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.terms.item.delete',
      'displayName' : 'course reserves delete terms item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.terms.read',
      'displayName' : 'course reserves terms read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.terms.collection.get', 'course-reserves-storage.terms.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.terms.write',
      'displayName' : 'course reserves terms write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.terms.read', 'course-reserves-storage.terms.item.post', 'course-reserves-storage.terms.item.put', 'course-reserves-storage.terms.item.put', 'course-reserves-storage.terms.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.departments.collection.get',
      'displayName' : 'course reserves get departments collection',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.departments.item.post',
      'displayName' : 'course reserves post departments item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.departments.item.get',
      'displayName' : 'course reserves get departments item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.departments.item.put',
      'displayName' : 'course reserves put departments item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.departments.item.delete',
      'displayName' : 'course reserves delete departments item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.departments.read',
      'displayName' : 'course reserves departments read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.departments.collection.get', 'course-reserves-storage.departments.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.departments.write',
      'displayName' : 'course reserves departments write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.departments.read', 'course-reserves-storage.departments.item.post', 'course-reserves-storage.departments.item.put', 'course-reserves-storage.departments.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.course-types.collection.get',
      'displayName' : 'course reserves get course types collection',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.course-types.item.post',
      'displayName' : 'course reserves post course types item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.course-types.item.put',
      'displayName' : 'course reserves put course types item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.course-types.item.get',
      'displayName' : 'course reserves get course types item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.course-types.item.delete',
      'displayName' : 'course reserves delete course types item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.course-types.read',
      'displayName' : 'course reserves course storage read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.course-types.collection.get', 'course-reserves-storage.course-types.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.course-types.write',
      'displayName' : 'course reserves course storage write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.course-types.read', 'course-reserves-storage.course-types.item.post', 'course-reserves-storage.course-types.item.put', 'course-reserves-storage.course-types.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.processing-statuses.collection.get',
      'displayName' : 'course reserves get processing statuses collection',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.processing-statuses.item.put',
      'displayName' : 'course reserves put processing statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.processing-statuses.item.post',
      'displayName' : 'course reserves post processing statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.processing-statuses.item.get',
      'displayName' : 'course reserves get processing statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.processing-statuses.item.delete',
      'displayName' : 'course reserves delete processing statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.processing-statuses.read',
      'displayName' : 'course reserves processing statuses read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.processing-statuses.collection.get', 'course-reserves-storage.processing-statuses.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.processing-statuses.write',
      'displayName' : 'course reserves processing statuses write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.processing-statuses.read', 'course-reserves-storage.processing-statuses.item.put', 'course-reserves-storage.processing-statuses.item.post', 'course-reserves-storage.processing-statuses.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.copyright-statuses.collection.get',
      'displayName' : 'course reserves get copyright statuses collection',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.copyright-statuses.item.put',
      'displayName' : 'course reserves put copyright statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.copyright-statuses.item.post',
      'displayName' : 'course reserves post copyright statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.copyright-statuses.item.get',
      'displayName' : 'course reserves get copyright statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.copyright-statuses.item.delete',
      'displayName' : 'course reserves delete copyright statuses item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.copyright-statuses.read',
      'displayName' : 'course reserves copyright statuses read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.copyright-statuses.collection.get', 'course-reserves-storage.copyright-statuses.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.copyright-statuses.write',
      'displayName' : 'course reserves copyright statuses write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.copyright-statuses.read', 'course-reserves-storage.copyright-statuses.item.put', 'course-reserves-storage.copyright-statuses.item.post', 'course-reserves-storage.copyright-statuses.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.roles.collection.get',
      'displayName' : 'course reserves get roles collection',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.roles.item.post',
      'displayName' : 'course reserves post roles item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.roles.item.get',
      'displayName' : 'course reserves get roles item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.roles.item.put',
      'displayName' : 'course reserves put roles item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.roles.item.delete',
      'displayName' : 'course reserves delete roles item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.roles.read',
      'displayName' : 'course reserves roles read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.roles.collection.get', 'course-reserves-storage.roles.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.roles.write',
      'displayName' : 'course reserves roles write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.roles.read', 'course-reserves-storage.roles.item.post', 'course-reserves-storage.roles.item.put', 'course-reserves-storage.roles.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.courses.collection.get',
      'displayName' : 'course reserves get course listing',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courses.item.post',
      'displayName' : 'course reserves post course item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courses.item.get',
      'displayName' : 'course reserves get course item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courses.item.put',
      'displayName' : 'course reserves put course item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courses.item.delete',
      'displayName' : 'course reserves delete course item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.courses.read',
      'displayName' : 'course reserves courses read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.courses.collection.get', 'course-reserves-storage.courses.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.courses.write',
      'displayName' : 'course reserves courses write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.courses.read', 'course-reserves-storage.courses.item.post', 'course-reserves-storage.courses.item.put', 'course-reserves-storage.courses.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.reserves.collection.get',
      'displayName' : 'course reserves get reserve listing',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.reserves.item.post',
      'displayName' : 'course reserves post reserve item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.reserves.item.get',
      'displayName' : 'course reserves get reserve item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.reserves.item.put',
      'displayName' : 'course reserves put reserve item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.reserves.item.delete',
      'displayName' : 'course reserves delete reserve item',
      'description' : 'pending'
    }, {
      'permissionName' : 'course-reserves-storage.reserves.read',
      'displayName' : 'course reserves reserves read permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.reserves.collection.get', 'course-reserves-storage.reserves.item.get'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.reserves.write',
      'displayName' : 'course reserves reserves write permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.reserves.read', 'course-reserves-storage.reserves.item.post', 'course-reserves-storage.reserves.item.put', 'course-reserves-storage.reserves.item.delete'],
      'visible' : true
    }, {
      'permissionName' : 'course-reserves-storage.all',
      'displayName' : 'course reserves all permissions',
      'description' : 'pending',
      'subPermissions' : ['course-reserves-storage.terms.write', 'course-reserves-storage.courselistings.write', 'course-reserves-storage.roles.write', 'course-reserves-storage.departments.write', 'course-reserves-storage.course-types.write', 'course-reserves-storage.processing-statuses.write', 'course-reserves-storage.copyright-statuses.write', 'course-reserves-storage.courses.write', 'course-reserves-storage.reserves.write'],
      'visible' : true
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-courses:0.0.17-SNAPSHOT.57',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-data-import-1.9.0-SNAPSHOT.107',
    'name' : 'Data Import Module',
    'requires' : [{
      'id' : 'source-manager-job-executions',
      'version' : '1.0'
    }, {
      'id' : 'source-manager-records',
      'version' : '1.0'
    }, {
      'id' : 'users',
      'version' : '15.0'
    }],
    'provides' : [{
      'id' : 'data-import',
      'version' : '3.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/data-import/uploadDefinitions',
        'permissionsRequired' : ['data-import.uploaddefinitions.post'],
        'modulePermissions' : ['configuration.entries.collection.get', 'change-manager.jobexecutions.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import/uploadDefinitions',
        'permissionsRequired' : ['data-import.uploaddefinitions.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import/uploadDefinitions/{uploadDefinitionId}',
        'permissionsRequired' : ['data-import.uploaddefinitions.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/data-import/uploadDefinitions/{uploadDefinitionId}',
        'permissionsRequired' : ['data-import.uploaddefinitions.put'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import/uploadDefinitions/{uploadDefinitionId}',
        'permissionsRequired' : ['data-import.uploaddefinitions.delete'],
        'modulePermissions' : ['change-manager.jobexecutions.get', 'change-manager.jobexecutions.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import/uploadDefinitions/{uploadDefinitionId}/files/{fileId}',
        'permissionsRequired' : ['data-import.upload.file.post'],
        'modulePermissions' : ['configuration.entries.collection.get', 'change-manager.jobexecutions.post', 'change-manager.jobexecutions.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import/uploadDefinitions/{uploadDefinitionId}/files',
        'permissionsRequired' : ['data-import.uploaddefinitions.files.post'],
        'modulePermissions' : ['configuration.entries.collection.get', 'change-manager.jobexecutions.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import/uploadDefinitions/{uploadDefinitionId}/files/{fileId}',
        'permissionsRequired' : ['data-import.uploaddefinitions.files.delete'],
        'modulePermissions' : ['configuration.entries.collection.get', 'change-manager.jobexecutions.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import/uploadDefinitions/{uploadDefinitionId}/processFiles',
        'permissionsRequired' : ['data-import.uploaddefinitions.files.post'],
        'modulePermissions' : ['change-manager.jobexecutions.get', 'change-manager.jobexecutions.put', 'change-manager.records.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import/fileExtensions',
        'permissionsRequired' : ['data-import.fileExtensions.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import/fileExtensions',
        'permissionsRequired' : ['data-import.fileExtensions.post'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import/fileExtensions/{id}',
        'permissionsRequired' : ['data-import.fileExtensions.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/data-import/fileExtensions/{id}',
        'permissionsRequired' : ['data-import.fileExtensions.put'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import/fileExtensions/{id}',
        'permissionsRequired' : ['data-import.fileExtensions.delete']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import/fileExtensions/restore/default',
        'permissionsRequired' : ['data-import.fileExtensions.default']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import/dataTypes',
        'permissionsRequired' : ['data-import.datatypes.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'data-import.uploaddefinitions.post',
      'displayName' : 'Data Import - create new upload definition',
      'description' : 'Post Upload Definition'
    }, {
      'permissionName' : 'data-import.uploaddefinitions.get',
      'displayName' : 'Data Import - get upload definition',
      'description' : 'Get Upload Definition'
    }, {
      'permissionName' : 'data-import.uploaddefinitions.put',
      'displayName' : 'Data Import - update upload definition',
      'description' : 'Put Upload Definition'
    }, {
      'permissionName' : 'data-import.uploaddefinitions.delete',
      'displayName' : 'Data Import - delete upload definition',
      'description' : 'Delete Upload Definition'
    }, {
      'permissionName' : 'data-import.upload.file.post',
      'displayName' : 'Data Import - upload file into the storage',
      'description' : 'Upload file'
    }, {
      'permissionName' : 'data-import.uploaddefinitions.files.delete',
      'displayName' : 'Data Import - delete file from upload definition and storage',
      'description' : 'Delete file'
    }, {
      'permissionName' : 'data-import.uploaddefinitions.files.post',
      'displayName' : 'Data Import - Create new File Definition',
      'description' : 'Create and handle File Definition'
    }, {
      'permissionName' : 'data-import.fileExtensions.get',
      'displayName' : 'Data Import - get file extension(s)',
      'description' : 'Get FileExtension(s)'
    }, {
      'permissionName' : 'data-import.fileExtensions.post',
      'displayName' : 'Data Import - create new file extension',
      'description' : 'Post FileExtension'
    }, {
      'permissionName' : 'data-import.fileExtensions.put',
      'displayName' : 'Data Import - update file extension',
      'description' : 'Put FileExtension'
    }, {
      'permissionName' : 'data-import.fileExtensions.delete',
      'displayName' : 'Data Import - delete file extension',
      'description' : 'Delete FileExtension'
    }, {
      'permissionName' : 'data-import.fileExtensions.default',
      'displayName' : 'Data Import - restore file extensions to default',
      'description' : 'Restore FileExtension to default'
    }, {
      'permissionName' : 'data-import.datatypes.get',
      'displayName' : 'Data Import - get data types',
      'description' : 'Get DataTypes'
    }, {
      'permissionName' : 'data-import.upload.all',
      'displayName' : 'Data Import File Upload - all permissions',
      'description' : 'Entire set of permissions needed to use file uploads',
      'subPermissions' : ['data-import.upload.file.post', 'data-import.uploaddefinitions.post', 'data-import.uploaddefinitions.get', 'data-import.uploaddefinitions.put', 'data-import.uploaddefinitions.delete', 'data-import.uploaddefinitions.files.delete', 'data-import.uploaddefinitions.files.post', 'data-import.fileExtensions.get', 'data-import.fileExtensions.post', 'data-import.fileExtensions.put', 'data-import.fileExtensions.delete', 'data-import.fileExtensions.default', 'data-import.datatypes.get'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-data-import:1.9.0-SNAPSHOT.107',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 542293850
        }
      }
    }
  }, {
    'id' : 'mod-data-import-converter-storage-1.7.0-SNAPSHOT.77',
    'name' : 'Data Import Converter Storage',
    'requires' : [],
    'provides' : [{
      'id' : 'data-import-converter-storage',
      'version' : '1.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/jobProfiles',
        'permissionsRequired' : ['converter-storage.jobprofile.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import-profiles/jobProfiles',
        'permissionsRequired' : ['converter-storage.jobprofile.post'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/jobProfiles/{id}',
        'permissionsRequired' : ['converter-storage.jobprofile.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/data-import-profiles/jobProfiles/{id}',
        'permissionsRequired' : ['converter-storage.jobprofile.put'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import-profiles/jobProfiles/{id}',
        'permissionsRequired' : ['converter-storage.jobprofile.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/matchProfiles',
        'permissionsRequired' : ['converter-storage.matchprofile.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import-profiles/matchProfiles',
        'permissionsRequired' : ['converter-storage.matchprofile.post'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/matchProfiles/{id}',
        'permissionsRequired' : ['converter-storage.matchprofile.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/data-import-profiles/matchProfiles/{id}',
        'permissionsRequired' : ['converter-storage.matchprofile.put'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import-profiles/matchProfiles/{id}',
        'permissionsRequired' : ['converter-storage.matchprofile.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/actionProfiles',
        'permissionsRequired' : ['converter-storage.actionprofile.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import-profiles/actionProfiles',
        'permissionsRequired' : ['converter-storage.actionprofile.post'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/actionProfiles/{id}',
        'permissionsRequired' : ['converter-storage.actionprofile.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/data-import-profiles/actionProfiles/{id}',
        'permissionsRequired' : ['converter-storage.actionprofile.put'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import-profiles/actionProfiles/{id}',
        'permissionsRequired' : ['converter-storage.actionprofile.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/mappingProfiles',
        'permissionsRequired' : ['converter-storage.mappingprofile.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import-profiles/mappingProfiles',
        'permissionsRequired' : ['converter-storage.mappingprofile.post'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/mappingProfiles/{id}',
        'permissionsRequired' : ['converter-storage.mappingprofile.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/data-import-profiles/mappingProfiles/{id}',
        'permissionsRequired' : ['converter-storage.mappingprofile.put'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import-profiles/mappingProfiles/{id}',
        'permissionsRequired' : ['converter-storage.mappingprofile.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/profileAssociations',
        'permissionsRequired' : ['converter-storage.profileassociation.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import-profiles/profileAssociations',
        'permissionsRequired' : ['converter-storage.profileassociation.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/profileAssociations/{id}',
        'permissionsRequired' : ['converter-storage.profileassociation.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/data-import-profiles/profileAssociations/{id}',
        'permissionsRequired' : ['converter-storage.profileassociation.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/data-import-profiles/profileAssociations/{id}',
        'permissionsRequired' : ['converter-storage.profileassociation.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/profileAssociations/{masterId}/details',
        'permissionsRequired' : ['converter-storage.profileassociation.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/profileAssociations/{detailId}/masters',
        'permissionsRequired' : ['converter-storage.profileassociation.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/jobProfileSnapshots/{id}',
        'permissionsRequired' : ['converter-storage.jobprofilesnapshots.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/data-import-profiles/jobProfileSnapshots/{id}',
        'permissionsRequired' : ['converter-storage.jobprofilesnapshots.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/entityTypes',
        'permissionsRequired' : ['converter-storage.entitytypes.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/data-import-profiles/profileSnapshots/{jobProfileId}',
        'permissionsRequired' : ['converter-storage.profileSnapshots.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'converter-storage.jobprofile.get',
      'displayName' : 'Data Import Converter Storage - get Job Profile(s)',
      'description' : 'Get Job Profile(s)'
    }, {
      'permissionName' : 'converter-storage.jobprofile.post',
      'displayName' : 'Data Import Converter Storage - create Job Profile',
      'description' : 'Post Job Profile'
    }, {
      'permissionName' : 'converter-storage.jobprofile.put',
      'displayName' : 'Data Import Converter Storage - update Job Profile',
      'description' : 'Put Job Profile'
    }, {
      'permissionName' : 'converter-storage.jobprofile.delete',
      'displayName' : 'Data Import Converter Storage - delete Job Profile',
      'description' : 'Delete Job Profile'
    }, {
      'permissionName' : 'converter-storage.matchprofile.get',
      'displayName' : 'Data Import Converter Storage - get Match Profile(s)',
      'description' : 'Get Match Profile(s)'
    }, {
      'permissionName' : 'converter-storage.matchprofile.post',
      'displayName' : 'Data Import Converter Storage - create Match Profile',
      'description' : 'Post Match Profile'
    }, {
      'permissionName' : 'converter-storage.matchprofile.put',
      'displayName' : 'Data Import Converter Storage - update Match Profile',
      'description' : 'Put Match Profile'
    }, {
      'permissionName' : 'converter-storage.matchprofile.delete',
      'displayName' : 'Data Import Converter Storage - delete Match Profile',
      'description' : 'Delete Match Profile'
    }, {
      'permissionName' : 'converter-storage.actionprofile.get',
      'displayName' : 'Data Import Converter Storage - get Action Profile(s)',
      'description' : 'Get Action Profile(s)'
    }, {
      'permissionName' : 'converter-storage.actionprofile.post',
      'displayName' : 'Data Import Converter Storage - create Action Profile',
      'description' : 'Post Action Profile'
    }, {
      'permissionName' : 'converter-storage.actionprofile.put',
      'displayName' : 'Data Import Converter Storage - update Action Profile',
      'description' : 'Put Action Profile'
    }, {
      'permissionName' : 'converter-storage.actionprofile.delete',
      'displayName' : 'Data Import Converter Storage - delete Action Profile',
      'description' : 'Delete Action Profile'
    }, {
      'permissionName' : 'converter-storage.mappingprofile.get',
      'displayName' : 'Data Import Converter Storage - get Mapping Profile(s)',
      'description' : 'Get Mapping Profile(s)'
    }, {
      'permissionName' : 'converter-storage.mappingprofile.post',
      'displayName' : 'Data Import Converter Storage - create Mapping Profile',
      'description' : 'Post Mapping Profile'
    }, {
      'permissionName' : 'converter-storage.mappingprofile.put',
      'displayName' : 'Data Import Converter Storage - update Mapping Profile',
      'description' : 'Put Mapping Profile'
    }, {
      'permissionName' : 'converter-storage.mappingprofile.delete',
      'displayName' : 'Data Import Converter Storage - delete Mapping Profile',
      'description' : 'Delete Mapping Profile'
    }, {
      'permissionName' : 'converter-storage.entitytypes.get',
      'displayName' : 'Data Import Converter Storage - get Entity types',
      'description' : 'Get collection of entity types'
    }, {
      'permissionName' : 'converter-storage.profileassociation.post',
      'displayName' : 'Data Import Converter Storage - create Profile Association',
      'description' : 'Post Profile Association'
    }, {
      'permissionName' : 'converter-storage.profileassociation.get',
      'displayName' : 'Data Import Converter Storage - get Profile Association(s)',
      'description' : 'Get Profile Association(s)'
    }, {
      'permissionName' : 'converter-storage.profileassociation.put',
      'displayName' : 'Data Import Converter Storage - update Profile Association',
      'description' : 'Put Profile Association'
    }, {
      'permissionName' : 'converter-storage.profileassociation.delete',
      'displayName' : 'Data Import Converter Storage - delete Profile Association',
      'description' : 'Delete Profile Association'
    }, {
      'permissionName' : 'converter-storage.jobprofilesnapshots.get',
      'displayName' : 'Data Import Converter Storage - get Job Profile Snapshot',
      'description' : 'Get Job Profile Snapshot'
    }, {
      'permissionName' : 'converter-storage.jobprofilesnapshots.post',
      'displayName' : 'Data Import Converter Storage - create Job Profile Snapshot',
      'description' : 'Post Job Profile Snapshot'
    }, {
      'permissionName' : 'converter-storage.profileSnapshots.get',
      'displayName' : 'Data Import Converter Storage - get Profile Snapshot',
      'description' : 'Get Profile Snapshot'
    }, {
      'permissionName' : 'converter-storage.all',
      'displayName' : 'Data Import Converter Storage - all permissions',
      'description' : 'Entire set of permissions needed to manage Profiles',
      'subPermissions' : ['converter-storage.jobprofile.get', 'converter-storage.jobprofile.post', 'converter-storage.jobprofile.put', 'converter-storage.jobprofile.delete', 'converter-storage.matchprofile.get', 'converter-storage.matchprofile.post', 'converter-storage.matchprofile.put', 'converter-storage.matchprofile.delete', 'converter-storage.actionprofile.get', 'converter-storage.actionprofile.post', 'converter-storage.actionprofile.put', 'converter-storage.actionprofile.delete', 'converter-storage.mappingprofile.get', 'converter-storage.mappingprofile.post', 'converter-storage.mappingprofile.put', 'converter-storage.mappingprofile.delete', 'converter-storage.profileassociation.post', 'converter-storage.profileassociation.get', 'converter-storage.profileassociation.put', 'converter-storage.profileassociation.delete', 'converter-storage.jobprofilesnapshots.get', 'converter-storage.jobprofilesnapshots.post', 'converter-storage.entitytypes.get', 'converter-storage.profileSnapshots.get'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-data-import-converter-storage:1.7.0-SNAPSHOT.77',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-email-1.7.0-SNAPSHOT.42',
    'name' : 'email',
    'requires' : [{
      'id' : 'configuration',
      'version' : '2.0'
    }],
    'provides' : [{
      'id' : 'email',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/email',
        'permissionsRequired' : ['email.message.post'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/email',
        'permissionsRequired' : ['email.message.collection.get']
      }]
    }, {
      'id' : 'delayedTasks',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['DELETE'],
        'pathPattern' : '/delayedTask/expiredMessages',
        'permissionsRequired' : ['email.message.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }, {
      'id' : '_timer',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['DELETE'],
        'pathPattern' : '/delayedTask/expiredMessages',
        'unit' : 'minute',
        'delay' : '30'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'email.message.post',
      'displayName' : 'message - send email notifications',
      'description' : 'send email notifications'
    }, {
      'permissionName' : 'email.message.collection.get',
      'displayName' : 'get email messages',
      'description' : 'get all email messages by query'
    }, {
      'permissionName' : 'email.message.delete',
      'displayName' : 'delete email message',
      'description' : 'delete email messages by expiration date or status'
    }, {
      'permissionName' : 'email.message.all',
      'displayName' : 'email entries - all permissions',
      'description' : 'Entire set of permissions needed to use the email module',
      'subPermissions' : ['email.message.post', 'email.message.collection.get', 'email.message.delete'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-email:1.7.0-SNAPSHOT.42',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-erm-usage-2.7.0-SNAPSHOT.79',
    'name' : 'erm-usage',
    'provides' : [{
      'id' : 'usage-data-providers',
      'version' : '2.3',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/usage-data-providers',
        'permissionsRequired' : ['usagedataproviders.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/usage-data-providers/{id}',
        'permissionsRequired' : ['usagedataproviders.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/usage-data-providers',
        'permissionsRequired' : ['usagedataproviders.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/usage-data-providers/{id}',
        'permissionsRequired' : ['usagedataproviders.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/usage-data-providers/{id}',
        'permissionsRequired' : ['usagedataproviders.item.delete']
      }]
    }, {
      'id' : 'aggregator-settings',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/aggregator-settings',
        'permissionsRequired' : ['aggregatorsettings.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/aggregator-settings/{id}',
        'permissionsRequired' : ['aggregatorsettings.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/aggregator-settings',
        'permissionsRequired' : ['aggregatorsettings.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/aggregator-settings/{id}',
        'permissionsRequired' : ['aggregatorsettings.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/aggregator-settings/{id}',
        'permissionsRequired' : ['aggregatorsettings.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/aggregator-settings/{id}',
        'permissionsRequired' : ['aggregatorsettings.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/aggregator-settings/{id}/exportcredentials',
        'permissionsRequired' : ['usagedataproviders.item.get', 'aggregatorsettings.item.get']
      }]
    }, {
      'id' : 'counter-reports',
      'version' : '1.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/counter-reports',
        'permissionsRequired' : ['counterreports.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/counter-reports/{id}',
        'permissionsRequired' : ['counterreports.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/counter-reports',
        'permissionsRequired' : ['counterreports.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/counter-reports/{id}',
        'permissionsRequired' : ['counterreports.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/counter-reports/{id}',
        'permissionsRequired' : ['counterreports.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/counter-reports/csv/{id}',
        'permissionsRequired' : ['counterreports.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/counter-reports/csv/provider/{id}/report/{name}/version/{version}/from/{begin}/to/{end}',
        'permissionsRequired' : ['counterreports.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/counter-reports/upload/provider/{id}',
        'permissionsRequired' : ['counterreports.item.post']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'usagedataproviders.collection.get',
      'displayName' : 'usage data providers collection get',
      'description' : 'Get a collection of usage data providers'
    }, {
      'permissionName' : 'usagedataproviders.item.get',
      'displayName' : 'usage data providers item get',
      'description' : 'Get a single usage data provider'
    }, {
      'permissionName' : 'usagedataproviders.item.post',
      'displayName' : 'usage data providers item post',
      'description' : 'Create a new usage data provider'
    }, {
      'permissionName' : 'usagedataproviders.item.put',
      'displayName' : 'usage data providers item get',
      'description' : 'Edit an usage data provider'
    }, {
      'permissionName' : 'usagedataproviders.item.delete',
      'displayName' : 'usage data providers item get',
      'description' : 'Delete an usage data provider'
    }, {
      'permissionName' : 'aggregatorsettings.collection.get',
      'displayName' : 'aggregator settings collection get',
      'description' : 'Get a collection of aggregator setting'
    }, {
      'permissionName' : 'aggregatorsettings.item.get',
      'displayName' : 'aggregator settings item get',
      'description' : 'Get a single aggregator setting'
    }, {
      'permissionName' : 'aggregatorsettings.item.post',
      'displayName' : 'aggregator settings item post',
      'description' : 'Create a new aggregator setting'
    }, {
      'permissionName' : 'aggregatorsettings.item.put',
      'displayName' : 'aggregator settings item get',
      'description' : 'Edit an aggregator setting'
    }, {
      'permissionName' : 'aggregatorsettings.item.delete',
      'displayName' : 'aggregator settings item get',
      'description' : 'Delete an aggregator setting'
    }, {
      'permissionName' : 'counterreports.collection.get',
      'displayName' : 'counter reports collection get',
      'description' : 'Get a collection of counter reports'
    }, {
      'permissionName' : 'counterreports.item.get',
      'displayName' : 'counter reports item get',
      'description' : 'Get a single counter report'
    }, {
      'permissionName' : 'counterreports.item.post',
      'displayName' : 'counter reports item post',
      'description' : 'Create a new counter report'
    }, {
      'permissionName' : 'counterreports.item.put',
      'displayName' : 'counter reports item get',
      'description' : 'Edit an counter report'
    }, {
      'permissionName' : 'counterreports.item.delete',
      'displayName' : 'counter reports item get',
      'description' : 'Delete an counter report'
    }, {
      'permissionName' : 'eusage.all',
      'displayName' : 'eusage all',
      'description' : 'All permissions for the mod-erm-usage module. An admin should get all permission, e.g. to edit aggregators.',
      'subPermissions' : ['usagedataproviders.collection.get', 'usagedataproviders.item.get', 'usagedataproviders.item.post', 'usagedataproviders.item.put', 'usagedataproviders.item.delete', 'aggregatorsettings.collection.get', 'aggregatorsettings.item.get', 'aggregatorsettings.item.post', 'aggregatorsettings.item.put', 'aggregatorsettings.item.delete', 'counterreports.collection.get', 'counterreports.item.get', 'counterreports.item.post', 'counterreports.item.put', 'counterreports.item.delete']
    }, {
      'permissionName' : 'eusage.user',
      'displayName' : 'eusage user',
      'description' : 'Permission set for a standard erm user. Cannot edit aggregator settings.',
      'subPermissions' : ['usagedataproviders.collection.get', 'usagedataproviders.item.get', 'usagedataproviders.item.post', 'usagedataproviders.item.put', 'usagedataproviders.item.delete', 'aggregatorsettings.collection.get', 'aggregatorsettings.item.get', 'counterreports.collection.get', 'counterreports.item.get', 'counterreports.item.post', 'counterreports.item.put', 'counterreports.item.delete']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-erm-usage:2.7.0-SNAPSHOT.79',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-erm-usage-harvester-1.6.0-SNAPSHOT.56',
    'name' : 'erm-usage-harvester',
    'requires' : [{
      'id' : 'usage-data-providers',
      'version' : '2.2'
    }, {
      'id' : 'aggregator-settings',
      'version' : '1.1'
    }, {
      'id' : 'counter-reports',
      'version' : '1.2'
    }],
    'provides' : [{
      'id' : 'erm-usage-harvester',
      'version' : '1.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/erm-usage-harvester/start',
        'modulePermissions' : ['usagedataproviders.collection.get', 'usagedataproviders.item.get', 'aggregatorsettings.collection.get', 'aggregatorsettings.item.get', 'counterreports.collection.get', 'counterreports.item.get', 'counterreports.item.post', 'counterreports.item.put', 'counterreports.item.delete', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm-usage-harvester/start/{id}',
        'modulePermissions' : ['usagedataproviders.collection.get', 'usagedataproviders.item.get', 'aggregatorsettings.collection.get', 'aggregatorsettings.item.get', 'counterreports.collection.get', 'counterreports.item.get', 'counterreports.item.post', 'counterreports.item.put', 'counterreports.item.delete', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/erm-usage-harvester/impl'
      }, {
        'methods' : ['GET', 'POST', 'DELETE'],
        'pathPattern' : '/erm-usage-harvester/periodic'
      }]
    }, {
      'id' : '_start',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/start',
        'modulePermissions' : ['usagedataproviders.collection.get', 'usagedataproviders.item.get', 'aggregatorsettings.collection.get', 'aggregatorsettings.item.get', 'counterreports.collection.get', 'counterreports.item.get', 'counterreports.item.post', 'counterreports.item.put', 'counterreports.item.delete', 'configuration.entries.collection.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-erm-usage-harvester:1.6.0-SNAPSHOT.56',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-event-config-1.5.0-SNAPSHOT.37',
    'name' : 'mod-event-config',
    'requires' : [],
    'provides' : [{
      'id' : 'mod-event',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/eventConfig/{id}',
        'permissionsRequired' : ['event.config.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eventConfig',
        'permissionsRequired' : ['event.config.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/eventConfig',
        'permissionsRequired' : ['event.config.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eventConfig/{id}',
        'permissionsRequired' : ['event.config.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/eventConfig/{id}',
        'permissionsRequired' : ['event.config.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'event.config.item.get',
      'displayName' : 'Event Config - get event configuration from storage',
      'description' : 'Get individual event configuration'
    }, {
      'permissionName' : 'event.config.collection.get',
      'displayName' : 'Event Config - get event configuration list',
      'description' : 'Get a list of event configurations'
    }, {
      'permissionName' : 'event.config.item.post',
      'displayName' : 'Event Config - create event configuration',
      'description' : 'Create event configuration'
    }, {
      'permissionName' : 'event.config.item.put',
      'displayName' : 'Event Config - modify event configuration',
      'description' : 'Modify event configuration'
    }, {
      'permissionName' : 'event.config.item.delete',
      'displayName' : 'Event Config - delete event configuration',
      'description' : 'Delete event configuration'
    }, {
      'permissionName' : 'event.config.all',
      'displayName' : 'Event configuration module - all permissions',
      'description' : 'Entire set of permissions needed to use the event configuration modules',
      'subPermissions' : ['event.config.item.get', 'event.config.collection.get', 'event.config.item.post', 'event.config.item.put', 'event.config.item.delete'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-event-config:1.5.0-SNAPSHOT.37',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-feesfines-15.6.1-SNAPSHOT.53',
    'name' : 'feesfines',
    'requires' : [{
      'id' : 'patron-notice',
      'version' : '1.0'
    }],
    'provides' : [{
      'id' : 'feesfines',
      'version' : '15.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/feefines',
        'permissionsRequired' : ['feefines.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/feefines/{id}',
        'permissionsRequired' : ['feefines.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/feefines',
        'permissionsRequired' : ['feefines.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/feefines/{id}',
        'permissionsRequired' : ['feefines.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/feefines/{id}',
        'permissionsRequired' : ['feefines.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/owners',
        'permissionsRequired' : ['owners.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/owners/{id}',
        'permissionsRequired' : ['owners.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/owners',
        'permissionsRequired' : ['owners.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/owners/{id}',
        'permissionsRequired' : ['owners.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/owners/{id}',
        'permissionsRequired' : ['owners.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/accounts',
        'permissionsRequired' : ['accounts.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/accounts/{id}',
        'permissionsRequired' : ['accounts.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/accounts',
        'permissionsRequired' : ['accounts.item.post'],
        'modulePermissions' : ['patron-notice.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/accounts/{id}',
        'permissionsRequired' : ['accounts.item.put'],
        'modulePermissions' : ['patron-notice.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/accounts/{id}',
        'permissionsRequired' : ['accounts.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/feefineactions',
        'permissionsRequired' : ['feefineactions.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/feefineactions/{id}',
        'permissionsRequired' : ['feefineactions.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/feefineactions',
        'permissionsRequired' : ['feefineactions.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/feefineactions/{id}',
        'permissionsRequired' : ['feefineactions.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/feefineactions/{id}',
        'permissionsRequired' : ['feefineactions.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/payments',
        'permissionsRequired' : ['payments.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/payments/{id}',
        'permissionsRequired' : ['payments.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/payments',
        'permissionsRequired' : ['payments.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/payments/{id}',
        'permissionsRequired' : ['payments.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/payments/{id}',
        'permissionsRequired' : ['payments.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/waives',
        'permissionsRequired' : ['waives.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/waives/{id}',
        'permissionsRequired' : ['waives.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/waives',
        'permissionsRequired' : ['waives.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/waives/{id}',
        'permissionsRequired' : ['waives.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/waives/{id}',
        'permissionsRequired' : ['waives.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/refunds',
        'permissionsRequired' : ['refunds.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/refunds/{id}',
        'permissionsRequired' : ['refunds.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/refunds',
        'permissionsRequired' : ['refunds.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/refunds/{id}',
        'permissionsRequired' : ['refunds.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/refunds/{id}',
        'permissionsRequired' : ['refunds.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/transfers',
        'permissionsRequired' : ['transfers.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/transfers/{id}',
        'permissionsRequired' : ['transfers.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/transfers',
        'permissionsRequired' : ['transfers.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/transfers/{id}',
        'permissionsRequired' : ['transfers.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/transfers/{id}',
        'permissionsRequired' : ['transfers.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/comments',
        'permissionsRequired' : ['comments.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/comments/{id}',
        'permissionsRequired' : ['comments.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/comments',
        'permissionsRequired' : ['comments.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/comments/{id}',
        'permissionsRequired' : ['comments.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/comments/{id}',
        'permissionsRequired' : ['comments.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/transfer-criterias',
        'permissionsRequired' : ['transfer-criterias.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/transfer-criterias/{id}',
        'permissionsRequired' : ['transfer-criterias.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/transfer-criterias',
        'permissionsRequired' : ['transfer-criterias.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/transfer-criterias/{id}',
        'permissionsRequired' : ['transfer-criterias.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/transfer-criterias/{id}',
        'permissionsRequired' : ['transfer-criterias.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/manualblocks',
        'permissionsRequired' : ['manualblocks.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/manualblocks/{id}',
        'permissionsRequired' : ['manualblocks.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/manualblocks',
        'permissionsRequired' : ['manualblocks.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/manualblocks/{id}',
        'permissionsRequired' : ['manualblocks.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/manualblocks/{id}',
        'permissionsRequired' : ['manualblocks.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/overdue-fines-policies',
        'permissionsRequired' : ['overdue-fines-policies.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/overdue-fines-policies/{id}',
        'permissionsRequired' : ['overdue-fines-policies.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/overdue-fines-policies',
        'permissionsRequired' : ['overdue-fines-policies.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/overdue-fines-policies/{id}',
        'permissionsRequired' : ['overdue-fines-policies.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/overdue-fines-policies/{id}',
        'permissionsRequired' : ['overdue-fines-policies.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/lost-item-fees-policies',
        'permissionsRequired' : ['lost-item-fees-policies.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/lost-item-fees-policies/{id}',
        'permissionsRequired' : ['lost-item-fees-policies.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/lost-item-fees-policies',
        'permissionsRequired' : ['lost-item-fees-policies.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/lost-item-fees-policies/{id}',
        'permissionsRequired' : ['lost-item-fees-policies.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/lost-item-fees-policies/{id}',
        'permissionsRequired' : ['lost-item-fees-policies.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'feefines.collection.get',
      'displayName' : 'feefines collection get',
      'description' : 'Get a collection of feefines records'
    }, {
      'permissionName' : 'feefines.item.get',
      'displayName' : 'feefines item get',
      'description' : 'Read an individual record in the Feefine module'
    }, {
      'permissionName' : 'feefines.item.post',
      'displayName' : 'feefines item post',
      'description' : 'Create new records in the Feefine module'
    }, {
      'permissionName' : 'feefines.item.put',
      'displayName' : 'feefines item put',
      'description' : 'Edit existing records in the Feefine module'
    }, {
      'permissionName' : 'feefines.item.delete',
      'displayName' : 'feefines item delete',
      'description' : 'Delete records from the Feefine module'
    }, {
      'permissionName' : 'owners.collection.get',
      'displayName' : 'owners collection get',
      'description' : 'Get a list of owner records'
    }, {
      'permissionName' : 'owners.item.get',
      'displayName' : 'owners item get',
      'description' : 'Get a single owner item'
    }, {
      'permissionName' : 'owners.item.post',
      'displayName' : 'owners item post',
      'description' : 'Create new Owners'
    }, {
      'permissionName' : 'owners.item.put',
      'displayName' : 'owners item put',
      'description' : 'Edit existing Owners'
    }, {
      'permissionName' : 'owners.item.delete',
      'displayName' : 'owners item delete',
      'description' : 'Delete Owners'
    }, {
      'permissionName' : 'accounts.collection.get',
      'displayName' : 'accounts collection get',
      'description' : 'Get a list of account records'
    }, {
      'permissionName' : 'accounts.item.get',
      'displayName' : 'accounts item get',
      'description' : 'Get a single account record'
    }, {
      'permissionName' : 'accounts.item.post',
      'displayName' : 'accounts item post',
      'description' : 'Create a new account record'
    }, {
      'permissionName' : 'accounts.item.put',
      'displayName' : 'accounts item put',
      'description' : 'Edit an account record'
    }, {
      'permissionName' : 'accounts.item.delete',
      'displayName' : 'accounts item delete',
      'description' : 'Delete an account record'
    }, {
      'permissionName' : 'feefineactions.collection.get',
      'displayName' : 'feefineactions collection get',
      'description' : 'Get a list of feefineaction records'
    }, {
      'permissionName' : 'feefineactions.item.get',
      'displayName' : 'feefineactions item get',
      'description' : 'Get a single feefineaction record'
    }, {
      'permissionName' : 'feefineactions.item.post',
      'displayName' : 'feefineactions item post',
      'description' : 'Create a new feefineaction record'
    }, {
      'permissionName' : 'feefineactions.item.put',
      'displayName' : 'feefineactions item put',
      'description' : 'Edit an feefineaction record'
    }, {
      'permissionName' : 'feefineactions.item.delete',
      'displayName' : 'feefineactions item delete',
      'description' : 'Delete an feefineaction record'
    }, {
      'permissionName' : 'payments.collection.get',
      'displayName' : 'payments collection get',
      'description' : 'Get a list of payment records'
    }, {
      'permissionName' : 'payments.item.get',
      'displayName' : 'payments item get',
      'description' : 'Get a single payment record'
    }, {
      'permissionName' : 'payments.item.post',
      'displayName' : 'payments item post',
      'description' : 'Create a new payment record'
    }, {
      'permissionName' : 'payments.item.put',
      'displayName' : 'payments item put',
      'description' : 'Edit an payment record'
    }, {
      'permissionName' : 'payments.item.delete',
      'displayName' : 'payments item delete',
      'description' : 'Delete an payment record'
    }, {
      'permissionName' : 'waives.collection.get',
      'displayName' : 'waives collection get',
      'description' : 'Get a list of waive records'
    }, {
      'permissionName' : 'waives.item.get',
      'displayName' : 'waives item get',
      'description' : 'Get a single waive record'
    }, {
      'permissionName' : 'waives.item.post',
      'displayName' : 'waives item post',
      'description' : 'Create a new waive record'
    }, {
      'permissionName' : 'waives.item.put',
      'displayName' : 'waives item put',
      'description' : 'Edit an waive record'
    }, {
      'permissionName' : 'waives.item.delete',
      'displayName' : 'waives item delete',
      'description' : 'Delete an waive record'
    }, {
      'permissionName' : 'refunds.collection.get',
      'displayName' : 'refunds collection get',
      'description' : 'Get a list of refund records'
    }, {
      'permissionName' : 'refunds.item.get',
      'displayName' : 'refunds item get',
      'description' : 'Get a single refund record'
    }, {
      'permissionName' : 'refunds.item.post',
      'displayName' : 'refunds item post',
      'description' : 'Create a new refund record'
    }, {
      'permissionName' : 'refunds.item.put',
      'displayName' : 'refunds item put',
      'description' : 'Edit an refund record'
    }, {
      'permissionName' : 'refunds.item.delete',
      'displayName' : 'refunds item delete',
      'description' : 'Delete an refund record'
    }, {
      'permissionName' : 'transfers.collection.get',
      'displayName' : 'transfers collection get',
      'description' : 'Get a list of transfer records'
    }, {
      'permissionName' : 'transfers.item.get',
      'displayName' : 'transfers item get',
      'description' : 'Get a single transfer record'
    }, {
      'permissionName' : 'transfers.item.post',
      'displayName' : 'transfers item post',
      'description' : 'Create a new transfer record'
    }, {
      'permissionName' : 'transfers.item.put',
      'displayName' : 'transfers item put',
      'description' : 'Edit an transfer record'
    }, {
      'permissionName' : 'transfers.item.delete',
      'displayName' : 'transfers item delete',
      'description' : 'Delete an transfer record'
    }, {
      'permissionName' : 'comments.collection.get',
      'displayName' : 'comments collection get',
      'description' : 'Get a list of comment records'
    }, {
      'permissionName' : 'comments.item.get',
      'displayName' : 'comments item get',
      'description' : 'Get a single comment record'
    }, {
      'permissionName' : 'comments.item.post',
      'displayName' : 'comments item post',
      'description' : 'Create a new comment record'
    }, {
      'permissionName' : 'comments.item.put',
      'displayName' : 'comments item put',
      'description' : 'Edit an comment record'
    }, {
      'permissionName' : 'comments.item.delete',
      'displayName' : 'comments item delete',
      'description' : 'Delete an comment record'
    }, {
      'permissionName' : 'transfer-criterias.collection.get',
      'displayName' : 'transfer criteria collection get',
      'description' : 'Get a list of transfer criteria records'
    }, {
      'permissionName' : 'transfer-criterias.item.get',
      'displayName' : 'transfer criteria item get',
      'description' : 'Get a single transfer criteria record'
    }, {
      'permissionName' : 'transfer-criterias.item.post',
      'displayName' : 'transfer criteria item post',
      'description' : 'Create a new transfer criteria record'
    }, {
      'permissionName' : 'transfer-criterias.item.put',
      'displayName' : 'transfer criteria item put',
      'description' : 'Edit an transfer criteria record'
    }, {
      'permissionName' : 'transfer-criterias.item.delete',
      'displayName' : 'transfer criteria item delete',
      'description' : 'Delete an transfer criteria record'
    }, {
      'permissionName' : 'manualblocks.collection.get',
      'displayName' : 'manualblocks collection get',
      'description' : 'Get a list of manualblock records'
    }, {
      'permissionName' : 'manualblocks.item.get',
      'displayName' : 'manualblocks item get',
      'description' : 'Get a single manualblock record'
    }, {
      'permissionName' : 'manualblocks.item.post',
      'displayName' : 'manualblocks item post',
      'description' : 'Create a new manualblock record'
    }, {
      'permissionName' : 'manualblocks.item.put',
      'displayName' : 'manualblocks item put',
      'description' : 'Edit an manualblock record'
    }, {
      'permissionName' : 'manualblocks.item.delete',
      'displayName' : 'manualblocks item delete',
      'description' : 'Delete an manualblock record'
    }, {
      'permissionName' : 'overdue-fines-policies.collection.get',
      'displayName' : 'Overdue-fines-policies collection get',
      'description' : 'Get a list of overdue-fines-policies records'
    }, {
      'permissionName' : 'overdue-fines-policies.item.get',
      'displayName' : 'Overdue-fines-policies item get',
      'description' : 'Get a single overdue-fines-policies record'
    }, {
      'permissionName' : 'overdue-fines-policies.item.post',
      'displayName' : 'Overdue-fines-policies item post',
      'description' : 'Create a new overdue-fines-policies record'
    }, {
      'permissionName' : 'overdue-fines-policies.item.put',
      'displayName' : 'Overdue-fines-policies item put',
      'description' : 'Edit an overdue-fines-policies record'
    }, {
      'permissionName' : 'overdue-fines-policies.item.delete',
      'displayName' : 'Overdue-fines-policies item delete',
      'description' : 'Delete an overdue-fines-policies record'
    }, {
      'permissionName' : 'lost-item-fees-policies.collection.get',
      'displayName' : 'Lost-item-fees-policies collection get',
      'description' : 'Get a list of lost-item-fees-policies records'
    }, {
      'permissionName' : 'lost-item-fees-policies.item.get',
      'displayName' : 'Lost-item-fees-policies item get',
      'description' : 'Get a single lost-item-fees-policies record'
    }, {
      'permissionName' : 'lost-item-fees-policies.item.post',
      'displayName' : 'Lost-item-fees-policies item post',
      'description' : 'Create a new lost-item-fees-policies record'
    }, {
      'permissionName' : 'lost-item-fees-policies.item.put',
      'displayName' : 'Lost-item-fees-policies item put',
      'description' : 'Edit an lost-item-fees-policies record'
    }, {
      'permissionName' : 'lost-item-fees-policies.item.delete',
      'displayName' : 'Lost-item-fees-policies item delete',
      'description' : 'Delete an lost-item-fees-policies record'
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-feesfines:15.6.1-SNAPSHOT.53',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-finance-1.2.0-SNAPSHOT.47',
    'name' : 'Finance business logic module',
    'requires' : [{
      'id' : 'finance-storage.budgets',
      'version' : '2.0'
    }, {
      'id' : 'finance-storage.fund-types',
      'version' : '1.0'
    }, {
      'id' : 'finance-storage.funds',
      'version' : '3.0'
    }, {
      'id' : 'finance-storage.fiscal-years',
      'version' : '2.0'
    }, {
      'id' : 'finance-storage.groups',
      'version' : '1.0'
    }, {
      'id' : 'finance-storage.ledgers',
      'version' : '2.2'
    }, {
      'id' : 'finance-storage.groups',
      'version' : '1.0'
    }, {
      'id' : 'finance-storage.transactions',
      'version' : '2.0'
    }, {
      'id' : 'configuration',
      'version' : '2.0'
    }, {
      'id' : 'finance-storage.order-transaction-summaries',
      'version' : '1.0'
    }, {
      'id' : 'finance-storage.invoice-transaction-summaries',
      'version' : '1.0'
    }],
    'provides' : [{
      'id' : 'finance.budgets',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/budgets',
        'permissionsRequired' : ['finance.budgets.collection.get'],
        'modulePermissions' : ['finance-storage.budgets.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/budgets',
        'permissionsRequired' : ['finance.budgets.item.post'],
        'modulePermissions' : ['finance-storage.budgets.item.post', 'finance-storage.group-fund-fiscal-years.collection.get', 'finance-storage.group-fund-fiscal-years.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/budgets/{id}',
        'permissionsRequired' : ['finance.budgets.item.get'],
        'modulePermissions' : ['finance-storage.budgets.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance/budgets/{id}',
        'permissionsRequired' : ['finance.budgets.item.put'],
        'modulePermissions' : ['finance-storage.budgets.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance/budgets/{id}',
        'permissionsRequired' : ['finance.budgets.item.delete'],
        'modulePermissions' : ['finance-storage.budgets.item.delete']
      }]
    }, {
      'id' : 'finance.fund-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/fund-types',
        'permissionsRequired' : ['finance.fund-types.collection.get'],
        'modulePermissions' : ['finance-storage.fund-types.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/fund-types',
        'permissionsRequired' : ['finance.fund-types.item.post'],
        'modulePermissions' : ['finance-storage.fund-types.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/fund-types/{id}',
        'permissionsRequired' : ['finance.fund-types.item.get'],
        'modulePermissions' : ['finance-storage.fund-types.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance/fund-types/{id}',
        'permissionsRequired' : ['finance.fund-types.item.put'],
        'modulePermissions' : ['finance-storage.fund-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance/fund-types/{id}',
        'permissionsRequired' : ['finance.fund-types.item.delete'],
        'modulePermissions' : ['finance-storage.fund-types.item.delete']
      }]
    }, {
      'id' : 'finance.funds',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/funds',
        'permissionsRequired' : ['finance.funds.collection.get'],
        'modulePermissions' : ['finance-storage.funds.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/funds',
        'permissionsRequired' : ['finance.funds.item.post'],
        'modulePermissions' : ['finance-storage.funds.item.post', 'finance-storage.ledgers.item.get', 'finance-storage.fiscal-years.item.get', 'finance-storage.fiscal-years.collection.get', 'finance-storage.group-fund-fiscal-years.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/funds/{id}',
        'permissionsRequired' : ['finance.funds.item.get'],
        'modulePermissions' : ['finance-storage.funds.item.get', 'finance-storage.ledgers.item.get', 'finance-storage.fiscal-years.item.get', 'finance-storage.fiscal-years.collection.get', 'finance-storage.group-fund-fiscal-years.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance/funds/{id}',
        'permissionsRequired' : ['finance.funds.item.put'],
        'modulePermissions' : ['finance-storage.funds.item.put', 'finance-storage.ledgers.item.get', 'finance-storage.fiscal-years.item.get', 'finance-storage.fiscal-years.collection.get', 'finance-storage.groups.collection.get', 'finance-storage.budgets.collection.get', 'finance-storage.group-fund-fiscal-years.collection.get', 'finance-storage.group-fund-fiscal-years.item.post', 'finance-storage.group-fund-fiscal-years.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance/funds/{id}',
        'permissionsRequired' : ['finance.funds.item.delete'],
        'modulePermissions' : ['finance-storage.funds.item.delete', 'finance-storage.group-fund-fiscal-years.collection.get', 'finance-storage.group-fund-fiscal-years.item.delete']
      }]
    }, {
      'id' : 'finance.fiscal-years',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/fiscal-years',
        'permissionsRequired' : ['finance.fiscal-years.collection.get'],
        'modulePermissions' : ['finance-storage.fiscal-years.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/fiscal-years',
        'permissionsRequired' : ['finance.fiscal-years.item.post'],
        'modulePermissions' : ['finance-storage.fiscal-years.item.post', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/fiscal-years/{id}',
        'permissionsRequired' : ['finance.fiscal-years.item.get'],
        'modulePermissions' : ['finance-storage.fiscal-years.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance/fiscal-years/{id}',
        'permissionsRequired' : ['finance.fiscal-years.item.put'],
        'modulePermissions' : ['finance-storage.fiscal-years.item.put', 'configuration.entries.collection.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance/fiscal-years/{id}',
        'permissionsRequired' : ['finance.fiscal-years.item.delete'],
        'modulePermissions' : ['finance-storage.fiscal-years.item.delete']
      }]
    }, {
      'id' : 'finance.group-fund-fiscal-years',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/group-fund-fiscal-years',
        'permissionsRequired' : ['finance.group-fund-fiscal-years.collection.get'],
        'modulePermissions' : ['finance-storage.group-fund-fiscal-years.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/group-fund-fiscal-years',
        'permissionsRequired' : ['finance.group-fund-fiscal-years.item.post'],
        'modulePermissions' : ['finance-storage.group-fund-fiscal-years.item.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance/group-fund-fiscal-years/{id}',
        'permissionsRequired' : ['finance.group-fund-fiscal-years.item.delete'],
        'modulePermissions' : ['finance-storage.group-fund-fiscal-years.item.delete']
      }]
    }, {
      'id' : 'finance.ledgers',
      'version' : '1.3',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/ledgers',
        'permissionsRequired' : ['finance.ledgers.collection.get'],
        'modulePermissions' : ['finance-storage.ledgers.collection.get', 'finance-storage.ledgersFY.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/ledgers',
        'permissionsRequired' : ['finance.ledgers.item.post'],
        'modulePermissions' : ['finance-storage.ledgers.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/ledgers/{id}',
        'permissionsRequired' : ['finance.ledgers.item.get'],
        'modulePermissions' : ['finance-storage.ledgers.item.get', 'finance-storage.ledgersFY.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance/ledgers/{id}',
        'permissionsRequired' : ['finance.ledgers.item.put'],
        'modulePermissions' : ['finance-storage.ledgers.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance/ledgers/{id}',
        'permissionsRequired' : ['finance.ledgers.item.delete'],
        'modulePermissions' : ['finance-storage.ledgers.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/ledgers/{id}/current-fiscal-year',
        'permissionsRequired' : ['finance.ledgers.current-fiscal-year.item.get'],
        'modulePermissions' : ['finance-storage.ledgers.item.get', 'finance-storage.fiscal-years.item.get', 'finance-storage.fiscal-years.collection.get']
      }]
    }, {
      'id' : 'finance.groups',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/groups',
        'permissionsRequired' : ['finance.groups.collection.get'],
        'modulePermissions' : ['finance-storage.groups.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/groups',
        'permissionsRequired' : ['finance.groups.item.post'],
        'modulePermissions' : ['finance-storage.groups.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/groups/{id}',
        'permissionsRequired' : ['finance.groups.item.get'],
        'modulePermissions' : ['finance-storage.groups.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance/groups/{id}',
        'permissionsRequired' : ['finance.groups.item.put'],
        'modulePermissions' : ['finance-storage.groups.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance/groups/{id}',
        'permissionsRequired' : ['finance.groups.item.delete'],
        'modulePermissions' : ['finance-storage.groups.item.delete']
      }]
    }, {
      'id' : 'finance.transactions',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/finance/allocations',
        'permissionsRequired' : ['finance.allocations.item.post'],
        'modulePermissions' : ['finance-storage.transactions.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/encumbrances',
        'permissionsRequired' : ['finance.encumbrances.item.post'],
        'modulePermissions' : ['finance-storage.transactions.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/transfers',
        'permissionsRequired' : ['finance.transfers.item.post'],
        'modulePermissions' : ['finance-storage.transactions.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/payments',
        'permissionsRequired' : ['finance.payments.item.post'],
        'modulePermissions' : ['finance-storage.transactions.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/credits',
        'permissionsRequired' : ['finance.credits.item.post'],
        'modulePermissions' : ['finance-storage.transactions.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/transactions',
        'permissionsRequired' : ['finance.transactions.collection.get'],
        'modulePermissions' : ['finance-storage.transactions.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance/transactions/{id}',
        'permissionsRequired' : ['finance.transactions.item.get'],
        'modulePermissions' : ['finance-storage.transactions.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/release-encumbrance/{id}',
        'permissionsRequired' : ['finance.release-encumbrance.item.post'],
        'modulePermissions' : ['finance-storage.transactions.item.get', 'finance-storage.transactions.item.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance/awaiting-payment',
        'permissionsRequired' : ['finance.awaiting-payment.item.post'],
        'modulePermissions' : ['finance-storage.transactions.item.put', 'finance-storage.transactions.item.get']
      }]
    }, {
      'id' : 'finance.order-transaction-summaries',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/finance/order-transaction-summaries',
        'permissionsRequired' : ['finance.order-transaction-summaries.item.post'],
        'modulePermissions' : ['finance-storage.order-transaction-summaries.item.post']
      }]
    }, {
      'id' : 'finance.group-fiscal-year-summaries',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance/group-fiscal-year-summaries',
        'permissionsRequired' : ['finance.group-fiscal-year-summaries.collection.get'],
        'modulePermissions' : ['finance-storage.budgets.collection.get', 'finance-storage.group-fund-fiscal-years.collection.get']
      }]
    }, {
      'id' : 'finance.invoice-transaction-summaries',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/finance/invoice-transaction-summaries',
        'permissionsRequired' : ['finance.invoice-transaction-summaries.item.post'],
        'modulePermissions' : ['finance-storage.invoice-transaction-summaries.item.post']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'finance.budgets.collection.get',
      'displayName' : 'Budgets - get the collection of budgets',
      'description' : 'Get collection of budgets'
    }, {
      'permissionName' : 'finance.budgets.item.post',
      'displayName' : 'Budgets - create a new budget',
      'description' : 'Create a new fund type'
    }, {
      'permissionName' : 'finance.budgets.item.get',
      'displayName' : 'Budgets - get an existing budget',
      'description' : 'Fetch a fund type'
    }, {
      'permissionName' : 'finance.budgets.item.put',
      'displayName' : 'Budgets - modify an existing budget',
      'description' : 'Update a fund type'
    }, {
      'permissionName' : 'finance.budgets.item.delete',
      'displayName' : 'Budgets - delete an existing budget',
      'description' : 'Delete a fund type'
    }, {
      'permissionName' : 'finance.budgets.all',
      'displayName' : 'All budget permissions',
      'description' : 'All permissions for the budget APIs',
      'subPermissions' : ['finance.budgets.collection.get', 'finance.budgets.item.post', 'finance.budgets.item.get', 'finance.budgets.item.put', 'finance.budgets.item.delete']
    }, {
      'permissionName' : 'finance.fund-types.collection.get',
      'displayName' : 'Fund types - get the collection of fund types',
      'description' : 'Get collection of fund types'
    }, {
      'permissionName' : 'finance.fund-types.item.post',
      'displayName' : 'Fund types - create a new fund type',
      'description' : 'Create a new fund type'
    }, {
      'permissionName' : 'finance.fund-types.item.get',
      'displayName' : 'Fund types - get an existing fund type',
      'description' : 'Fetch a fund type'
    }, {
      'permissionName' : 'finance.fund-types.item.put',
      'displayName' : 'Fund types - modify an existing fund type',
      'description' : 'Update a fund type'
    }, {
      'permissionName' : 'finance.fund-types.item.delete',
      'displayName' : 'Fund types - delete an existing fund type',
      'description' : 'Delete a fund type'
    }, {
      'permissionName' : 'finance.fund-types.all',
      'displayName' : 'All fund type permissions',
      'description' : 'All permissions for the fund type APIs',
      'subPermissions' : ['finance.fund-types.collection.get', 'finance.fund-types.item.post', 'finance.fund-types.item.get', 'finance.fund-types.item.put', 'finance.fund-types.item.delete']
    }, {
      'permissionName' : 'finance.funds.collection.get',
      'displayName' : 'Finances - get finance funds collection',
      'description' : 'Get finance funds collection'
    }, {
      'permissionName' : 'finance.funds.item.get',
      'displayName' : 'Finances - get individual finance funds from storage',
      'description' : 'Get individual finance funds'
    }, {
      'permissionName' : 'finance.funds.item.post',
      'displayName' : 'Finances - create finance funds',
      'description' : 'Create finance funds'
    }, {
      'permissionName' : 'finance.funds.item.put',
      'displayName' : 'Finances - modify finance funds',
      'description' : 'Modify finance funds'
    }, {
      'permissionName' : 'finance.funds.item.delete',
      'displayName' : 'Finances - delete finance funds',
      'description' : 'Delete finance funds'
    }, {
      'permissionName' : 'finance.funds.all',
      'displayName' : 'Finance Funds - all permissions',
      'description' : 'Entire set of permissions needed to use the Finance funds interface',
      'subPermissions' : ['finance.funds.collection.get', 'finance.funds.item.get', 'finance.funds.item.post', 'finance.funds.item.put', 'finance.funds.item.delete'],
      'visible' : false
    }, {
      'permissionName' : 'finance.fiscal-years.collection.get',
      'displayName' : 'Finances - get finance fiscal-years collection',
      'description' : 'Get finance fiscal years collection'
    }, {
      'permissionName' : 'finance.fiscal-years.item.get',
      'displayName' : 'Finances - get individual finance fiscal year from storage',
      'description' : 'Get individual finance fiscal year'
    }, {
      'permissionName' : 'finance.fiscal-years.item.post',
      'displayName' : 'Finances - create finance fiscal-years',
      'description' : 'Create finance fiscal year'
    }, {
      'permissionName' : 'finance.fiscal-years.item.put',
      'displayName' : 'Finances - modify finance fiscal year',
      'description' : 'Modify finance fiscal year'
    }, {
      'permissionName' : 'finance.fiscal-years.item.delete',
      'displayName' : 'Finances - delete finance fiscal year',
      'description' : 'Delete finance fiscal year'
    }, {
      'permissionName' : 'finance.fiscal-years.all',
      'displayName' : 'Finance fiscal years - all permissions',
      'description' : 'Entire set of permissions needed to use the Finance fiscal years interface',
      'subPermissions' : ['finance.fiscal-years.collection.get', 'finance.fiscal-years.item.get', 'finance.fiscal-years.item.post', 'finance.fiscal-years.item.put', 'finance.fiscal-years.item.delete'],
      'visible' : false
    }, {
      'permissionName' : 'finance.ledgers.collection.get',
      'displayName' : 'Ledgers - get the collection of ledgers',
      'description' : 'Get collection of ledgers'
    }, {
      'permissionName' : 'finance.ledgers.item.post',
      'displayName' : 'Ledgers - create a new ledger',
      'description' : 'Create a new ledger'
    }, {
      'permissionName' : 'finance.ledgers.item.get',
      'displayName' : 'Ledgers - get an existing ledger',
      'description' : 'Fetch a ledger'
    }, {
      'permissionName' : 'finance.ledgers.item.put',
      'displayName' : 'Ledgers - modify an existing ledger',
      'description' : 'Update a ledger'
    }, {
      'permissionName' : 'finance.ledgers.item.delete',
      'displayName' : 'Ledgers - delete an existing ledger',
      'description' : 'Delete a ledger'
    }, {
      'permissionName' : 'finance.ledgers.current-fiscal-year.item.get',
      'displayName' : 'Ledgers - get a current fiscal year for a specific ledger',
      'description' : 'Get a current fiscal year'
    }, {
      'permissionName' : 'finance.ledgers.all',
      'displayName' : 'All ledger permissions',
      'description' : 'All permissions for the ledger APIs',
      'subPermissions' : ['finance.ledgers.collection.get', 'finance.ledgers.item.post', 'finance.ledgers.item.get', 'finance.ledgers.item.put', 'finance.ledgers.item.delete', 'finance.ledgers.current-fiscal-year.item.get']
    }, {
      'permissionName' : 'finance.groups.collection.get',
      'displayName' : 'Groups - get the collection of groups',
      'description' : 'Get collection of groups'
    }, {
      'permissionName' : 'finance.groups.item.post',
      'displayName' : 'Groups - create a new group',
      'description' : 'Create a new group'
    }, {
      'permissionName' : 'finance.groups.item.get',
      'displayName' : 'Groups - get an existing group',
      'description' : 'Fetch a group'
    }, {
      'permissionName' : 'finance.groups.item.put',
      'displayName' : 'Groups - modify an existing group',
      'description' : 'Update a group'
    }, {
      'permissionName' : 'finance.groups.item.delete',
      'displayName' : 'Groups - delete an existing group',
      'description' : 'Delete a group'
    }, {
      'permissionName' : 'finance.groups.all',
      'displayName' : 'All group permissions',
      'description' : 'All permissions for the group APIs',
      'subPermissions' : ['finance.groups.collection.get', 'finance.groups.item.post', 'finance.groups.item.get', 'finance.groups.item.put', 'finance.groups.item.delete']
    }, {
      'permissionName' : 'finance.group-fund-fiscal-years.collection.get',
      'displayName' : 'Finances - get finance group fund fiscal years collection',
      'description' : 'Get finance group fund fiscal years collection'
    }, {
      'permissionName' : 'finance.group-fund-fiscal-years.item.post',
      'displayName' : 'Finances - create finance group fund fiscal year',
      'description' : 'Create finance group fund fiscal years'
    }, {
      'permissionName' : 'finance.group-fund-fiscal-years.item.delete',
      'displayName' : 'Finances - delete finance group fund fiscal years',
      'description' : 'Delete finance group fund fiscal year'
    }, {
      'permissionName' : 'finance.group-fund-fiscal-years.all',
      'displayName' : 'Finance group fund fiscal years - all permissions',
      'description' : 'Entire set of permissions needed to use the Finance - group fund fiscal years interface',
      'subPermissions' : ['finance.group-fund-fiscal-years.collection.get', 'finance.group-fund-fiscal-years.item.post', 'finance.group-fund-fiscal-years.item.delete'],
      'visible' : false
    }, {
      'permissionName' : 'finance.allocations.item.post',
      'displayName' : 'Allocations - create a new transaction of type allocation',
      'description' : 'Create a new allocation'
    }, {
      'permissionName' : 'finance.encumbrances.item.post',
      'displayName' : 'Encumbrances - create a new transaction of type encumbrance',
      'description' : 'Create a new encumbrance'
    }, {
      'permissionName' : 'finance.transfers.item.post',
      'displayName' : 'Transfers - create a new transaction of type transfer',
      'description' : 'Create a new transfer'
    }, {
      'permissionName' : 'finance.payments.item.post',
      'displayName' : 'Payments - create a new transaction of type payment',
      'description' : 'Create a new payment'
    }, {
      'permissionName' : 'finance.credits.item.post',
      'displayName' : 'Credits - create a new transaction of type credit',
      'description' : 'Create a new credit'
    }, {
      'permissionName' : 'finance.transactions.collection.get',
      'displayName' : 'Finances - Get finance transaction collection',
      'description' : 'Get finance transaction collection'
    }, {
      'permissionName' : 'finance.transactions.item.get',
      'displayName' : 'Finances - get an existing transaction',
      'description' : 'Get an existing transaction'
    }, {
      'permissionName' : 'finance.transactions.all',
      'displayName' : 'All transactions permissions',
      'description' : 'All permissions for the transaction APIs',
      'subPermissions' : ['finance.allocations.item.post', 'finance.encumbrances.item.post', 'finance.transfers.item.post', 'finance.payments.item.post', 'finance.credits.item.post', 'finance.transactions.collection.get', 'finance.transactions.item.get', 'finance.awaiting-payment.item.post', 'finance.release-encumbrance.item.post']
    }, {
      'permissionName' : 'finance.awaiting-payment.item.post',
      'displayName' : 'Move money from encumbered to awaiting payment',
      'description' : 'Move money from encumbered to awaiting payment'
    }, {
      'permissionName' : 'finance.release-encumbrance.item.post',
      'displayName' : 'Release encumbrance',
      'description' : "Release any remaining money encumbered back to the budget's available pool"
    }, {
      'permissionName' : 'finance.group-fiscal-year-summaries.collection.get',
      'displayName' : 'Finances - get group fiscal year summaries',
      'description' : 'Get group fiscal year summaries collection'
    }, {
      'permissionName' : 'finance.order-transaction-summaries.item.post',
      'displayName' : 'Finances - Post Order transaction Summaries',
      'description' : 'Post Order Transaction Summary'
    }, {
      'permissionName' : 'finance.invoice-transaction-summaries.item.post',
      'displayName' : 'Finances - Post Invoice transaction Summaries',
      'description' : 'Post Invoice Transaction Summary'
    }, {
      'permissionName' : 'finance.all',
      'displayName' : 'Finance module - all permissions',
      'description' : 'Entire set of permissions needed to use the finance module',
      'subPermissions' : ['finance.budgets.all', 'finance.fund-types.all', 'finance.funds.all', 'finance.group-fund-fiscal-years.all', 'finance.ledgers.all', 'finance.fiscal-years.all', 'finance.groups.all', 'finance.transactions.all', 'finance.group-fiscal-year-summaries.collection.get', 'finance.order-transaction-summaries.item.post', 'finance.invoice-transaction-summaries.item.post'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-finance:1.2.0-SNAPSHOT.47',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-finance-storage-4.2.0-SNAPSHOT.61',
    'name' : 'Finance CRUD module',
    'provides' : [{
      'id' : 'finance-storage.budgets',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/budgets',
        'permissionsRequired' : ['finance-storage.budgets.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/budgets',
        'permissionsRequired' : ['finance-storage.budgets.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/budgets/{id}',
        'permissionsRequired' : ['finance-storage.budgets.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/budgets/{id}',
        'permissionsRequired' : ['finance-storage.budgets.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/budgets/{id}',
        'permissionsRequired' : ['finance-storage.budgets.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/group-budgets',
        'permissionsRequired' : ['finance-storage.group-budgets.collection.get']
      }]
    }, {
      'id' : 'finance-storage.fiscal-years',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/fiscal-years',
        'permissionsRequired' : ['finance-storage.fiscal-years.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/fiscal-years',
        'permissionsRequired' : ['finance-storage.fiscal-years.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/fiscal-years/{id}',
        'permissionsRequired' : ['finance-storage.fiscal-years.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/fiscal-years/{id}',
        'permissionsRequired' : ['finance-storage.fiscal-years.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/fiscal-years/{id}',
        'permissionsRequired' : ['finance-storage.fiscal-years.item.delete']
      }]
    }, {
      'id' : 'finance-storage.fund-distributions',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/fund-distributions',
        'permissionsRequired' : ['finance-storage.fund-distributions.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/fund-distributions',
        'permissionsRequired' : ['finance-storage.fund-distributions.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/fund-distributions/{id}',
        'permissionsRequired' : ['finance-storage.fund-distributions.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/fund-distributions/{id}',
        'permissionsRequired' : ['finance-storage.fund-distributions.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/fund-distributions/{id}',
        'permissionsRequired' : ['finance-storage.fund-distributions.item.delete']
      }]
    }, {
      'id' : 'finance-storage.fund-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/fund-types',
        'permissionsRequired' : ['finance-storage.fund-types.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/fund-types',
        'permissionsRequired' : ['finance-storage.fund-types.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/fund-types/{id}',
        'permissionsRequired' : ['finance-storage.fund-types.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/fund-types/{id}',
        'permissionsRequired' : ['finance-storage.fund-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/fund-types/{id}',
        'permissionsRequired' : ['finance-storage.fund-types.item.delete']
      }]
    }, {
      'id' : 'finance-storage.funds',
      'version' : '3.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/funds',
        'permissionsRequired' : ['finance-storage.funds.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/funds',
        'permissionsRequired' : ['finance-storage.funds.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/funds/{id}',
        'permissionsRequired' : ['finance-storage.funds.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/funds/{id}',
        'permissionsRequired' : ['finance-storage.funds.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/funds/{id}',
        'permissionsRequired' : ['finance-storage.funds.item.delete']
      }]
    }, {
      'id' : 'finance-storage.groups',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/groups',
        'permissionsRequired' : ['finance-storage.groups.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/groups',
        'permissionsRequired' : ['finance-storage.groups.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/groups/{id}',
        'permissionsRequired' : ['finance-storage.groups.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/groups/{id}',
        'permissionsRequired' : ['finance-storage.groups.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/groups/{id}',
        'permissionsRequired' : ['finance-storage.groups.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/group-fund-fiscal-years',
        'permissionsRequired' : ['finance-storage.group-fund-fiscal-years.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/group-fund-fiscal-years',
        'permissionsRequired' : ['finance-storage.group-fund-fiscal-years.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/group-fund-fiscal-years/{id}',
        'permissionsRequired' : ['finance-storage.group-fund-fiscal-years.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/group-fund-fiscal-years/{id}',
        'permissionsRequired' : ['finance-storage.group-fund-fiscal-years.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/group-fund-fiscal-years/{id}',
        'permissionsRequired' : ['finance-storage.group-fund-fiscal-years.item.delete']
      }]
    }, {
      'id' : 'finance-storage.ledgers',
      'version' : '2.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/ledgers',
        'permissionsRequired' : ['finance-storage.ledgers.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/ledgers',
        'permissionsRequired' : ['finance-storage.ledgers.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/ledgers/{id}',
        'permissionsRequired' : ['finance-storage.ledgers.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/ledgers/{id}',
        'permissionsRequired' : ['finance-storage.ledgers.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/ledgers/{id}',
        'permissionsRequired' : ['finance-storage.ledgers.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/ledger-fiscal-years',
        'permissionsRequired' : ['finance-storage.ledgersFY.collection.get']
      }]
    }, {
      'id' : 'finance-storage.transactions',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/transactions',
        'permissionsRequired' : ['finance-storage.transactions.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/transactions',
        'permissionsRequired' : ['finance-storage.transactions.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/transactions/{id}',
        'permissionsRequired' : ['finance-storage.transactions.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/finance-storage/transactions/{id}',
        'permissionsRequired' : ['finance-storage.transactions.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/transactions/{id}',
        'permissionsRequired' : ['finance-storage.transactions.item.delete']
      }]
    }, {
      'id' : 'finance-storage.order-transaction-summaries',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/order-transaction-summaries',
        'permissionsRequired' : ['finance-storage.order-transaction-summaries.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/order-transaction-summaries/{id}',
        'permissionsRequired' : ['finance-storage.order-transaction-summaries.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/order-transaction-summaries/{id}',
        'permissionsRequired' : ['finance-storage.order-transaction-summaries.item.delete']
      }]
    }, {
      'id' : 'finance-storage.invoice-transaction-summaries',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/finance-storage/invoice-transaction-summaries',
        'permissionsRequired' : ['finance-storage.invoice-transaction-summaries.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/finance-storage/invoice-transaction-summaries/{id}',
        'permissionsRequired' : ['finance-storage.invoice-transaction-summaries.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/finance-storage/invoice-transaction-summaries/{id}',
        'permissionsRequired' : ['finance-storage.invoice-transaction-summaries.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'finance-storage.budgets.collection.get',
      'displayName' : 'budget-collection get',
      'description' : 'Get a collection of budgets'
    }, {
      'permissionName' : 'finance-storage.budgets.item.post',
      'displayName' : 'budget-item post',
      'description' : 'Create a new budget'
    }, {
      'permissionName' : 'finance-storage.budgets.item.get',
      'displayName' : 'budget-item get',
      'description' : 'Fetch a budget'
    }, {
      'permissionName' : 'finance-storage.budgets.item.put',
      'displayName' : 'budget-item put',
      'description' : 'Update a budget'
    }, {
      'permissionName' : 'finance-storage.budgets.item.delete',
      'displayName' : 'budget-item delete',
      'description' : 'Delete a budget'
    }, {
      'permissionName' : 'finance-storage.group-budgets.collection.get',
      'displayName' : 'Get budget-collection from group-budget view',
      'description' : 'Get a collection of budgets'
    }, {
      'permissionName' : 'finance-storage.budgets.all',
      'displayName' : 'All budget perms',
      'description' : 'All permissions for the budget',
      'subPermissions' : ['finance-storage.budgets.collection.get', 'finance-storage.budgets.item.post', 'finance-storage.budgets.item.get', 'finance-storage.budgets.item.put', 'finance-storage.budgets.item.delete', 'finance-storage.group-budgets.collection.get']
    }, {
      'permissionName' : 'finance-storage.fiscal-years.collection.get',
      'displayName' : 'fiscal-year-collection get',
      'description' : 'Get collection of fiscal year'
    }, {
      'permissionName' : 'finance-storage.fiscal-years.item.post',
      'displayName' : 'fiscal-year-item post',
      'description' : 'Create a new fiscal year'
    }, {
      'permissionName' : 'finance-storage.fiscal-years.item.get',
      'displayName' : 'fiscal-year-item get',
      'description' : 'Fetch a fiscal year'
    }, {
      'permissionName' : 'finance-storage.fiscal-years.item.put',
      'displayName' : 'fiscal-year-item put',
      'description' : 'Update a fiscal year'
    }, {
      'permissionName' : 'finance-storage.fiscal-years.item.delete',
      'displayName' : 'fiscal-year-item delete',
      'description' : 'Delete a fiscal year'
    }, {
      'permissionName' : 'finance-storage.fiscal-years.all',
      'displayName' : 'All fiscal_year perms',
      'description' : 'All permissions for the fiscal year',
      'subPermissions' : ['finance-storage.fiscal-years.collection.get', 'finance-storage.fiscal-years.item.post', 'finance-storage.fiscal-years.item.get', 'finance-storage.fiscal-years.item.put', 'finance-storage.fiscal-years.item.delete']
    }, {
      'permissionName' : 'finance-storage.fund-distributions.collection.get',
      'displayName' : 'fund-distribution-collection get',
      'description' : 'Get collection of fund distributions'
    }, {
      'permissionName' : 'finance-storage.fund-distributions.item.post',
      'displayName' : 'fund-distribution-item post',
      'description' : 'Create a new fund distribution'
    }, {
      'permissionName' : 'finance-storage.fund-distributions.item.get',
      'displayName' : 'fund-distribution-item get',
      'description' : 'Fetch a fund distribution'
    }, {
      'permissionName' : 'finance-storage.fund-distributions.item.put',
      'displayName' : 'fund-distribution-item put',
      'description' : 'Update a fund distribution'
    }, {
      'permissionName' : 'finance-storage.fund-distributions.item.delete',
      'displayName' : 'fund-distribution-item delete',
      'description' : 'Delete a fund distribution'
    }, {
      'permissionName' : 'finance-storage.fund-distributions.all',
      'displayName' : 'All fund_distribution perms',
      'description' : 'All permissions for the fund distribution',
      'subPermissions' : ['finance-storage.fund-distributions.collection.get', 'finance-storage.fund-distributions.item.post', 'finance-storage.fund-distributions.item.get', 'finance-storage.fund-distributions.item.put', 'finance-storage.fund-distributions.item.delete']
    }, {
      'permissionName' : 'finance-storage.fund-types.collection.get',
      'displayName' : 'Fund-type - get the collection of Fund-types',
      'description' : 'Get collection of fund types'
    }, {
      'permissionName' : 'finance-storage.fund-types.item.post',
      'displayName' : 'Fund-type - create a new Fund-type',
      'description' : 'Create a new fund type'
    }, {
      'permissionName' : 'finance-storage.fund-types.item.get',
      'displayName' : 'Fund-type - get an existing Fund-type',
      'description' : 'Fetch a fund type'
    }, {
      'permissionName' : 'finance-storage.fund-types.item.put',
      'displayName' : 'Fund-type - modify an existing Fund-type',
      'description' : 'Update a fund type'
    }, {
      'permissionName' : 'finance-storage.fund-types.item.delete',
      'displayName' : 'Fund-type - delete an existing Fund-type',
      'description' : 'Delete a fund type'
    }, {
      'permissionName' : 'finance-storage.fund-types.all',
      'displayName' : 'All fund-type perms',
      'description' : 'All permissions for the fund type',
      'subPermissions' : ['finance-storage.fund-types.collection.get', 'finance-storage.fund-types.item.post', 'finance-storage.fund-types.item.get', 'finance-storage.fund-types.item.put', 'finance-storage.fund-types.item.delete']
    }, {
      'permissionName' : 'finance-storage.funds.collection.get',
      'displayName' : 'fund-collection get',
      'description' : 'Get collection of funds'
    }, {
      'permissionName' : 'finance-storage.funds.item.post',
      'displayName' : 'fund-item post',
      'description' : 'Create a new fund'
    }, {
      'permissionName' : 'finance-storage.funds.item.get',
      'displayName' : 'fund-item get',
      'description' : 'Fetch a fund'
    }, {
      'permissionName' : 'finance-storage.funds.item.put',
      'displayName' : 'fund-item put',
      'description' : 'Update a fund'
    }, {
      'permissionName' : 'finance-storage.funds.item.delete',
      'displayName' : 'fund-item delete',
      'description' : 'Delete a fund'
    }, {
      'permissionName' : 'finance-storage.funds.all',
      'displayName' : 'All fund perms',
      'description' : 'All permissions for the fund',
      'subPermissions' : ['finance-storage.funds.collection.get', 'finance-storage.funds.item.post', 'finance-storage.funds.item.get', 'finance-storage.funds.item.put', 'finance-storage.funds.item.delete']
    }, {
      'permissionName' : 'finance-storage.groups.collection.get',
      'displayName' : 'Get a collection of group records',
      'description' : 'Get a collection of group records'
    }, {
      'permissionName' : 'finance-storage.groups.item.post',
      'displayName' : 'Create a new group record',
      'description' : 'Create a new group record'
    }, {
      'permissionName' : 'finance-storage.groups.item.get',
      'displayName' : 'Get a specific group record',
      'description' : 'Get a group record'
    }, {
      'permissionName' : 'finance-storage.groups.item.put',
      'displayName' : 'Update a specific group record',
      'description' : 'Update a specific group record'
    }, {
      'permissionName' : 'finance-storage.groups.item.delete',
      'displayName' : 'Delete a specific group record',
      'description' : 'Delete a specific group record'
    }, {
      'permissionName' : 'finance-storage.group-fund-fiscal-years.collection.get',
      'displayName' : 'Get a collection of group/fund/fiscal year records relations',
      'description' : 'Get a collection of group/fund/fiscal year records relations'
    }, {
      'permissionName' : 'finance-storage.group-fund-fiscal-years.item.post',
      'displayName' : 'Create a new group/fund/fiscal year records relation',
      'description' : 'Create a new group/fund/fiscal year records relation'
    }, {
      'permissionName' : 'finance-storage.group-fund-fiscal-years.item.get',
      'displayName' : 'Get a specific group/fund/fiscal year records relation',
      'description' : 'Get a group/fund/fiscal year records relation'
    }, {
      'permissionName' : 'finance-storage.group-fund-fiscal-years.item.put',
      'displayName' : 'Update a specific group/fund/fiscal year records relation',
      'description' : 'Update a specific group/fund/fiscal year records relation'
    }, {
      'permissionName' : 'finance-storage.group-fund-fiscal-years.item.delete',
      'displayName' : 'Delete a specific group/fund/fiscal year records relation',
      'description' : 'Delete a specific group/fund/fiscal year records relation'
    }, {
      'permissionName' : 'finance-storage.groups.all',
      'displayName' : 'All group related permissions',
      'description' : 'All group related permissions',
      'subPermissions' : ['finance-storage.groups.collection.get', 'finance-storage.groups.item.post', 'finance-storage.groups.item.get', 'finance-storage.groups.item.put', 'finance-storage.groups.item.delete', 'finance-storage.group-fund-fiscal-years.collection.get', 'finance-storage.group-fund-fiscal-years.item.post', 'finance-storage.group-fund-fiscal-years.item.get', 'finance-storage.group-fund-fiscal-years.item.put', 'finance-storage.group-fund-fiscal-years.item.delete']
    }, {
      'permissionName' : 'finance-storage.ledgers.collection.get',
      'displayName' : 'ledger-collection get',
      'description' : 'Get collection of ledgers'
    }, {
      'permissionName' : 'finance-storage.ledgers.item.post',
      'displayName' : 'ledger-item post',
      'description' : 'Create a new ledger'
    }, {
      'permissionName' : 'finance-storage.ledgers.item.get',
      'displayName' : 'ledger-item get',
      'description' : 'Fetch a ledger'
    }, {
      'permissionName' : 'finance-storage.ledgers.item.put',
      'displayName' : 'ledger-item put',
      'description' : 'Update a ledger'
    }, {
      'permissionName' : 'finance-storage.ledgers.item.delete',
      'displayName' : 'ledger-item delete',
      'description' : 'Delete a ledger'
    }, {
      'permissionName' : 'finance-storage.ledgersFY.collection.get',
      'displayName' : 'ledgersFY-collection get',
      'description' : 'Get collection of ledgersFY'
    }, {
      'permissionName' : 'finance-storage.ledgers.all',
      'displayName' : 'All fund perms',
      'description' : 'All permissions for the ledger',
      'subPermissions' : ['finance-storage.ledgers.collection.get', 'finance-storage.ledgers.item.post', 'finance-storage.ledgers.item.get', 'finance-storage.ledgers.item.put', 'finance-storage.ledgers.item.delete', 'finance-storage.ledgersFY.collection.get']
    }, {
      'permissionName' : 'finance-storage.transactions.collection.get',
      'displayName' : 'finance-storage.transactions.-collection get',
      'description' : 'Get collection of transactions'
    }, {
      'permissionName' : 'finance-storage.transactions.item.post',
      'displayName' : 'finance-storage.transactions.-item post',
      'description' : 'Create a new transaction'
    }, {
      'permissionName' : 'finance-storage.transactions.item.get',
      'displayName' : 'finance-storage.transactions.-item get',
      'description' : 'Fetch a transaction'
    }, {
      'permissionName' : 'finance-storage.transactions.item.put',
      'displayName' : 'finance-storage.transactions.-item put',
      'description' : 'Update a transaction'
    }, {
      'permissionName' : 'finance-storage.transactions.item.delete',
      'displayName' : 'finance-storage.transactions.-item delete',
      'description' : 'Delete a transaction'
    }, {
      'permissionName' : 'finance-storage.transactions.all',
      'displayName' : 'All transaction perms',
      'description' : 'All permissions for the transaction',
      'subPermissions' : ['finance-storage.transactions.collection.get', 'finance-storage.transactions.item.post', 'finance-storage.transactions.item.get', 'finance-storage.transactions.item.put']
    }, {
      'permissionName' : 'finance-storage.order-transaction-summaries.item.get',
      'displayName' : 'Retrieve a new order transaction summary record',
      'description' : 'Retrieve a new order transaction summary record'
    }, {
      'permissionName' : 'finance-storage.order-transaction-summaries.item.post',
      'displayName' : 'Create a new order transaction summary record',
      'description' : 'Create a new order transaction summary record'
    }, {
      'permissionName' : 'finance-storage.order-transaction-summaries.item.delete',
      'displayName' : 'Delete a new order transaction summary record',
      'description' : 'Delete a new order transaction summary record'
    }, {
      'permissionName' : 'finance-storage.order-transaction-summaries.all',
      'displayName' : 'All order transaction summary perms',
      'description' : 'All permissions for the order transaction summary',
      'subPermissions' : ['finance-storage.order-transaction-summaries.item.get', 'finance-storage.order-transaction-summaries.item.post', 'finance-storage.order-transaction-summaries.item.delete']
    }, {
      'permissionName' : 'finance-storage.invoice-transaction-summaries.item.get',
      'displayName' : 'Retrieve an invoice transaction summary record',
      'description' : 'Retrieve an invoice transaction summary record'
    }, {
      'permissionName' : 'finance-storage.invoice-transaction-summaries.item.post',
      'displayName' : 'Create a new invoice transaction summary record',
      'description' : 'Create a new invoice transaction summary record'
    }, {
      'permissionName' : 'finance-storage.invoice-transaction-summaries.item.delete',
      'displayName' : 'Delete an invoice transaction summary record',
      'description' : 'Delete an  invoice transaction summary record'
    }, {
      'permissionName' : 'finance-storage.invoice-transaction-summaries.all',
      'displayName' : 'All invoice transaction summary perms',
      'description' : 'All permissions for the invoice transaction summary',
      'subPermissions' : ['finance-storage.invoice-transaction-summaries.item.get', 'finance-storage.invoice-transaction-summaries.item.post', 'finance-storage.invoice-transaction-summaries.item.delete']
    }, {
      'permissionName' : 'finance.module.all',
      'displayName' : 'All finance-module perms',
      'description' : 'All permissions for the finance module',
      'subPermissions' : ['finance-storage.budgets.all', 'finance-storage.fiscal-years.all', 'finance-storage.fund-distributions.all', 'finance-storage.funds.all', 'finance-storage.groups.all', 'finance-storage.ledgers.all', 'finance-storage.transactions.all', 'finance-storage.fund-types.all', 'finance-storage.order-transaction-summaries.all', 'finance-storage.invoice-transaction-summaries.all']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-finance-storage:4.2.0-SNAPSHOT.61',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-gobi-1.9.0-SNAPSHOT.105',
    'name' : 'GOBI® Module',
    'requires' : [{
      'id' : 'orders',
      'version' : '9.0'
    }, {
      'id' : 'configuration',
      'version' : '2.0'
    }, {
      'id' : 'contributor-name-types',
      'version' : '1.2'
    }, {
      'id' : 'material-types',
      'version' : '2.2'
    }, {
      'id' : 'locations',
      'version' : '3.0'
    }, {
      'id' : 'organizations-storage.organizations',
      'version' : '2.1'
    }, {
      'id' : 'finance.funds',
      'version' : '1.0'
    }, {
      'id' : 'identifier-types',
      'version' : '1.2'
    }],
    'provides' : [{
      'id' : 'gobi',
      'version' : '1.8',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/gobi/validate',
        'permissionsRequired' : ['gobi.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/gobi/validate',
        'permissionsRequired' : ['gobi.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/gobi/orders',
        'permissionsRequired' : ['gobi.item.post'],
        'modulePermissions' : ['orders.item.post', 'orders.collection.get', 'orders.item.get', 'orders.item.put', 'inventory-storage.contributor-name-types.collection.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.locations.collection.get', 'inventory-storage.identifier-types.collection.get', 'organizations-storage.organizations.collection.get', 'configuration.entries.collection.get', 'finance.funds.collection.get', 'orders.item.approve']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'gobi.item.post',
      'displayName' : 'gobi - post order',
      'description' : 'Creates an order'
    }, {
      'permissionName' : 'gobi.all',
      'displayName' : 'gobi - all permissions',
      'description' : 'Entire set of permissions needed to use gobi',
      'subPermissions' : ['gobi.item.post']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-gobi:1.9.0-SNAPSHOT.105',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-graphql-1.1.1000214',
    'name' : 'GraphQL API for FOLIO',
    'provides' : [{
      'id' : 'graphql',
      'version' : '0.0.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/graphql'
      }]
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-graphql:1.1.1000214',
      'dockerPull' : true,
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '3001/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 268435456
        }
      }
    }
  }, {
    'id' : 'mod-inventory-14.0.0-SNAPSHOT.189',
    'name' : 'Inventory Module',
    'requires' : [{
      'id' : 'item-storage',
      'version' : '8.0'
    }, {
      'id' : 'instance-storage',
      'version' : '7.2'
    }, {
      'id' : 'instance-storage-batch',
      'version' : '0.2'
    }, {
      'id' : 'holdings-storage',
      'version' : '2.0 3.0 4.0'
    }, {
      'id' : 'material-types',
      'version' : '2.0'
    }, {
      'id' : 'loan-types',
      'version' : '2.0'
    }, {
      'id' : 'locations',
      'version' : '2.0 3.0'
    }, {
      'id' : 'instance-types',
      'version' : '1.0 2.0'
    }, {
      'id' : 'identifier-types',
      'version' : '1.0'
    }, {
      'id' : 'contributor-name-types',
      'version' : '1.0'
    }, {
      'id' : 'users',
      'version' : '15.0'
    }],
    'provides' : [{
      'id' : 'inventory',
      'version' : '10.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/inventory/items',
        'permissionsRequired' : ['inventory.items.collection.get'],
        'modulePermissions' : ['inventory-storage.items.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.loan-types.item.get', 'inventory-storage.loan-types.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/inventory/items/{id}',
        'permissionsRequired' : ['inventory.items.item.get'],
        'modulePermissions' : ['inventory-storage.items.item.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.loan-types.item.get', 'inventory-storage.loan-types.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/inventory/items',
        'permissionsRequired' : ['inventory.items.item.post'],
        'modulePermissions' : ['inventory-storage.items.item.post', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.loan-types.item.get', 'inventory-storage.loan-types.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.collection.get', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'users.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/inventory/items/{id}',
        'permissionsRequired' : ['inventory.items.item.put'],
        'modulePermissions' : ['inventory-storage.items.item.put', 'users.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/inventory/items/{id}',
        'permissionsRequired' : ['inventory.items.item.delete'],
        'modulePermissions' : ['inventory-storage.items.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/inventory/items',
        'permissionsRequired' : ['inventory.items.collection.delete'],
        'modulePermissions' : ['inventory-storage.items.collection.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/inventory/instances',
        'permissionsRequired' : ['inventory.instances.collection.get'],
        'modulePermissions' : ['inventory-storage.instances.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/inventory/instances/{id}',
        'permissionsRequired' : ['inventory.instances.item.get'],
        'modulePermissions' : ['inventory-storage.instances.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/inventory/instances',
        'permissionsRequired' : ['inventory.instances.item.post'],
        'modulePermissions' : ['inventory-storage.instances.item.post', 'inventory-storage.instances.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/inventory/instances/{id}',
        'permissionsRequired' : ['inventory.instances.item.put'],
        'modulePermissions' : ['inventory-storage.instances.item.put', 'inventory-storage.instances.item.get', 'inventory-storage.instances.item.post', 'inventory-storage.instances.item.delete', 'source-storage.record.update']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/inventory/instances/{id}',
        'permissionsRequired' : ['inventory.instances.item.delete'],
        'modulePermissions' : ['inventory-storage.instances.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/inventory/instances',
        'permissionsRequired' : ['inventory.instances.collection.delete'],
        'modulePermissions' : ['inventory-storage.instances.collection.delete']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/inventory/ingest/mods',
        'permissionsRequired' : ['inventory.ingest.mods.post'],
        'modulePermissions' : ['inventory-storage.items.item.post', 'inventory-storage.instances.item.post', 'inventory-storage.instances.collection.get', 'inventory-storage.holdings.item.post', 'inventory-storage.holdings.collection.get', 'inventory-storage.material-types.collection.get', 'inventory-storage.loan-types.collection.get', 'inventory-storage.locations.collection.get', 'inventory-storage.instance-types.collection.get', 'inventory-storage.identifier-types.collection.get', 'inventory-storage.contributor-name-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/inventory/ingest/mods/status/{id}',
        'permissionsRequired' : ['inventory.ingest.mods.status.get']
      }]
    }, {
      'id' : 'inventory-batch',
      'version' : '0.3',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/inventory/instances/batch',
        'permissionsRequired' : ['inventory.instances.batch.post'],
        'modulePermissions' : ['inventory-storage.instances.item.post', 'inventory-storage.instances.item.get', 'inventory-storage.instances.item.put', 'inventory-storage.instances.item.delete', 'inventory-storage.instances.batch.post']
      }]
    }, {
      'id' : 'inventory-config',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/inventory/config/instances/blocked-fields',
        'permissionsRequired' : ['inventory.config.instances.blocked-fields.get'],
        'modulePermissions' : []
      }]
    }, {
      'id' : 'isbn-utils',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/isbn/convertTo13',
        'permissionsRequired' : ['isbn-utils.convert-to-13.get'],
        'modulePermissions' : []
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/isbn/convertTo10',
        'permissionsRequired' : ['isbn-utils.convert-to-10.get'],
        'modulePermissions' : []
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/isbn/validator',
        'permissionsRequired' : ['isbn-utils.validator.get'],
        'modulePermissions' : []
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'inventory.items.collection.get',
      'displayName' : 'Inventory - get item collection',
      'description' : 'Get item collection'
    }, {
      'permissionName' : 'inventory.items.collection.delete',
      'displayName' : 'Inventory - delete entire item collection',
      'description' : 'Delete entire item collection'
    }, {
      'permissionName' : 'inventory.items.item.get',
      'displayName' : 'Inventory - get individual item',
      'description' : 'Get individual item'
    }, {
      'permissionName' : 'inventory.items.item.post',
      'displayName' : 'Inventory - create individual item',
      'description' : 'Create individual item'
    }, {
      'permissionName' : 'inventory.items.item.put',
      'displayName' : 'Inventory - modify item',
      'description' : 'Modify item'
    }, {
      'permissionName' : 'inventory.items.item.delete',
      'displayName' : 'Inventory - delete individual item',
      'description' : 'Delete individual item'
    }, {
      'permissionName' : 'inventory.instances.collection.get',
      'displayName' : 'Inventory - get instance collection',
      'description' : 'Get instance collection'
    }, {
      'permissionName' : 'inventory.instances.collection.delete',
      'displayName' : 'Inventory - delete entire instance collection',
      'description' : 'Delete entire instance collection'
    }, {
      'permissionName' : 'inventory.instances.item.get',
      'displayName' : 'Inventory - get individual instance',
      'description' : 'Get individual instance'
    }, {
      'permissionName' : 'inventory.instances.item.post',
      'displayName' : 'Inventory - create individual instance',
      'description' : 'Create individual instance'
    }, {
      'permissionName' : 'inventory.instances.batch.post',
      'displayName' : 'Inventory - create batch of individual instance',
      'description' : 'Create batch of individual instance'
    }, {
      'permissionName' : 'inventory.instances.item.put',
      'displayName' : 'Inventory - modify instance',
      'description' : 'Modify instance'
    }, {
      'permissionName' : 'inventory.instances.item.delete',
      'displayName' : 'Inventory - delete individual instance',
      'description' : 'Delete individual instance'
    }, {
      'permissionName' : 'inventory.ingest.mods.post',
      'displayName' : 'Inventory - ingest a MODS format file',
      'description' : 'Request ingestion of a MODS format file'
    }, {
      'permissionName' : 'inventory.ingest.mods.status.get',
      'displayName' : 'Inventory - MODS ingest status',
      'description' : 'Check the status of a MODS format file ingestion'
    }, {
      'permissionName' : 'inventory.config.instances.blocked-fields.get',
      'displayName' : 'Inventory - get configuration for blocked fields of instances',
      'description' : 'Get configuration for blocked fields of instances'
    }, {
      'permissionName' : 'inventory.all',
      'displayName' : 'Inventory - all permissions',
      'description' : 'Entire set of permissions needed to use the inventory',
      'subPermissions' : ['inventory.items.collection.get', 'inventory.items.item.get', 'inventory.items.item.post', 'inventory.items.item.put', 'inventory.items.item.delete', 'inventory.items.collection.delete', 'inventory.instances.collection.get', 'inventory.instances.item.get', 'inventory.instances.item.post', 'inventory.instances.batch.post', 'inventory.instances.item.put', 'inventory.instances.item.delete', 'inventory.instances.collection.delete', 'inventory.ingest.mods.post', 'inventory.ingest.mods.status.get', 'inventory.config.instances.blocked-fields.get']
    }, {
      'permissionName' : 'isbn-utils.convert-to-13.get',
      'displayName' : 'ISBN utils - convert to ISBN-13 format',
      'description' : 'Convert isbn code to ISBN-13 format'
    }, {
      'permissionName' : 'isbn-utils.convert-to-10.get',
      'displayName' : 'ISBN utils - convert to ISBN-10 format',
      'description' : 'Convert isbn code to ISBN-10 format'
    }, {
      'permissionName' : 'isbn-utils.validator.get',
      'displayName' : 'ISBN utils - validate ISBN code',
      'description' : 'Check that isbn code is valid'
    }, {
      'permissionName' : 'isbn-utils.all',
      'displayName' : 'Isbn-utils - all permissions',
      'description' : 'Entire set of permissions needed to use the isbn-utils',
      'subPermissions' : ['isbn-utils.convert-to-13.get', 'isbn-utils.convert-to-10.get', 'isbn-utils.validator.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-inventory:14.0.0-SNAPSHOT.189',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0 -Dorg.folio.metadata.inventory.storage.type=okapi'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '9403/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-inventory-storage-19.0.0-SNAPSHOT.381',
    'name' : 'Inventory Storage Module',
    'provides' : [{
      'id' : 'item-storage',
      'version' : '8.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/item-storage/items',
        'permissionsRequired' : ['inventory-storage.items.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/item-storage/items/{id}',
        'permissionsRequired' : ['inventory-storage.items.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/item-storage/items',
        'permissionsRequired' : ['inventory-storage.items.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/item-storage/items/{id}',
        'permissionsRequired' : ['inventory-storage.items.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/item-storage/items/{id}',
        'permissionsRequired' : ['inventory-storage.items.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/item-storage/items',
        'permissionsRequired' : ['inventory-storage.items.collection.delete']
      }]
    }, {
      'id' : 'item-storage-batch-sync',
      'version' : '0.2',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/item-storage/batch/synchronous',
        'permissionsRequired' : ['inventory-storage.items.batch.post']
      }]
    }, {
      'id' : 'holdings-storage',
      'version' : '4.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/holdings-storage/holdings',
        'permissionsRequired' : ['inventory-storage.holdings.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/holdings-storage/holdings/{id}',
        'permissionsRequired' : ['inventory-storage.holdings.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/holdings-storage/holdings',
        'permissionsRequired' : ['inventory-storage.holdings.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/holdings-storage/holdings/{id}',
        'permissionsRequired' : ['inventory-storage.holdings.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/holdings-storage/holdings/{id}',
        'permissionsRequired' : ['inventory-storage.holdings.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/holdings-storage/holdings',
        'permissionsRequired' : ['inventory-storage.holdings.collection.delete']
      }]
    }, {
      'id' : 'holdings-storage-batch-sync',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/holdings-storage/batch/synchronous',
        'permissionsRequired' : ['inventory-storage.holdings.batch.post']
      }]
    }, {
      'id' : 'instance-storage',
      'version' : '7.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/instance-storage/instances',
        'permissionsRequired' : ['inventory-storage.instances.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-storage/instances/{id}',
        'permissionsRequired' : ['inventory-storage.instances.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/instance-storage/instances',
        'permissionsRequired' : ['inventory-storage.instances.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-storage/instances/{id}',
        'permissionsRequired' : ['inventory-storage.instances.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-storage/instances/{id}',
        'permissionsRequired' : ['inventory-storage.instances.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-storage/instances/{id}/source-record',
        'permissionsRequired' : ['inventory-storage.instances.source-record.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-storage/instances/{id}/source-record/marc-json',
        'permissionsRequired' : ['inventory-storage.instances.source-record.marc-json.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-storage/instances/{id}/source-record/marc-json',
        'permissionsRequired' : ['inventory-storage.instances.source-record.marc-json.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-storage/instances/{id}/source-record/marc-json',
        'permissionsRequired' : ['inventory-storage.instances.source-record.marc-json.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-storage/instances',
        'permissionsRequired' : ['inventory-storage.instances.collection.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-storage/instance-relationships',
        'permissionsRequired' : ['inventory-storage.instances.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/instance-storage/instance-relationships',
        'permissionsRequired' : ['inventory-storage.instances.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-storage/instance-relationships/{id}',
        'permissionsRequired' : ['inventory-storage.instances.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-storage/instance-relationships/{id}',
        'permissionsRequired' : ['inventory-storage.instances.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-storage/instance-relationships/{id}',
        'permissionsRequired' : ['inventory-storage.instances.item.delete']
      }]
    }, {
      'id' : 'instance-storage-batch',
      'version' : '0.2',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/instance-storage/batch/instances',
        'permissionsRequired' : ['inventory-storage.instances.batch.post']
      }]
    }, {
      'id' : 'instance-storage-batch-sync',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/instance-storage/batch/synchronous',
        'permissionsRequired' : ['inventory-storage.instances.batch.post']
      }]
    }, {
      'id' : 'loan-types',
      'version' : '2.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/loan-types',
        'permissionsRequired' : ['inventory-storage.loan-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/loan-types/{id}',
        'permissionsRequired' : ['inventory-storage.loan-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/loan-types',
        'permissionsRequired' : ['inventory-storage.loan-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/loan-types/{id}',
        'permissionsRequired' : ['inventory-storage.loan-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/loan-types/{id}',
        'permissionsRequired' : ['inventory-storage.loan-types.item.delete']
      }]
    }, {
      'id' : 'material-types',
      'version' : '2.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/material-types',
        'permissionsRequired' : ['inventory-storage.material-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/material-types/{id}',
        'permissionsRequired' : ['inventory-storage.material-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/material-types',
        'permissionsRequired' : ['inventory-storage.material-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/material-types/{id}',
        'permissionsRequired' : ['inventory-storage.material-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/material-types/{id}',
        'permissionsRequired' : ['inventory-storage.material-types.item.delete']
      }]
    }, {
      'id' : 'shelf-locations',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/shelf-locations',
        'permissionsRequired' : ['inventory-storage.shelf-locations.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/shelf-locations/{id}',
        'permissionsRequired' : ['inventory-storage.shelf-locations.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/shelf-locations',
        'permissionsRequired' : ['inventory-storage.shelf-locations.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/shelf-locations/{id}',
        'permissionsRequired' : ['inventory-storage.shelf-locations.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/shelf-locations/{id}',
        'permissionsRequired' : ['inventory-storage.shelf-locations.item.delete']
      }]
    }, {
      'id' : 'location-units',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/location-units/institutions',
        'permissionsRequired' : ['inventory-storage.location-units.institutions.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/location-units/institutions/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.institutions.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/location-units/institutions',
        'permissionsRequired' : ['inventory-storage.location-units.institutions.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/location-units/institutions/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.institutions.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/location-units/institutions/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.institutions.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/location-units/campuses',
        'permissionsRequired' : ['inventory-storage.location-units.campuses.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/location-units/campuses/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.campuses.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/location-units/campuses',
        'permissionsRequired' : ['inventory-storage.location-units.campuses.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/location-units/campuses/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.campuses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/location-units/campuses/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.campuses.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/location-units/libraries',
        'permissionsRequired' : ['inventory-storage.location-units.libraries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/location-units/libraries/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.libraries.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/location-units/libraries',
        'permissionsRequired' : ['inventory-storage.location-units.libraries.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/location-units/libraries/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.libraries.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/location-units/libraries/{id}',
        'permissionsRequired' : ['inventory-storage.location-units.libraries.item.delete']
      }]
    }, {
      'id' : 'locations',
      'version' : '3.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/locations',
        'permissionsRequired' : ['inventory-storage.locations.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/locations/{id}',
        'permissionsRequired' : ['inventory-storage.locations.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/locations',
        'permissionsRequired' : ['inventory-storage.locations.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/locations/{id}',
        'permissionsRequired' : ['inventory-storage.locations.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/locations/{id}',
        'permissionsRequired' : ['inventory-storage.locations.item.delete']
      }]
    }, {
      'id' : 'instance-relationship-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/instance-relationship-types',
        'permissionsRequired' : ['inventory-storage.instance-relationship-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-relationship-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-relationship-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/instance-relationship-types',
        'permissionsRequired' : ['inventory-storage.instance-relationship-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-relationship-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-relationship-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-relationship-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-relationship-types.item.delete']
      }]
    }, {
      'id' : 'identifier-types',
      'version' : '1.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/identifier-types',
        'permissionsRequired' : ['inventory-storage.identifier-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/identifier-types/{id}',
        'permissionsRequired' : ['inventory-storage.identifier-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/identifier-types',
        'permissionsRequired' : ['inventory-storage.identifier-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/identifier-types/{id}',
        'permissionsRequired' : ['inventory-storage.identifier-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/identifier-types/{id}',
        'permissionsRequired' : ['inventory-storage.identifier-types.item.delete']
      }]
    }, {
      'id' : 'contributor-types',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/contributor-types',
        'permissionsRequired' : ['inventory-storage.contributor-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/contributor-types/{id}',
        'permissionsRequired' : ['inventory-storage.contributor-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/contributor-types',
        'permissionsRequired' : ['inventory-storage.contributor-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/contributor-types/{id}',
        'permissionsRequired' : ['inventory-storage.contributor-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/contributor-types/{id}',
        'permissionsRequired' : ['inventory-storage.contributor-types.item.delete']
      }]
    }, {
      'id' : 'contributor-name-types',
      'version' : '1.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/contributor-name-types',
        'permissionsRequired' : ['inventory-storage.contributor-name-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/contributor-name-types/{id}',
        'permissionsRequired' : ['inventory-storage.contributor-name-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/contributor-name-types',
        'permissionsRequired' : ['inventory-storage.contributor-name-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/contributor-name-types/{id}',
        'permissionsRequired' : ['inventory-storage.contributor-name-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/contributor-name-types/{id}',
        'permissionsRequired' : ['inventory-storage.contributor-name-types.item.delete']
      }]
    }, {
      'id' : 'instance-formats',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/instance-formats',
        'permissionsRequired' : ['inventory-storage.instance-formats.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-formats/{id}',
        'permissionsRequired' : ['inventory-storage.instance-formats.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/instance-formats',
        'permissionsRequired' : ['inventory-storage.instance-formats.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-formats/{id}',
        'permissionsRequired' : ['inventory-storage.instance-formats.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-formats/{id}',
        'permissionsRequired' : ['inventory-storage.instance-formats.item.delete']
      }]
    }, {
      'id' : 'instance-types',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/instance-types',
        'permissionsRequired' : ['inventory-storage.instance-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/instance-types',
        'permissionsRequired' : ['inventory-storage.instance-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-types.item.delete']
      }]
    }, {
      'id' : 'nature-of-content-terms',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/nature-of-content-terms',
        'permissionsRequired' : ['inventory-storage.nature-of-content-terms.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/nature-of-content-terms/{id}',
        'permissionsRequired' : ['inventory-storage.nature-of-content-terms.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/nature-of-content-terms',
        'permissionsRequired' : ['inventory-storage.nature-of-content-terms.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/nature-of-content-terms/{id}',
        'permissionsRequired' : ['inventory-storage.nature-of-content-terms.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/nature-of-content-terms/{id}',
        'permissionsRequired' : ['inventory-storage.nature-of-content-terms.item.delete']
      }]
    }, {
      'id' : 'classification-types',
      'version' : '1.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/classification-types',
        'permissionsRequired' : ['inventory-storage.classification-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/classification-types/{id}',
        'permissionsRequired' : ['inventory-storage.classification-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/classification-types',
        'permissionsRequired' : ['inventory-storage.classification-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/classification-types/{id}',
        'permissionsRequired' : ['inventory-storage.classification-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/classification-types/{id}',
        'permissionsRequired' : ['inventory-storage.classification-types.item.delete']
      }]
    }, {
      'id' : 'alternative-title-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/alternative-title-types',
        'permissionsRequired' : ['inventory-storage.alternative-title-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/alternative-title-types/{id}',
        'permissionsRequired' : ['inventory-storage.alternative-title-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/alternative-title-types',
        'permissionsRequired' : ['inventory-storage.alternative-title-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/alternative-title-types/{id}',
        'permissionsRequired' : ['inventory-storage.alternative-title-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/alternative-title-types/{id}',
        'permissionsRequired' : ['inventory-storage.alternative-title-types.item.delete']
      }]
    }, {
      'id' : 'modes-of-issuance',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/modes-of-issuance',
        'permissionsRequired' : ['inventory-storage.modes-of-issuance.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/modes-of-issuance/{id}',
        'permissionsRequired' : ['inventory-storage.modes-of-issuance.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/modes-of-issuance',
        'permissionsRequired' : ['inventory-storage.modes-of-issuance.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/modes-of-issuance/{id}',
        'permissionsRequired' : ['inventory-storage.modes-of-issuance.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/modes-of-issuance/{id}',
        'permissionsRequired' : ['inventory-storage.modes-of-issuance.item.delete']
      }]
    }, {
      'id' : 'instance-statuses',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/instance-statuses',
        'permissionsRequired' : ['inventory-storage.instance-statuses.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-statuses/{id}',
        'permissionsRequired' : ['inventory-storage.instance-statuses.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/instance-statuses',
        'permissionsRequired' : ['inventory-storage.instance-statuses.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-statuses/{id}',
        'permissionsRequired' : ['inventory-storage.instance-statuses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-statuses/{id}',
        'permissionsRequired' : ['inventory-storage.instance-statuses.item.delete']
      }]
    }, {
      'id' : 'electronic-access-relationships',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/electronic-access-relationships',
        'permissionsRequired' : ['inventory-storage.electronic-access-relationships.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/electronic-access-relationships/{id}',
        'permissionsRequired' : ['inventory-storage.electronic-access-relationships.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/electronic-access-relationships',
        'permissionsRequired' : ['inventory-storage.electronic-access-relationships.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/electronic-access-relationships/{id}',
        'permissionsRequired' : ['inventory-storage.electronic-access-relationships.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/electronic-access-relationships/{id}',
        'permissionsRequired' : ['inventory-storage.electronic-access-relationships.item.delete']
      }]
    }, {
      'id' : 'statistical-code-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/statistical-code-types',
        'permissionsRequired' : ['inventory-storage.statistical-code-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/statistical-code-types/{id}',
        'permissionsRequired' : ['inventory-storage.statistical-code-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/statistical-code-types',
        'permissionsRequired' : ['inventory-storage.statistical-code-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/statistical-code-types/{id}',
        'permissionsRequired' : ['inventory-storage.statistical-code-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/statistical-code-types/{id}',
        'permissionsRequired' : ['inventory-storage.statistical-code-types.item.delete']
      }]
    }, {
      'id' : 'statistical-codes',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/statistical-codes',
        'permissionsRequired' : ['inventory-storage.statistical-codes.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/statistical-codes/{id}',
        'permissionsRequired' : ['inventory-storage.statistical-codes.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/statistical-codes',
        'permissionsRequired' : ['inventory-storage.statistical-codes.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/statistical-codes/{id}',
        'permissionsRequired' : ['inventory-storage.statistical-codes.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/statistical-codes/{id}',
        'permissionsRequired' : ['inventory-storage.statistical-codes.item.delete']
      }]
    }, {
      'id' : 'ill-policies',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/ill-policies',
        'permissionsRequired' : ['inventory-storage.ill-policies.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/ill-policies/{id}',
        'permissionsRequired' : ['inventory-storage.ill-policies.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/ill-policies',
        'permissionsRequired' : ['inventory-storage.ill-policies.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/ill-policies/{id}',
        'permissionsRequired' : ['inventory-storage.ill-policies.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/ill-policies/{id}',
        'permissionsRequired' : ['inventory-storage.ill-policies.item.delete']
      }]
    }, {
      'id' : 'holdings-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/holdings-types',
        'permissionsRequired' : ['inventory-storage.holdings-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/holdings-types/{id}',
        'permissionsRequired' : ['inventory-storage.holdings-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/holdings-types',
        'permissionsRequired' : ['inventory-storage.holdings-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/holdings-types/{id}',
        'permissionsRequired' : ['inventory-storage.holdings-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/holdings-types/{id}',
        'permissionsRequired' : ['inventory-storage.holdings-types.item.delete']
      }]
    }, {
      'id' : 'call-number-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/call-number-types',
        'permissionsRequired' : ['inventory-storage.call-number-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/call-number-types/{id}',
        'permissionsRequired' : ['inventory-storage.call-number-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/call-number-types',
        'permissionsRequired' : ['inventory-storage.call-number-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/call-number-types/{id}',
        'permissionsRequired' : ['inventory-storage.call-number-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/call-number-types/{id}',
        'permissionsRequired' : ['inventory-storage.call-number-types.item.delete']
      }]
    }, {
      'id' : 'instance-note-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/instance-note-types',
        'permissionsRequired' : ['inventory-storage.instance-note-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/instance-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-note-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/instance-note-types',
        'permissionsRequired' : ['inventory-storage.instance-note-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/instance-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-note-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/instance-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.instance-note-types.item.delete']
      }]
    }, {
      'id' : 'holdings-note-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/holdings-note-types',
        'permissionsRequired' : ['inventory-storage.holdings-note-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/holdings-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.holdings-note-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/holdings-note-types',
        'permissionsRequired' : ['inventory-storage.holdings-note-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/holdings-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.holdings-note-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/holdings-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.holdings-note-types.item.delete']
      }]
    }, {
      'id' : 'item-note-types',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/item-note-types',
        'permissionsRequired' : ['inventory-storage.item-note-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/item-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.item-note-types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/item-note-types',
        'permissionsRequired' : ['inventory-storage.item-note-types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/item-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.item-note-types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/item-note-types/{id}',
        'permissionsRequired' : ['inventory-storage.item-note-types.item.delete']
      }]
    }, {
      'id' : 'item-damaged-statuses',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/item-damaged-statuses',
        'permissionsRequired' : ['inventory-storage.item-damaged-statuses.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/item-damaged-statuses/{id}',
        'permissionsRequired' : ['inventory-storage.item-damaged-statuses.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/item-damaged-statuses',
        'permissionsRequired' : ['inventory-storage.item-damaged-statuses.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/item-damaged-statuses/{id}',
        'permissionsRequired' : ['inventory-storage.item-damaged-statuses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/item-damaged-statuses/{id}',
        'permissionsRequired' : ['inventory-storage.item-damaged-statuses.item.delete']
      }]
    }, {
      'id' : 'service-points',
      'version' : '3.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/service-points',
        'permissionsRequired' : ['inventory-storage.service-points.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/service-points/{id}',
        'permissionsRequired' : ['inventory-storage.service-points.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/service-points',
        'permissionsRequired' : ['inventory-storage.service-points.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/service-points/{id}',
        'permissionsRequired' : ['inventory-storage.service-points.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/service-points/{id}',
        'permissionsRequired' : ['inventory-storage.service-points.item.delete']
      }]
    }, {
      'id' : 'service-points-users',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/service-points-users',
        'permissionsRequired' : ['inventory-storage.service-points-users.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/service-points-users/{id}',
        'permissionsRequired' : ['inventory-storage.service-points-users.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/service-points-users',
        'permissionsRequired' : ['inventory-storage.service-points-users.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/service-points-users/{id}',
        'permissionsRequired' : ['inventory-storage.service-points-users.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/service-points-users/{id}',
        'permissionsRequired' : ['inventory-storage.service-points-users.item.delete']
      }]
    }, {
      'id' : 'hrid-settings-storage',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/hrid-settings-storage/hrid-settings',
        'permissionsRequired' : ['inventory-storage.hrid-settings.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/hrid-settings-storage/hrid-settings',
        'permissionsRequired' : ['inventory-storage.hrid-settings.item.put']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'inventory-storage.items.collection.get',
      'displayName' : 'inventory storage - get item collection',
      'description' : 'get item collection from storage'
    }, {
      'permissionName' : 'inventory-storage.items.collection.delete',
      'displayName' : 'inventory storage - delete entire item collection',
      'description' : 'delete entire item collection from storage'
    }, {
      'permissionName' : 'inventory-storage.items.item.get',
      'displayName' : 'inventory storage - get individual item',
      'description' : 'get individual item from storage'
    }, {
      'permissionName' : 'inventory-storage.items.item.post',
      'displayName' : 'inventory storage - create individual item',
      'description' : 'create individual item in storage'
    }, {
      'permissionName' : 'inventory-storage.items.item.put',
      'displayName' : 'inventory storage - modify item',
      'description' : 'modify item in storage'
    }, {
      'permissionName' : 'inventory-storage.items.item.delete',
      'displayName' : 'inventory storage - delete individual item',
      'description' : 'delete individual item from storage'
    }, {
      'permissionName' : 'inventory-storage.items.batch.post',
      'displayName' : 'inventory storage - create a number of items',
      'description' : 'create a number of items in storage'
    }, {
      'permissionName' : 'inventory-storage.holdings.collection.get',
      'displayName' : 'inventory storage - get holdings collection',
      'description' : 'get holdings collection from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings.collection.delete',
      'displayName' : 'inventory storage - delete entire holdings collection',
      'description' : 'delete entire holdings collection from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings.item.get',
      'displayName' : 'inventory storage - get individual holdings record',
      'description' : 'get individual holdings record from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings.item.post',
      'displayName' : 'inventory storage - create individual holdings record',
      'description' : 'create individual holdings record in storage'
    }, {
      'permissionName' : 'inventory-storage.holdings.item.put',
      'displayName' : 'inventory storage - modify holdings record',
      'description' : 'modify holdings record in storage'
    }, {
      'permissionName' : 'inventory-storage.holdings.item.delete',
      'displayName' : 'inventory storage - delete individual holdings record',
      'description' : 'delete individual holdings record from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings.batch.post',
      'displayName' : 'inventory storage - create a number of holdings',
      'description' : 'create a number of holdings in storage'
    }, {
      'permissionName' : 'inventory-storage.instances.collection.get',
      'displayName' : 'inventory storage - get instance collection',
      'description' : 'get instance collection from storage'
    }, {
      'permissionName' : 'inventory-storage.instances.collection.delete',
      'displayName' : 'inventory storage - delete entire instance collection',
      'description' : 'delete entire instance collection from storage'
    }, {
      'permissionName' : 'inventory-storage.instances.item.get',
      'displayName' : 'inventory storage - get individual instance',
      'description' : 'get individual instance from storage'
    }, {
      'permissionName' : 'inventory-storage.instances.item.post',
      'displayName' : 'inventory storage - create individual instance',
      'description' : 'create individual instance in storage'
    }, {
      'permissionName' : 'inventory-storage.instances.item.put',
      'displayName' : 'inventory storage - modify instance',
      'description' : 'modify instance in storage'
    }, {
      'permissionName' : 'inventory-storage.instances.item.delete',
      'displayName' : 'inventory storage - delete individual instance',
      'description' : 'delete individual instance from storage'
    }, {
      'permissionName' : 'inventory-storage.instances.batch.post',
      'displayName' : 'inventory storage - create a number of instances',
      'description' : 'create a number of instances in storage'
    }, {
      'permissionName' : 'inventory-storage.instances.source-record.delete',
      'displayName' : 'inventory storage - delete source record of an individual instance',
      'description' : 'delete source record of individual instance from storage'
    }, {
      'permissionName' : 'inventory-storage.instances.source-record.marc-json.get',
      'displayName' : 'inventory storage - get MARC JSON source record of an individual instance',
      'description' : 'get MARC JSON source record of individual instance from storage'
    }, {
      'permissionName' : 'inventory-storage.instances.source-record.marc-json.put',
      'displayName' : 'inventory storage - set MARC JSON source record of an individual instance',
      'description' : 'set MARC JSON source record of individual instance in storage'
    }, {
      'permissionName' : 'inventory-storage.instances.source-record.marc-json.delete',
      'displayName' : 'inventory storage - delete MARC JSON source record of an individual instance',
      'description' : 'delete MARC JSON source record of individual instance in storage'
    }, {
      'permissionName' : 'inventory-storage.loan-types.collection.get',
      'displayName' : 'inventory storage - get loan-type collection',
      'description' : 'get loan-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.loan-types.item.get',
      'displayName' : 'inventory storage - get individual loan-type',
      'description' : 'get individual loan-type from storage'
    }, {
      'permissionName' : 'inventory-storage.loan-types.item.post',
      'displayName' : 'inventory storage - create individual loan-type',
      'description' : 'create individual loan-type in storage'
    }, {
      'permissionName' : 'inventory-storage.loan-types.item.put',
      'displayName' : 'inventory storage - modify loan-type',
      'description' : 'modify loan-type in storage'
    }, {
      'permissionName' : 'inventory-storage.loan-types.item.delete',
      'displayName' : 'inventory storage - delete individual loan-type',
      'description' : 'delete individual loan-type from storage'
    }, {
      'permissionName' : 'inventory-storage.material-types.collection.get',
      'displayName' : 'inventory storage - get material-type collection',
      'description' : 'get material-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.material-types.item.get',
      'displayName' : 'inventory storage - get individual material-type',
      'description' : 'get individual material-type from storage'
    }, {
      'permissionName' : 'inventory-storage.material-types.item.post',
      'displayName' : 'inventory storage - create individual material-type',
      'description' : 'create individual material-type in storage'
    }, {
      'permissionName' : 'inventory-storage.material-types.item.put',
      'displayName' : 'inventory storage - modify material-type',
      'description' : 'modify material-type in storage'
    }, {
      'permissionName' : 'inventory-storage.material-types.item.delete',
      'displayName' : 'inventory storage - delete individual material-type',
      'description' : 'delete individual material-type from storage'
    }, {
      'permissionName' : 'inventory-storage.shelf-locations.collection.get',
      'displayName' : 'inventory storage - get shelf location collection',
      'description' : 'get shelf location collection from storage'
    }, {
      'permissionName' : 'inventory-storage.shelf-locations.item.get',
      'displayName' : 'inventory storage - get individual shelf location',
      'description' : 'get individual shelf location from storage'
    }, {
      'permissionName' : 'inventory-storage.shelf-locations.item.post',
      'displayName' : 'inventory storage - create individual shelf location',
      'description' : 'create individual shelf location in storage'
    }, {
      'permissionName' : 'inventory-storage.shelf-locations.item.put',
      'displayName' : 'inventory storage - modify shelf location',
      'description' : 'modify shelf location in storage'
    }, {
      'permissionName' : 'inventory-storage.shelf-locations.item.delete',
      'displayName' : 'inventory storage - delete individual shelf location',
      'description' : 'delete individual shelf location from storage'
    }, {
      'permissionName' : 'inventory-storage.location-units.institutions.collection.get',
      'displayName' : 'inventory storage - location units - get institution collection',
      'description' : 'Get institution collection'
    }, {
      'permissionName' : 'inventory-storage.location-units.institutions.item.get',
      'displayName' : 'inventory storage - location units - get individual institution',
      'description' : 'get individual institution'
    }, {
      'permissionName' : 'inventory-storage.location-units.institutions.item.post',
      'displayName' : 'inventory storage - location units - create individual institution',
      'description' : 'create individual instution'
    }, {
      'permissionName' : 'inventory-storage.location-units.institutions.item.put',
      'displayName' : 'inventory storage - location units - modify institution',
      'description' : 'modify institution'
    }, {
      'permissionName' : 'inventory-storage.location-units.institutions.item.delete',
      'displayName' : 'inventory storage - location units - delete individual institution',
      'description' : 'delete individual institution'
    }, {
      'permissionName' : 'inventory-storage.location-units.campuses.collection.get',
      'displayName' : 'inventory storage - location units - get campus collection',
      'description' : 'Get campus collection'
    }, {
      'permissionName' : 'inventory-storage.location-units.campuses.item.get',
      'displayName' : 'inventory storage - location units - get individual campus',
      'description' : 'get individual campus'
    }, {
      'permissionName' : 'inventory-storage.location-units.campuses.item.post',
      'displayName' : 'inventory storage - location units - create individual campus',
      'description' : 'create individual instution'
    }, {
      'permissionName' : 'inventory-storage.location-units.campuses.item.put',
      'displayName' : 'inventory storage - location units - modify campus',
      'description' : 'modify campus'
    }, {
      'permissionName' : 'inventory-storage.location-units.campuses.item.delete',
      'displayName' : 'inventory storage - location units - delete individual campus',
      'description' : 'delete individual campus'
    }, {
      'permissionName' : 'inventory-storage.location-units.libraries.collection.get',
      'displayName' : 'inventory storage - location units - get library collection',
      'description' : 'Get library collection'
    }, {
      'permissionName' : 'inventory-storage.location-units.libraries.item.get',
      'displayName' : 'inventory storage - location units - get individual library',
      'description' : 'get individual library'
    }, {
      'permissionName' : 'inventory-storage.location-units.libraries.item.post',
      'displayName' : 'inventory storage - location units - create individual library',
      'description' : 'create individual instution'
    }, {
      'permissionName' : 'inventory-storage.location-units.libraries.item.put',
      'displayName' : 'inventory storage - location units - modify library',
      'description' : 'modify library'
    }, {
      'permissionName' : 'inventory-storage.location-units.libraries.item.delete',
      'displayName' : 'inventory storage - location units - delete individual library',
      'description' : 'delete individual library'
    }, {
      'permissionName' : 'inventory-storage.locations.collection.get',
      'displayName' : 'inventory storage - locations - get location collection',
      'description' : 'get location collection'
    }, {
      'permissionName' : 'inventory-storage.locations.item.get',
      'displayName' : 'inventory storage - locations - get individual location',
      'description' : 'get individual location'
    }, {
      'permissionName' : 'inventory-storage.locations.item.post',
      'displayName' : 'inventory storage - locations - create individual location',
      'description' : 'create individual location'
    }, {
      'permissionName' : 'inventory-storage.locations.item.put',
      'displayName' : 'inventory storage - locations - modify location',
      'description' : 'modify location'
    }, {
      'permissionName' : 'inventory-storage.locations.item.delete',
      'displayName' : 'inventory storage - locations - delete individual location',
      'description' : 'delete individual location'
    }, {
      'permissionName' : 'inventory-storage.instance-relationship-types.collection.get',
      'displayName' : 'inventory storage - get instance-relationship-type collection',
      'description' : 'get instance-relationship-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-relationship-types.item.get',
      'displayName' : 'inventory storage - get individual instance-relationship-type',
      'description' : 'get individual instance-relationship-type from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-relationship-types.item.post',
      'displayName' : 'inventory storage - create individual instance-relationship-type',
      'description' : 'create individual instance-relationship-type in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-relationship-types.item.put',
      'displayName' : 'inventory storage - modify instance-relationship-type',
      'description' : 'modify instance-relationship-type in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-relationship-types.item.delete',
      'displayName' : 'inventory storage - delete individual instance-relationship-type',
      'description' : 'delete individual instance-relationship-type from storage'
    }, {
      'permissionName' : 'inventory-storage.identifier-types.collection.get',
      'displayName' : 'inventory storage - get identifier-type collection',
      'description' : 'get identifier-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.identifier-types.item.get',
      'displayName' : 'inventory storage - get individual identifier-type',
      'description' : 'get individual identifier-type from storage'
    }, {
      'permissionName' : 'inventory-storage.identifier-types.item.post',
      'displayName' : 'inventory storage - create individual identifier-type',
      'description' : 'create individual identifier-type in storage'
    }, {
      'permissionName' : 'inventory-storage.identifier-types.item.put',
      'displayName' : 'inventory storage - modify identifier-type',
      'description' : 'modify identifier-type in storage'
    }, {
      'permissionName' : 'inventory-storage.identifier-types.item.delete',
      'displayName' : 'inventory storage - delete individual identifier-type',
      'description' : 'delete individual identifier-type from storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-types.collection.get',
      'displayName' : 'inventory storage - get contributor-type collection',
      'description' : 'get contributor-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-types.item.get',
      'displayName' : 'inventory storage - get individual contributor-type',
      'description' : 'get individual contributor-type from storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-types.item.post',
      'displayName' : 'inventory storage - create individual contributor-type',
      'description' : 'create individual contributor-type in storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-types.item.put',
      'displayName' : 'inventory storage - modify contributor-type',
      'description' : 'modify contributor-type in storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-types.item.delete',
      'displayName' : 'inventory storage - delete individual contributor-type',
      'description' : 'delete individual contributor-type from storage'
    }, {
      'permissionName' : 'inventory-storage.service-points.collection.get',
      'displayName' : 'inventory storage - get service-point collection',
      'description' : 'get service-point collection from storage'
    }, {
      'permissionName' : 'inventory-storage.service-points.item.get',
      'displayName' : 'inventory storage - get individual service-point',
      'description' : 'get individual service-point from storage'
    }, {
      'permissionName' : 'inventory-storage.service-points.item.post',
      'displayName' : 'inventory storage - create individual service-point',
      'description' : 'create individual service-point in storage'
    }, {
      'permissionName' : 'inventory-storage.service-points.item.put',
      'displayName' : 'inventory storage - modify service-point',
      'description' : 'modify service-point in storage'
    }, {
      'permissionName' : 'inventory-storage.service-points.item.delete',
      'displayName' : 'inventory storage - delete individual service-point',
      'description' : 'delete individual service-point from storage'
    }, {
      'permissionName' : 'inventory-storage.service-points-users.collection.get',
      'displayName' : 'inventory storage - get service-point-users collection',
      'description' : 'get service-point-users collection from storage'
    }, {
      'permissionName' : 'inventory-storage.service-points-users.item.get',
      'displayName' : 'inventory storage - get individual service-points-user',
      'description' : 'get individual service-points-user from storage'
    }, {
      'permissionName' : 'inventory-storage.service-points-users.item.post',
      'displayName' : 'inventory storage - create individual service-points-user',
      'description' : 'create individual service-points-user in storage'
    }, {
      'permissionName' : 'inventory-storage.service-points-users.item.put',
      'displayName' : 'inventory storage - modify service-points-user',
      'description' : 'modify service-points-user in storage'
    }, {
      'permissionName' : 'inventory-storage.service-points-users.item.delete',
      'displayName' : 'inventory storage - delete individual service-points-user',
      'description' : 'delete individual service-points-user from storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-name-types.collection.get',
      'displayName' : 'inventory storage - get contributor-name-type collection',
      'description' : 'get contributor-name-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-name-types.item.get',
      'displayName' : 'inventory storage - get individual contributor-name-type',
      'description' : 'get individual contributor-name-type from storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-name-types.item.post',
      'displayName' : 'inventory storage - create individual contributor-name-type',
      'description' : 'create individual contributor-name-type in storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-name-types.item.put',
      'displayName' : 'inventory storage - modify contributor-name-type',
      'description' : 'modify contributor-name-type in storage'
    }, {
      'permissionName' : 'inventory-storage.contributor-name-types.item.delete',
      'displayName' : 'inventory storage - delete individual contributor-name-type',
      'description' : 'delete individual contributor-name-type from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-formats.collection.get',
      'displayName' : 'inventory storage - get formats collection',
      'description' : 'get contributor-name-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-formats.item.get',
      'displayName' : 'inventory storage - get individual format',
      'description' : 'get individual instance format from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-formats.item.post',
      'displayName' : 'inventory storage - create individual format',
      'description' : 'create individual instance format in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-formats.item.put',
      'displayName' : 'inventory storage - modify format',
      'description' : 'modify instance format in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-formats.item.delete',
      'displayName' : 'inventory storage - delete individual format',
      'description' : 'delete individual instance format from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-types.collection.get',
      'displayName' : 'inventory storage - get instance types collection',
      'description' : 'get instance-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-types.item.get',
      'displayName' : 'inventory storage - get individual instance type',
      'description' : 'get individual instance type from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-types.item.post',
      'displayName' : 'inventory storage - create individual instance type',
      'description' : 'create individual instance type in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-types.item.put',
      'displayName' : 'inventory storage - modify instance type',
      'description' : 'modify instance type in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-types.item.delete',
      'displayName' : 'inventory storage - delete individual instance type',
      'description' : 'delete instance type in storage'
    }, {
      'permissionName' : 'inventory-storage.nature-of-content-terms.collection.get',
      'displayName' : 'inventory storage - get content terms collection',
      'description' : 'get nature-of-content terms collection from storage'
    }, {
      'permissionName' : 'inventory-storage.nature-of-content-terms.item.get',
      'displayName' : 'inventory storage - get individual content term',
      'description' : 'get individual nature-of-content term from storage'
    }, {
      'permissionName' : 'inventory-storage.nature-of-content-terms.item.post',
      'displayName' : 'inventory storage - create individual content term',
      'description' : 'create individual nature-of-content term in storage'
    }, {
      'permissionName' : 'inventory-storage.nature-of-content-terms.item.put',
      'displayName' : 'inventory storage - modify content term',
      'description' : 'modify nature-of-content term in storage'
    }, {
      'permissionName' : 'inventory-storage.nature-of-content-terms.item.delete',
      'displayName' : 'inventory storage - delete individual content term',
      'description' : 'delete nature-of-content term in storage'
    }, {
      'permissionName' : 'inventory-storage.classification-types.collection.get',
      'displayName' : 'inventory storage - get classification types collection',
      'description' : 'get classification types collection from storage'
    }, {
      'permissionName' : 'inventory-storage.classification-types.item.get',
      'displayName' : 'inventory storage - get individual classification type',
      'description' : 'get individual classification type from storage'
    }, {
      'permissionName' : 'inventory-storage.classification-types.item.post',
      'displayName' : 'inventory storage - create individual classification type',
      'description' : 'create individual classification type in storage'
    }, {
      'permissionName' : 'inventory-storage.classification-types.item.put',
      'displayName' : 'inventory storage - modify classification type',
      'description' : 'modify classification type in storage'
    }, {
      'permissionName' : 'inventory-storage.classification-types.item.delete',
      'displayName' : 'inventory storage - delete individual classification type',
      'description' : 'delete individual classification qualifier from storage'
    }, {
      'permissionName' : 'inventory-storage.alternative-title-types.collection.get',
      'displayName' : 'inventory storage - get alternative-title-type collection',
      'description' : 'get alternative-title-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.alternative-title-types.item.get',
      'displayName' : 'inventory storage - get individual alternative-title-type',
      'description' : 'get individual alternative-title-type from storage'
    }, {
      'permissionName' : 'inventory-storage.alternative-title-types.item.post',
      'displayName' : 'inventory storage - create individual alternative-title-type',
      'description' : 'create individual alternative-title-type in storage'
    }, {
      'permissionName' : 'inventory-storage.alternative-title-types.item.put',
      'displayName' : 'inventory storage - modify alternative-title-type',
      'description' : 'modify alternative-title-type in storage'
    }, {
      'permissionName' : 'inventory-storage.alternative-title-types.item.delete',
      'displayName' : 'inventory storage - delete individual alternative-title-type',
      'description' : 'delete individual alternative-title-type from storage'
    }, {
      'permissionName' : 'inventory-storage.modes-of-issuance.collection.get',
      'displayName' : 'inventory storage - get modes of issuance collection',
      'description' : 'get modes of issuance collection from storage'
    }, {
      'permissionName' : 'inventory-storage.modes-of-issuance.item.get',
      'displayName' : 'inventory storage - get individual mode of issuance',
      'description' : 'get individual mode of issuance from storage'
    }, {
      'permissionName' : 'inventory-storage.modes-of-issuance.item.post',
      'displayName' : 'inventory storage - create individual mode of issuance',
      'description' : 'create individual mode of issuance in storage'
    }, {
      'permissionName' : 'inventory-storage.modes-of-issuance.item.put',
      'displayName' : 'inventory storage - modify mode of issuance',
      'description' : 'modify mode of issuance in storage'
    }, {
      'permissionName' : 'inventory-storage.modes-of-issuance.item.delete',
      'displayName' : 'inventory storage - delete individual mode of issuance',
      'description' : 'delete individual mode of issuance from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-statuses.collection.get',
      'displayName' : 'inventory storage - get instance status collection',
      'description' : 'get instance status collection from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-statuses.item.get',
      'displayName' : 'inventory storage - get individual instance status',
      'description' : 'get individual instance status from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-statuses.item.post',
      'displayName' : 'inventory storage - create individual instance status',
      'description' : 'create individual instance status in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-statuses.item.put',
      'displayName' : 'inventory storage - modify instance status',
      'description' : 'modify instance status in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-statuses.item.delete',
      'displayName' : 'inventory storage - delete individual instance status',
      'description' : 'delete individual instance status from storage'
    }, {
      'permissionName' : 'inventory-storage.electronic-access-relationships.collection.get',
      'displayName' : 'inventory storage - get URL relationship types collection',
      'description' : 'get statistical codes collection from storage'
    }, {
      'permissionName' : 'inventory-storage.electronic-access-relationships.item.get',
      'displayName' : 'inventory storage - get individual URL relationship type',
      'description' : 'get individual statistical code from storage'
    }, {
      'permissionName' : 'inventory-storage.electronic-access-relationships.item.post',
      'displayName' : 'inventory storage - create individual URL relationship type',
      'description' : 'create individual statistical code in storage'
    }, {
      'permissionName' : 'inventory-storage.electronic-access-relationships.item.put',
      'displayName' : 'inventory storage - modify URL relationship type',
      'description' : 'modify statistical code in storage'
    }, {
      'permissionName' : 'inventory-storage.electronic-access-relationships.item.delete',
      'displayName' : 'inventory storage - delete individual URL relationship',
      'description' : 'delete individual URL relationship type from storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-code-types.collection.get',
      'displayName' : 'inventory storage - get statistical code types collection',
      'description' : 'get statistical code types collection from storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-code-types.item.get',
      'displayName' : 'inventory storage - get individual statistical code type',
      'description' : 'get individual statistical code type from storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-code-types.item.post',
      'displayName' : 'inventory storage - create individual statistical code type',
      'description' : 'create individual statistical code type in storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-code-types.item.put',
      'displayName' : 'inventory storage - modify statistical code type',
      'description' : 'modify statistical code type in storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-code-types.item.delete',
      'displayName' : 'inventory storage - delete individual statistical code type',
      'description' : 'delete individual statistical code type from storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-codes.collection.get',
      'displayName' : 'inventory storage - get statistical codes collection',
      'description' : 'get statistical codes collection from storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-codes.item.get',
      'displayName' : 'inventory storage - get individual statistical code',
      'description' : 'get individual statistical code from storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-codes.item.post',
      'displayName' : 'inventory storage - create individual statistical code',
      'description' : 'create individual statistical code in storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-codes.item.put',
      'displayName' : 'inventory storage - modify statistical code',
      'description' : 'modify statistical code in storage'
    }, {
      'permissionName' : 'inventory-storage.statistical-codes.item.delete',
      'displayName' : 'inventory storage - delete individual statistical code',
      'description' : 'delete individual statistical code from storage'
    }, {
      'permissionName' : 'inventory-storage.ill-policies.collection.get',
      'displayName' : 'inventory storage - get ill-policy collection',
      'description' : 'get ill-policy collection from storage'
    }, {
      'permissionName' : 'inventory-storage.ill-policies.item.get',
      'displayName' : 'inventory storage - get individual ill-policy',
      'description' : 'get individual ill-policy from storage'
    }, {
      'permissionName' : 'inventory-storage.ill-policies.item.post',
      'displayName' : 'inventory storage - create individual ill-policy',
      'description' : 'create individual ill-policy in storage'
    }, {
      'permissionName' : 'inventory-storage.ill-policies.item.put',
      'displayName' : 'inventory storage - modify ill-policy',
      'description' : 'modify ill-policy in storage'
    }, {
      'permissionName' : 'inventory-storage.ill-policies.item.delete',
      'displayName' : 'inventory storage - delete individual ill-policy',
      'description' : 'delete individual ill-policy from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-types.collection.get',
      'displayName' : 'inventory storage - get holdings-type collection',
      'description' : 'get holdings-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-types.item.get',
      'displayName' : 'inventory storage - get individual holdings-type',
      'description' : 'get individual holdings-type from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-types.item.post',
      'displayName' : 'inventory storage - create individual holdings-type',
      'description' : 'create individual holdings-type in storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-types.item.put',
      'displayName' : 'inventory storage - modify holdings-type',
      'description' : 'modify holdings-type in storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-types.item.delete',
      'displayName' : 'inventory storage - delete individual holdings-type',
      'description' : 'delete individual holdings-type from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-note-types.collection.get',
      'displayName' : 'inventory storage - get instance-note-type collection',
      'description' : 'get instance-note-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-note-types.item.get',
      'displayName' : 'inventory storage - get individual instance-note-type',
      'description' : 'get individual instance-note-type from storage'
    }, {
      'permissionName' : 'inventory-storage.instance-note-types.item.post',
      'displayName' : 'inventory storage - create individual instance-note-type',
      'description' : 'create individual instance-note-type in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-note-types.item.put',
      'displayName' : 'inventory storage - modify instance-note-type',
      'description' : 'modify instance-note-type in storage'
    }, {
      'permissionName' : 'inventory-storage.instance-note-types.item.delete',
      'displayName' : 'inventory storage - delete individual instance-note-type',
      'description' : 'delete individual instance-note-type from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-note-types.collection.get',
      'displayName' : 'inventory storage - get holdings-note-type collection',
      'description' : 'get holdings-note-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-note-types.item.get',
      'displayName' : 'inventory storage - get individual holdings-note-type',
      'description' : 'get individual holdings-note-type from storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-note-types.item.post',
      'displayName' : 'inventory storage - create individual holdings-note-type',
      'description' : 'create individual holdings-note-type in storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-note-types.item.put',
      'displayName' : 'inventory storage - modify holdings-note-type',
      'description' : 'modify holdings-note-type in storage'
    }, {
      'permissionName' : 'inventory-storage.holdings-note-types.item.delete',
      'displayName' : 'inventory storage - delete individual holdings-note-type',
      'description' : 'delete individual holdings-note-type from storage'
    }, {
      'permissionName' : 'inventory-storage.item-note-types.collection.get',
      'displayName' : 'inventory storage - get item-note-type collection',
      'description' : 'get item-note-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.item-note-types.item.get',
      'displayName' : 'inventory storage - get individual item-note-type',
      'description' : 'get individual item-note-type from storage'
    }, {
      'permissionName' : 'inventory-storage.item-note-types.item.post',
      'displayName' : 'inventory storage - create individual item-note-type',
      'description' : 'create individual item-note-type in storage'
    }, {
      'permissionName' : 'inventory-storage.item-note-types.item.put',
      'displayName' : 'inventory storage - modify item-note-type',
      'description' : 'modify item-note-type in storage'
    }, {
      'permissionName' : 'inventory-storage.item-note-types.item.delete',
      'displayName' : 'inventory storage - delete individual item-note-type',
      'description' : 'delete individual item-note-type from storage'
    }, {
      'permissionName' : 'inventory-storage.item-damaged-statuses.collection.get',
      'displayName' : 'inventory storage - get item-damaged-statuses collection',
      'description' : 'get item-damaged-statuses collection from storage'
    }, {
      'permissionName' : 'inventory-storage.item-damaged-statuses.item.get',
      'displayName' : 'inventory storage - get individual item-damaged-status',
      'description' : 'get individual item-damaged-status from storage'
    }, {
      'permissionName' : 'inventory-storage.item-damaged-statuses.item.post',
      'displayName' : 'inventory storage - create individual item-damaged-status',
      'description' : 'create individual item-damaged-status in storage'
    }, {
      'permissionName' : 'inventory-storage.item-damaged-statuses.item.put',
      'displayName' : 'inventory storage - modify item-damaged-status',
      'description' : 'modify item-damaged-status in storage'
    }, {
      'permissionName' : 'inventory-storage.item-damaged-statuses.item.delete',
      'displayName' : 'inventory storage - delete individual item-damaged-status',
      'description' : 'delete individual item-damaged-status from storage'
    }, {
      'permissionName' : 'inventory-storage.call-number-types.collection.get',
      'displayName' : 'inventory storage - get call-number-type collection',
      'description' : 'get call-number-type collection from storage'
    }, {
      'permissionName' : 'inventory-storage.call-number-types.item.get',
      'displayName' : 'inventory storage - get individual call-number-type',
      'description' : 'get individual call-number-type from storage'
    }, {
      'permissionName' : 'inventory-storage.call-number-types.item.post',
      'displayName' : 'inventory storage - create individual call-number-type',
      'description' : 'create individual call-number-type in storage'
    }, {
      'permissionName' : 'inventory-storage.call-number-types.item.put',
      'displayName' : 'inventory storage - modify call-number-type',
      'description' : 'modify call-number-type in storage'
    }, {
      'permissionName' : 'inventory-storage.call-number-types.item.delete',
      'displayName' : 'inventory storage - delete individual call-number-type',
      'description' : 'delete individual call-number-type from storage'
    }, {
      'permissionName' : 'inventory-storage.hrid-settings.item.get',
      'displayName' : 'inventory storage - get HRID settings',
      'description' : 'get the HRID settings from storage'
    }, {
      'permissionName' : 'inventory-storage.hrid-settings.item.put',
      'displayName' : 'inventory storage - modify HRID settings',
      'description' : 'modify the HRID settings in storage'
    }, {
      'permissionName' : 'inventory-storage.all',
      'displayName' : 'inventory storage module - all permissions',
      'description' : 'Entire set of permissions needed to use the inventory storage module',
      'subPermissions' : ['inventory-storage.items.collection.get', 'inventory-storage.items.item.get', 'inventory-storage.items.item.post', 'inventory-storage.items.item.put', 'inventory-storage.items.item.delete', 'inventory-storage.items.collection.delete', 'inventory-storage.items.batch.post', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.get', 'inventory-storage.holdings.item.post', 'inventory-storage.holdings.item.put', 'inventory-storage.holdings.item.delete', 'inventory-storage.holdings.collection.delete', 'inventory-storage.holdings.batch.post', 'inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.instances.item.post', 'inventory-storage.instances.item.put', 'inventory-storage.instances.item.delete', 'inventory-storage.instances.source-record.delete', 'inventory-storage.instances.source-record.marc-json.get', 'inventory-storage.instances.source-record.marc-json.put', 'inventory-storage.instances.source-record.marc-json.delete', 'inventory-storage.instances.collection.delete', 'inventory-storage.instances.batch.post', 'inventory-storage.loan-types.collection.get', 'inventory-storage.loan-types.item.get', 'inventory-storage.loan-types.item.post', 'inventory-storage.loan-types.item.put', 'inventory-storage.loan-types.item.delete', 'inventory-storage.material-types.collection.get', 'inventory-storage.material-types.item.get', 'inventory-storage.material-types.item.post', 'inventory-storage.material-types.item.put', 'inventory-storage.material-types.item.delete', 'inventory-storage.shelf-locations.collection.get', 'inventory-storage.shelf-locations.item.get', 'inventory-storage.shelf-locations.item.post', 'inventory-storage.shelf-locations.item.put', 'inventory-storage.shelf-locations.item.delete', 'inventory-storage.location-units.institutions.collection.get', 'inventory-storage.location-units.institutions.item.get', 'inventory-storage.location-units.institutions.item.post', 'inventory-storage.location-units.institutions.item.put', 'inventory-storage.location-units.institutions.item.delete', 'inventory-storage.location-units.campuses.collection.get', 'inventory-storage.location-units.campuses.item.get', 'inventory-storage.location-units.campuses.item.post', 'inventory-storage.location-units.campuses.item.put', 'inventory-storage.location-units.campuses.item.delete', 'inventory-storage.location-units.libraries.collection.get', 'inventory-storage.location-units.libraries.item.get', 'inventory-storage.location-units.libraries.item.post', 'inventory-storage.location-units.libraries.item.put', 'inventory-storage.location-units.libraries.item.delete', 'inventory-storage.locations.collection.get', 'inventory-storage.locations.item.get', 'inventory-storage.locations.item.post', 'inventory-storage.locations.item.put', 'inventory-storage.locations.item.delete', 'inventory-storage.instance-relationship-types.collection.get', 'inventory-storage.instance-relationship-types.item.get', 'inventory-storage.instance-relationship-types.item.post', 'inventory-storage.instance-relationship-types.item.put', 'inventory-storage.instance-relationship-types.item.delete', 'inventory-storage.identifier-types.collection.get', 'inventory-storage.identifier-types.item.get', 'inventory-storage.identifier-types.item.post', 'inventory-storage.identifier-types.item.put', 'inventory-storage.identifier-types.item.delete', 'inventory-storage.contributor-types.collection.get', 'inventory-storage.contributor-types.item.get', 'inventory-storage.contributor-types.item.post', 'inventory-storage.contributor-types.item.put', 'inventory-storage.contributor-types.item.delete', 'inventory-storage.contributor-name-types.collection.get', 'inventory-storage.contributor-name-types.item.get', 'inventory-storage.contributor-name-types.item.post', 'inventory-storage.contributor-name-types.item.put', 'inventory-storage.contributor-name-types.item.delete', 'inventory-storage.instance-formats.collection.get', 'inventory-storage.instance-formats.item.get', 'inventory-storage.instance-formats.item.post', 'inventory-storage.instance-formats.item.put', 'inventory-storage.instance-formats.item.delete', 'inventory-storage.instance-types.collection.get', 'inventory-storage.instance-types.item.get', 'inventory-storage.instance-types.item.post', 'inventory-storage.instance-types.item.put', 'inventory-storage.instance-types.item.delete', 'inventory-storage.nature-of-content-terms.collection.get', 'inventory-storage.nature-of-content-terms.item.get', 'inventory-storage.nature-of-content-terms.item.post', 'inventory-storage.nature-of-content-terms.item.put', 'inventory-storage.nature-of-content-terms.item.delete', 'inventory-storage.classification-types.collection.get', 'inventory-storage.classification-types.item.get', 'inventory-storage.classification-types.item.post', 'inventory-storage.classification-types.item.put', 'inventory-storage.classification-types.item.delete', 'inventory-storage.alternative-title-types.collection.get', 'inventory-storage.alternative-title-types.item.get', 'inventory-storage.alternative-title-types.item.post', 'inventory-storage.alternative-title-types.item.put', 'inventory-storage.alternative-title-types.item.delete', 'inventory-storage.modes-of-issuance.collection.get', 'inventory-storage.modes-of-issuance.item.get', 'inventory-storage.modes-of-issuance.item.post', 'inventory-storage.modes-of-issuance.item.put', 'inventory-storage.modes-of-issuance.item.delete', 'inventory-storage.instance-statuses.collection.get', 'inventory-storage.instance-statuses.item.get', 'inventory-storage.instance-statuses.item.post', 'inventory-storage.instance-statuses.item.put', 'inventory-storage.instance-statuses.item.delete', 'inventory-storage.electronic-access-relationships.collection.get', 'inventory-storage.electronic-access-relationships.item.get', 'inventory-storage.electronic-access-relationships.item.post', 'inventory-storage.electronic-access-relationships.item.put', 'inventory-storage.electronic-access-relationships.item.delete', 'inventory-storage.statistical-code-types.collection.get', 'inventory-storage.statistical-code-types.item.get', 'inventory-storage.statistical-code-types.item.post', 'inventory-storage.statistical-code-types.item.put', 'inventory-storage.statistical-code-types.item.delete', 'inventory-storage.statistical-codes.collection.get', 'inventory-storage.statistical-codes.item.get', 'inventory-storage.statistical-codes.item.post', 'inventory-storage.statistical-codes.item.put', 'inventory-storage.statistical-codes.item.delete', 'inventory-storage.ill-policies.collection.get', 'inventory-storage.ill-policies.item.get', 'inventory-storage.ill-policies.item.post', 'inventory-storage.ill-policies.item.put', 'inventory-storage.ill-policies.item.delete', 'inventory-storage.holdings-types.collection.get', 'inventory-storage.holdings-types.item.get', 'inventory-storage.holdings-types.item.post', 'inventory-storage.holdings-types.item.put', 'inventory-storage.holdings-types.item.delete', 'inventory-storage.call-number-types.collection.get', 'inventory-storage.call-number-types.item.get', 'inventory-storage.call-number-types.item.post', 'inventory-storage.call-number-types.item.put', 'inventory-storage.call-number-types.item.delete', 'inventory-storage.instance-note-types.collection.get', 'inventory-storage.instance-note-types.item.get', 'inventory-storage.instance-note-types.item.post', 'inventory-storage.instance-note-types.item.put', 'inventory-storage.instance-note-types.item.delete', 'inventory-storage.holdings-note-types.collection.get', 'inventory-storage.holdings-note-types.item.get', 'inventory-storage.holdings-note-types.item.post', 'inventory-storage.holdings-note-types.item.put', 'inventory-storage.holdings-note-types.item.delete', 'inventory-storage.item-note-types.collection.get', 'inventory-storage.item-note-types.item.get', 'inventory-storage.item-note-types.item.post', 'inventory-storage.item-note-types.item.put', 'inventory-storage.item-note-types.item.delete', 'inventory-storage.item-damaged-statuses.collection.get', 'inventory-storage.item-damaged-statuses.item.get', 'inventory-storage.item-damaged-statuses.item.post', 'inventory-storage.item-damaged-statuses.item.put', 'inventory-storage.item-damaged-statuses.item.delete', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get', 'inventory-storage.service-points.item.post', 'inventory-storage.service-points.item.put', 'inventory-storage.service-points.item.delete', 'inventory-storage.service-points-users.collection.get', 'inventory-storage.service-points-users.item.get', 'inventory-storage.service-points-users.item.post', 'inventory-storage.service-points-users.item.put', 'inventory-storage.service-points-users.item.delete', 'inventory-storage.hrid-settings.item.get', 'inventory-storage.hrid-settings.item.put']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-inventory-storage:19.0.0-SNAPSHOT.381',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 715827883
        }
      }
    }
  }, {
    'id' : 'mod-invoice-3.1.0-SNAPSHOT.87',
    'name' : 'Invoice business logic module',
    'requires' : [{
      'id' : 'configuration',
      'version' : '2.0'
    }, {
      'id' : 'finance.funds',
      'version' : '1.0'
    }, {
      'id' : 'invoice-storage.invoices',
      'version' : '3.1'
    }, {
      'id' : 'invoice-storage.invoice-lines',
      'version' : '2.0'
    }, {
      'id' : 'invoice-storage.invoice-line-number',
      'version' : '1.0'
    }, {
      'id' : 'order-lines',
      'version' : '1.0'
    }, {
      'id' : 'voucher-storage.vouchers',
      'version' : '1.1'
    }, {
      'id' : 'voucher-storage.voucher-lines',
      'version' : '2.0'
    }, {
      'id' : 'voucher-storage.voucher-number',
      'version' : '1.0'
    }, {
      'id' : 'acquisitions-units',
      'version' : '1.1'
    }],
    'provides' : [{
      'id' : 'invoice',
      'version' : '3.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/invoice/invoices',
        'permissionsRequired' : ['invoice.invoices.collection.get'],
        'modulePermissions' : ['invoice-storage.invoices.collection.get', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/invoice/invoices',
        'permissionsRequired' : ['invoice.invoices.item.post'],
        'permissionsDesired' : ['invoices.acquisitions-units-assignments.assign'],
        'modulePermissions' : ['invoice-storage.invoices.item.post', 'invoice-storage.invoice-number.get', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice/invoices/{id}',
        'permissionsRequired' : ['invoice.invoices.item.get'],
        'modulePermissions' : ['invoice-storage.invoices.item.get', 'invoice-storage.invoices.item.put', 'invoice-storage.invoice-lines.collection.get', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/invoice/invoices/{id}',
        'permissionsRequired' : ['invoice.invoices.item.put'],
        'permissionsDesired' : ['invoices.acquisitions-units-assignments.manage'],
        'modulePermissions' : ['configuration.entries.collection.get', 'invoice-storage.invoices.item.put', 'invoice-storage.invoices.item.get', 'invoice-storage.invoice-lines.item.put', 'invoice-storage.invoice-lines.collection.get', 'finance.funds.collection.get', 'orders.po-lines.item.put', 'orders.po-lines.item.get', 'voucher-storage.vouchers.collection.get', 'voucher-storage.vouchers.item.post', 'voucher-storage.vouchers.item.put', 'voucher-storage.voucher-lines.collection.get', 'voucher-storage.voucher-lines.item.post', 'voucher-storage.voucher-lines.item.delete', 'voucher-storage.voucher-number.get', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/invoice/invoices/{id}',
        'permissionsRequired' : ['invoice.invoices.item.delete'],
        'modulePermissions' : ['invoice-storage.invoices.item.get', 'invoice-storage.invoices.item.delete', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice/invoice-lines',
        'permissionsRequired' : ['invoice.invoice-lines.collection.get'],
        'modulePermissions' : ['invoice-storage.invoice-lines.collection.get', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/invoice/invoice-lines',
        'permissionsRequired' : ['invoice.invoice-lines.item.post'],
        'modulePermissions' : ['invoice-storage.invoice-line-number.get', 'invoice-storage.invoices.item.get', 'invoice-storage.invoices.item.put', 'invoice-storage.invoice-lines.item.post', 'invoice-storage.invoice-lines.item.put', 'invoice-storage.invoice-lines.collection.get', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice/invoice-lines/{id}',
        'permissionsRequired' : ['invoice.invoice-lines.item.get'],
        'modulePermissions' : ['invoice-storage.invoice-lines.item.get', 'invoice-storage.invoice-lines.item.put', 'invoice-storage.invoice-lines.collection.get', 'invoice-storage.invoices.item.get', 'invoice-storage.invoices.item.put', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/invoice/invoice-lines/{id}',
        'permissionsRequired' : ['invoice.invoice-lines.item.put'],
        'modulePermissions' : ['invoice-storage.invoice-lines.item.put', 'invoice-storage.invoice-lines.item.get', 'invoice-storage.invoice-lines.collection.get', 'invoice-storage.invoices.item.get', 'invoice-storage.invoices.item.put', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/invoice/invoice-lines/{id}',
        'permissionsRequired' : ['invoice.invoice-lines.item.delete'],
        'modulePermissions' : ['invoice-storage.invoice-lines.item.get', 'invoice-storage.invoice-lines.item.delete', 'invoice-storage.invoice-lines.item.put', 'invoice-storage.invoice-lines.collection.get', 'invoice-storage.invoices.item.get', 'invoice-storage.invoices.item.put', 'invoice-storage.invoices.collection.get', 'acquisitions-units.units.collection.get', 'acquisitions-units.memberships.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice/invoice-number',
        'permissionsRequired' : ['invoice.invoice-number.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice/invoices/{id}/documents',
        'permissionsRequired' : ['invoice.invoices.documents.collection.get'],
        'modulePermissions' : ['invoice-storage.invoices.documents.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/invoice/invoices/{id}/documents',
        'permissionsRequired' : ['invoice.invoices.documents.item.post'],
        'modulePermissions' : ['invoice-storage.invoices.documents.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice/invoices/{id}/documents/{documentId}',
        'permissionsRequired' : ['invoice.invoices.documents.item.get'],
        'modulePermissions' : ['invoice-storage.invoices.documents.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/invoice/invoices/{id}/documents/{documentId}',
        'permissionsRequired' : ['invoice.invoices.documents.item.delete'],
        'modulePermissions' : ['invoice-storage.invoices.documents.item.delete']
      }]
    }, {
      'id' : 'voucher',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/voucher/vouchers',
        'permissionsRequired' : ['voucher.vouchers.collection.get'],
        'modulePermissions' : ['voucher-storage.vouchers.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/voucher/vouchers/{id}',
        'permissionsRequired' : ['voucher.vouchers.item.get'],
        'modulePermissions' : ['voucher-storage.vouchers.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/voucher/voucher-lines',
        'permissionsRequired' : ['voucher.voucher-lines.collection.get'],
        'modulePermissions' : ['voucher-storage.voucher-lines.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/voucher/voucher-lines/{id}',
        'permissionsRequired' : ['voucher.voucher-lines.item.get'],
        'modulePermissions' : ['voucher-storage.voucher-lines.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/voucher/voucher-lines/{id}',
        'permissionsRequired' : ['voucher.voucher-lines.item.put'],
        'modulePermissions' : ['voucher-storage.voucher-lines.item.put']
      }]
    }, {
      'id' : 'voucher-number',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/voucher/voucher-number/start/{value}',
        'permissionsRequired' : ['voucher-number.start.post'],
        'modulePermissions' : ['voucher-storage.voucher-number.start.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/voucher/voucher-number/start',
        'permissionsRequired' : ['voucher-number.start.get'],
        'modulePermissions' : ['voucher-storage.voucher-number.start.get']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'invoice.invoices.collection.get',
      'displayName' : 'Invoice - get collection of Invoice',
      'description' : 'Get collection of Invoice'
    }, {
      'permissionName' : 'invoice.invoices.item.get',
      'displayName' : 'Invoice - get an existing Invoice',
      'description' : 'Get an existing Invoice'
    }, {
      'permissionName' : 'invoice.invoices.item.post',
      'displayName' : 'Invoice - create a new Invoice',
      'description' : 'Create a new invoice'
    }, {
      'permissionName' : 'invoice.invoices.item.put',
      'displayName' : 'Invoice - modify invoice',
      'description' : 'Modify an existing Invoice'
    }, {
      'permissionName' : 'invoice.invoices.item.delete',
      'displayName' : 'Invoice - delete an existing Invoice',
      'description' : 'Delete an existing Invoice'
    }, {
      'permissionName' : 'invoice.invoice-lines.collection.get',
      'displayName' : 'Invoice Line - get collection of Invoice lines',
      'description' : 'Get collection of Invoice lines'
    }, {
      'permissionName' : 'invoice.invoice-lines.item.get',
      'displayName' : 'Invoice - get an existing Invoice line',
      'description' : 'Get an existing Invoice line'
    }, {
      'permissionName' : 'invoice.invoice-lines.item.post',
      'displayName' : 'Invoice - create a new Invoice line',
      'description' : 'Create a new Invoice line'
    }, {
      'permissionName' : 'invoice.invoice-lines.item.put',
      'displayName' : 'Invoice - modify an existing Invoice line',
      'description' : 'Modify an existing Invoice line'
    }, {
      'permissionName' : 'invoice.invoice-lines.item.delete',
      'displayName' : 'Invoice - delete an existing Invoice line',
      'description' : 'Delete an existing Invoice line'
    }, {
      'permissionName' : 'invoice.invoice-number.item.get',
      'displayName' : 'Invoice - generate a Invoice Number',
      'description' : 'Generate a Invoice Number'
    }, {
      'permissionName' : 'voucher.vouchers.collection.get',
      'displayName' : 'Voucher - get collection of Voucher',
      'description' : 'Get collection of Voucher'
    }, {
      'permissionName' : 'voucher.vouchers.item.get',
      'displayName' : 'Voucher - get an existing Voucher',
      'description' : 'Get an existing Voucher'
    }, {
      'permissionName' : 'voucher.voucher-lines.collection.get',
      'displayName' : 'Voucher - get collection of lines',
      'description' : 'Get collection of Voucher lines'
    }, {
      'permissionName' : 'voucher.voucher-lines.item.get',
      'displayName' : 'Voucher - get an existing Voucher line',
      'description' : 'Get an existing Voucher line'
    }, {
      'permissionName' : 'voucher.voucher-lines.item.put',
      'displayName' : 'Voucher - modify an existing Voucher line',
      'description' : 'Modify an existing Voucher line'
    }, {
      'permissionName' : 'voucher-number.start.post',
      'displayName' : 'Post voucher number sequence start value',
      'description' : 'Voucher number sequence - re(set) the start value of the sequence'
    }, {
      'permissionName' : 'voucher-number.start.get',
      'displayName' : 'Get voucher number sequence start value',
      'description' : 'Voucher number sequence - get the start value of the sequence'
    }, {
      'permissionName' : 'voucher.all',
      'displayName' : 'Invoice module - all Voucher permissions',
      'description' : 'Entire set of permissions needed to use Vouchers',
      'subPermissions' : ['voucher.vouchers.collection.get', 'voucher.vouchers.item.get', 'voucher.voucher-lines.collection.get', 'voucher.voucher-lines.item.get', 'voucher.voucher-lines.item.put'],
      'visible' : false
    }, {
      'permissionName' : 'invoice.invoices.documents.collection.get',
      'displayName' : 'Document - get collection of Documents',
      'description' : 'Get collection of Documents'
    }, {
      'permissionName' : 'invoice.invoices.documents.item.post',
      'displayName' : 'Document - create Document',
      'description' : 'Create new Document'
    }, {
      'permissionName' : 'invoice.invoices.documents.item.get',
      'displayName' : 'Document - get an existing Document',
      'description' : 'Get an existing Document'
    }, {
      'permissionName' : 'invoice.invoices.documents.item.delete',
      'displayName' : 'Document - modify an existing Document',
      'description' : 'Modify an existing Document'
    }, {
      'permissionName' : 'invoice.invoices.documents.all',
      'displayName' : 'All documents perms',
      'description' : 'All permissions for the documents',
      'subPermissions' : ['invoice.invoices.documents.collection.get', 'invoice.invoices.documents.item.post', 'invoice.invoices.documents.item.get', 'invoice.invoices.documents.item.delete']
    }, {
      'permissionName' : 'invoices.acquisitions-units-assignments.assign',
      'displayName' : 'Acquisitions unit assignment - create unit assignment',
      'description' : 'Assign new invoice to acquisitions units'
    }, {
      'permissionName' : 'invoices.acquisitions-units-assignments.manage',
      'displayName' : 'Acquisitions units assignment - manage unit assignments',
      'description' : 'Manage unit assignments during invoice update'
    }, {
      'permissionName' : 'invoices.acquisitions-units-assignments.all',
      'displayName' : 'All invoice acquisitions-unit-assignments permissions',
      'description' : 'All permissions for the acquisitions-unit-assignments',
      'subPermissions' : ['invoices.acquisitions-units-assignments.assign', 'invoices.acquisitions-units-assignments.manage']
    }, {
      'permissionName' : 'invoice.all',
      'displayName' : 'Invoice module - all permissions',
      'description' : 'Entire set of permissions needed to use the invoice module',
      'subPermissions' : ['invoice.invoices.collection.get', 'invoice.invoices.item.get', 'invoice.invoices.item.post', 'invoice.invoices.item.put', 'invoice.invoices.item.delete', 'invoice.invoice-lines.collection.get', 'invoice.invoice-lines.item.get', 'invoice.invoice-lines.item.post', 'invoice.invoice-lines.item.put', 'invoice.invoice-lines.item.delete', 'invoice.invoice-number.item.get', 'invoice.invoice-number.item.post', 'voucher-number.start.post', 'voucher-number.start.get', 'voucher.all', 'invoice.invoices.documents.all', 'invoices.acquisitions-units-assignments.all'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-invoice:3.1.0-SNAPSHOT.87',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-invoice-storage-3.1.0-SNAPSHOT.47',
    'name' : 'Invoice CRUD module',
    'provides' : [{
      'id' : 'invoice-storage.invoices',
      'version' : '3.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoices',
        'permissionsRequired' : ['invoice-storage.invoices.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/invoice-storage/invoices',
        'permissionsRequired' : ['invoice-storage.invoices.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoices/{id}',
        'permissionsRequired' : ['invoice-storage.invoices.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/invoice-storage/invoices/{id}',
        'permissionsRequired' : ['invoice-storage.invoices.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/invoice-storage/invoices/{id}',
        'permissionsRequired' : ['invoice-storage.invoices.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoices/{id}/documents',
        'permissionsRequired' : ['invoice-storage.invoices.documents.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/invoice-storage/invoices/{id}/documents',
        'permissionsRequired' : ['invoice-storage.invoices.documents.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoices/{id}/documents/{documentId}',
        'permissionsRequired' : ['invoice-storage.invoices.documents.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/invoice-storage/invoices/{id}/documents/{documentId}',
        'permissionsRequired' : ['invoice-storage.invoices.documents.item.delete']
      }]
    }, {
      'id' : 'invoice-storage.invoice-lines',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoice-lines',
        'permissionsRequired' : ['invoice-storage.invoice-lines.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/invoice-storage/invoice-lines',
        'permissionsRequired' : ['invoice-storage.invoice-lines.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoice-lines/{id}',
        'permissionsRequired' : ['invoice-storage.invoice-lines.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/invoice-storage/invoice-lines/{id}',
        'permissionsRequired' : ['invoice-storage.invoice-lines.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/invoice-storage/invoice-lines/{id}',
        'permissionsRequired' : ['invoice-storage.invoice-lines.item.delete']
      }]
    }, {
      'id' : 'invoice-storage.invoice-number',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoice-number',
        'permissionsRequired' : ['invoice-storage.invoice-number.get']
      }]
    }, {
      'id' : 'invoice-storage.invoice-line-number',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/invoice-storage/invoice-line-number',
        'permissionsRequired' : ['invoice-storage.invoice-line-number.get']
      }]
    }, {
      'id' : 'voucher-storage.vouchers',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/voucher-storage/vouchers',
        'permissionsRequired' : ['voucher-storage.vouchers.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/voucher-storage/vouchers',
        'permissionsRequired' : ['voucher-storage.vouchers.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/voucher-storage/vouchers/{id}',
        'permissionsRequired' : ['voucher-storage.vouchers.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/voucher-storage/vouchers/{id}',
        'permissionsRequired' : ['voucher-storage.vouchers.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/voucher-storage/vouchers/{id}',
        'permissionsRequired' : ['voucher-storage.vouchers.item.delete']
      }]
    }, {
      'id' : 'voucher-storage.voucher-lines',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/voucher-storage/voucher-lines',
        'permissionsRequired' : ['voucher-storage.voucher-lines.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/voucher-storage/voucher-lines',
        'permissionsRequired' : ['voucher-storage.voucher-lines.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/voucher-storage/voucher-lines/{id}',
        'permissionsRequired' : ['voucher-storage.voucher-lines.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/voucher-storage/voucher-lines/{id}',
        'permissionsRequired' : ['voucher-storage.voucher-lines.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/voucher-storage/voucher-lines/{id}',
        'permissionsRequired' : ['voucher-storage.voucher-lines.item.delete']
      }]
    }, {
      'id' : 'voucher-storage.voucher-number',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/voucher-storage/voucher-number',
        'permissionsRequired' : ['voucher-storage.voucher-number.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/voucher-storage/voucher-number/start',
        'permissionsRequired' : ['voucher-storage.voucher-number.start.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/voucher-storage/voucher-number/start/{value}',
        'permissionsRequired' : ['voucher-storage.voucher-number.start.post']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'invoice-storage.invoices.collection.get',
      'displayName' : 'Invoice storage - get invoice collection',
      'description' : 'Get invoice collection'
    }, {
      'permissionName' : 'invoice-storage.invoices.item.get',
      'displayName' : 'Invoice storage - get individual invoice',
      'description' : 'Get individual invoice'
    }, {
      'permissionName' : 'invoice-storage.invoices.item.post',
      'displayName' : 'Invoice storage - create invoice',
      'description' : 'Create invoice'
    }, {
      'permissionName' : 'invoice-storage.invoices.item.put',
      'displayName' : 'Invoice storage - modify invoice',
      'description' : 'Modify invoice'
    }, {
      'permissionName' : 'invoice-storage.invoices.item.delete',
      'displayName' : 'Invoice storage - delete invoice',
      'description' : 'Delete invoice'
    }, {
      'permissionName' : 'invoice-storage.invoices.documents.collection.get',
      'displayName' : 'Invoice storage - get document collection',
      'description' : 'Get documents collection'
    }, {
      'permissionName' : 'invoice-storage.invoices.documents.item.get',
      'displayName' : 'Invoice storage - get individual document',
      'description' : 'Get individual document'
    }, {
      'permissionName' : 'invoice-storage.invoices.documents.item.post',
      'displayName' : 'Invoice storage - create document',
      'description' : 'Create document'
    }, {
      'permissionName' : 'invoice-storage.invoices.documents.item.delete',
      'displayName' : 'Invoice storage - delete document',
      'description' : 'Delete document'
    }, {
      'permissionName' : 'invoice-storage.invoice-lines.collection.get',
      'displayName' : 'Invoice storage - get invoice line collection',
      'description' : 'Get invoice line collection'
    }, {
      'permissionName' : 'invoice-storage.invoice-lines.item.get',
      'displayName' : 'Invoice storage - get individual invoice line',
      'description' : 'Get individual invoice line'
    }, {
      'permissionName' : 'invoice-storage.invoice-lines.item.post',
      'displayName' : 'Invoice storage - create invoice line',
      'description' : 'Create invoice line'
    }, {
      'permissionName' : 'invoice-storage.invoice-lines.item.put',
      'displayName' : 'Invoice storage - modify invoice line',
      'description' : 'Modify invoice line'
    }, {
      'permissionName' : 'invoice-storage.invoice-lines.item.delete',
      'displayName' : 'Invoice storage - delete invoice line',
      'description' : 'Delete invoice line'
    }, {
      'permissionName' : 'invoice-storage.invoice-number.get',
      'displayName' : 'Invoice storage - generate invoice number',
      'description' : 'Get invoice number'
    }, {
      'permissionName' : 'invoice-storage.invoice-line-number.get',
      'displayName' : 'Invoice storage - generate invoice line number',
      'description' : 'Get invoice line number'
    }, {
      'permissionName' : 'voucher-storage.vouchers.collection.get',
      'displayName' : 'Voucher storage - get voucher collection',
      'description' : 'Get voucher collection'
    }, {
      'permissionName' : 'voucher-storage.vouchers.item.get',
      'displayName' : 'voucher storage - get individual voucher',
      'description' : 'Get individual voucher'
    }, {
      'permissionName' : 'voucher-storage.vouchers.item.post',
      'displayName' : 'voucher storage - create voucher',
      'description' : 'Create voucher'
    }, {
      'permissionName' : 'voucher-storage.vouchers.item.put',
      'displayName' : 'Voucher storage - modify voucher',
      'description' : 'Modify voucher'
    }, {
      'permissionName' : 'voucher-storage.vouchers.item.delete',
      'displayName' : 'Voucher storage - delete voucher',
      'description' : 'Delete voucher'
    }, {
      'permissionName' : 'voucher-storage.voucher-number.get',
      'displayName' : 'Voucher storage - generate voucher number',
      'description' : 'Get voucher number'
    }, {
      'permissionName' : 'voucher-storage.voucher-number.start.get',
      'displayName' : 'Voucher storage - get current start value of the voucher number',
      'description' : 'Get current start value of the voucher number'
    }, {
      'permissionName' : 'voucher-storage.voucher-number.start.post',
      'displayName' : 'Voucher storage - (Re)set the start value of the voucher number sequence',
      'description' : 'Post voucher number start value'
    }, {
      'permissionName' : 'voucher-storage.voucher-lines.collection.get',
      'displayName' : 'Voucher storage - get voucher line collection',
      'description' : 'Get voucher line collection'
    }, {
      'permissionName' : 'voucher-storage.voucher-lines.item.get',
      'displayName' : 'Voucher storage - get individual voucher line',
      'description' : 'Get individual voucher line'
    }, {
      'permissionName' : 'voucher-storage.voucher-lines.item.post',
      'displayName' : 'Voucher storage - create voucher line',
      'description' : 'Create voucher line'
    }, {
      'permissionName' : 'voucher-storage.voucher-lines.item.put',
      'displayName' : 'Voucher storage - modify voucher line',
      'description' : 'Modify voucher line'
    }, {
      'permissionName' : 'voucher-storage.voucher-lines.item.delete',
      'displayName' : 'Voucher storage - delete voucher line',
      'description' : 'Delete voucher line'
    }, {
      'permissionName' : 'voucher-storage.module.all',
      'displayName' : 'Voucher storage - all permissions',
      'description' : 'Entire set of permissions needed to use vouchers',
      'subPermissions' : ['voucher-storage.vouchers.collection.get', 'voucher-storage.vouchers.item.get', 'voucher-storage.vouchers.item.post', 'voucher-storage.vouchers.item.put', 'voucher-storage.vouchers.item.delete', 'voucher-storage.voucher-number.get', 'voucher-storage.voucher-number.start.get', 'voucher-storage.voucher-number.start.post', 'voucher-storage.voucher-lines.collection.get', 'voucher-storage.voucher-lines.item.get', 'voucher-storage.voucher-lines.item.post', 'voucher-storage.voucher-lines.item.put', 'voucher-storage.voucher-lines.item.delete'],
      'visible' : false
    }, {
      'permissionName' : 'invoice-storage.module.all',
      'displayName' : 'Invoice storage module - all permissions',
      'description' : 'Entire set of permissions needed to use the invoice module',
      'subPermissions' : ['invoice-storage.invoices.collection.get', 'invoice-storage.invoices.item.get', 'invoice-storage.invoices.item.post', 'invoice-storage.invoices.item.put', 'invoice-storage.invoices.item.delete', 'invoice-storage.invoices.documents.collection.get', 'invoice-storage.invoices.documents.item.get', 'invoice-storage.invoices.documents.item.post', 'invoice-storage.invoices.documents.item.delete', 'invoice-storage.invoice-lines.collection.get', 'invoice-storage.invoice-lines.item.get', 'invoice-storage.invoice-lines.item.post', 'invoice-storage.invoice-lines.item.put', 'invoice-storage.invoice-lines.item.delete', 'invoice-storage.invoice-number.get', 'invoice-storage.invoice-line-number.get', 'voucher-storage.module.all'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-invoice-storage:3.1.0-SNAPSHOT.47',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-kb-ebsco-java-3.1.1-SNAPSHOT.184',
    'name' : 'kb-ebsco',
    'requires' : [{
      'id' : 'configuration',
      'version' : '2.0'
    }],
    'provides' : [{
      'id' : 'eholdings',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/packages',
        'permissionsRequired' : ['kb-ebsco.packages.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/eholdings/packages',
        'permissionsRequired' : ['kb-ebsco.packages.collection.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/packages/{packageId}',
        'permissionsRequired' : ['kb-ebsco.packages.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/packages/{packageId}',
        'permissionsRequired' : ['kb-ebsco.packages.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/eholdings/packages/{packageId}',
        'permissionsRequired' : ['kb-ebsco.packages.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/packages/{packageId}/resources',
        'permissionsRequired' : ['kb-ebsco.package-resources.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/packages/{packageId}/tags',
        'permissionsRequired' : ['kb-ebsco.package-tags.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/providers',
        'permissionsRequired' : ['kb-ebsco.providers.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/providers/{providerId}',
        'permissionsRequired' : ['kb-ebsco.providers.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/providers/{providerId}',
        'permissionsRequired' : ['kb-ebsco.providers.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/providers/{providerId}/packages',
        'permissionsRequired' : ['kb-ebsco.provider-packages.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/providers/{providerId}/tags',
        'permissionsRequired' : ['kb-ebsco.provider-tags.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/eholdings/resources',
        'permissionsRequired' : ['kb-ebsco.resources.collection.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/resources/{resourceId}',
        'permissionsRequired' : ['kb-ebsco.resources.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/resources/{resourceId}',
        'permissionsRequired' : ['kb-ebsco.resources.item.put']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/resources/{resourceId}/tags',
        'permissionsRequired' : ['kb-ebsco.resource-tags.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/eholdings/resources/{resourceId}',
        'permissionsRequired' : ['kb-ebsco.resources.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/titles',
        'permissionsRequired' : ['kb-ebsco.titles.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/eholdings/titles',
        'permissionsRequired' : ['kb-ebsco.titles.collection.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/titles/{titleId}',
        'permissionsRequired' : ['kb-ebsco.titles.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/titles/{titleId}',
        'permissionsRequired' : ['kb-ebsco.titles.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/proxy-types',
        'permissionsRequired' : ['kb-ebsco.proxy-types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/root-proxy',
        'permissionsRequired' : ['kb-ebsco.root-proxy.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/root-proxy',
        'permissionsRequired' : ['kb-ebsco.root-proxy.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/configuration',
        'permissionsRequired' : ['kb-ebsco.configuration.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/configuration',
        'permissionsRequired' : ['kb-ebsco.configuration.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/status',
        'permissionsRequired' : ['kb-ebsco.status.get'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/eholdings/cache',
        'permissionsRequired' : ['kb-ebsco.cache.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/tags',
        'permissionsRequired' : ['kb-ebsco.tags.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/tags/summary',
        'permissionsRequired' : ['kb-ebsco.unique.tags.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/loadHoldings',
        'permissionsRequired' : ['kb-ebsco.holdings.load.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/loadHoldings/status',
        'permissionsRequired' : ['kb-ebsco.holdings.load.status.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/eholdings/custom-labels',
        'permissionsRequired' : ['kb-ebsco.custom-labels.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/eholdings/custom-labels',
        'permissionsRequired' : ['kb-ebsco.custom-labels.collection.put']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }, {
      'id' : '_ramls',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/ramls'
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }, {
      'id' : '_timer',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/loadHoldings',
        'unit' : 'day',
        'delay' : '5',
        'modulePermissions' : ['configuration.entries.collection.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'kb-ebsco.configuration.get',
      'displayName' : 'get RM API configuration',
      'description' : 'Get RM API configuration'
    }, {
      'permissionName' : 'kb-ebsco.configuration.put',
      'displayName' : 'put RM API configuration',
      'description' : 'Put RM API configuration'
    }, {
      'permissionName' : 'kb-ebsco.status.get',
      'displayName' : 'get RM API configuration status',
      'description' : 'Get RM API configuration status'
    }, {
      'permissionName' : 'kb-ebsco.cache.delete',
      'displayName' : 'delete RM API configuration cache',
      'description' : 'Delete RM API configuration cache'
    }, {
      'permissionName' : 'kb-ebsco.providers.collection.get',
      'displayName' : 'get providers',
      'description' : 'Get providers'
    }, {
      'permissionName' : 'kb-ebsco.providers.item.get',
      'displayName' : 'get single provider',
      'description' : 'Get single provider'
    }, {
      'permissionName' : 'kb-ebsco.providers.item.put',
      'displayName' : 'put single provider',
      'description' : 'Put single provider'
    }, {
      'permissionName' : 'kb-ebsco.provider-tags.put',
      'displayName' : 'update tags for a single provider',
      'description' : 'Update tags for a single provider'
    }, {
      'permissionName' : 'kb-ebsco.provider-packages.collection.get',
      'displayName' : 'get packages for a single provider',
      'description' : 'get packages for a single provider'
    }, {
      'permissionName' : 'kb-ebsco.titles.item.get',
      'displayName' : 'get single title',
      'description' : 'Get single title'
    }, {
      'permissionName' : 'kb-ebsco.titles.collection.get',
      'displayName' : 'get titles',
      'description' : 'Get titles'
    }, {
      'permissionName' : 'kb-ebsco.titles.collection.post',
      'displayName' : 'post title',
      'description' : 'Post title'
    }, {
      'permissionName' : 'kb-ebsco.titles.item.put',
      'displayName' : 'put single title',
      'description' : 'Put single title'
    }, {
      'permissionName' : 'kb-ebsco.resources.item.get',
      'displayName' : 'get single resource',
      'description' : 'Get single resource'
    }, {
      'permissionName' : 'kb-ebsco.resources.collection.post',
      'displayName' : 'post resource',
      'description' : 'Post resource'
    }, {
      'permissionName' : 'kb-ebsco.resources.item.put',
      'displayName' : 'put single resource',
      'description' : 'Put single resource'
    }, {
      'permissionName' : 'kb-ebsco.resources.item.delete',
      'displayName' : 'delete single resource',
      'description' : 'Delete single resource'
    }, {
      'permissionName' : 'kb-ebsco.resource-tags.put',
      'displayName' : 'put tags to a single resource',
      'description' : 'Put tags to a single resource'
    }, {
      'permissionName' : 'kb-ebsco.packages.collection.get',
      'displayName' : 'get packages',
      'description' : 'Get packages'
    }, {
      'permissionName' : 'kb-ebsco.packages.item.get',
      'displayName' : 'get package',
      'description' : 'Get package'
    }, {
      'permissionName' : 'kb-ebsco.packages.collection.post',
      'displayName' : 'post package',
      'description' : 'Post package'
    }, {
      'permissionName' : 'kb-ebsco.packages.item.put',
      'displayName' : 'put package',
      'description' : 'Put package'
    }, {
      'permissionName' : 'kb-ebsco.packages.item.delete',
      'displayName' : 'delete custom package',
      'description' : 'Delete custom package'
    }, {
      'permissionName' : 'kb-ebsco.package-resources.collection.get',
      'displayName' : 'get resources for a single package',
      'description' : 'get resources for a single package'
    }, {
      'permissionName' : 'kb-ebsco.package-tags.put',
      'displayName' : 'update tags for a single package',
      'description' : 'Update tags for a single package'
    }, {
      'permissionName' : 'kb-ebsco.proxy-types.collection.get',
      'displayName' : 'get proxy types',
      'description' : 'Get proxy types'
    }, {
      'permissionName' : 'kb-ebsco.root-proxy.get',
      'displayName' : 'get root proxy',
      'description' : 'Get root proxy'
    }, {
      'permissionName' : 'kb-ebsco.root-proxy.put',
      'displayName' : 'put root proxy',
      'description' : 'Put root proxy'
    }, {
      'permissionName' : 'kb-ebsco.tags.collection.get',
      'displayName' : 'get record tags',
      'description' : 'Get record tags'
    }, {
      'permissionName' : 'kb-ebsco.unique.tags.collection.get',
      'displayName' : 'get record unique tags',
      'description' : 'Get record unique tags'
    }, {
      'permissionName' : 'kb-ebsco.holdings.load.post',
      'displayName' : 'permission to run load of holdings',
      'description' : 'One-time run load of holdings'
    }, {
      'permissionName' : 'kb-ebsco.holdings.load.status.get',
      'displayName' : 'get current status of holdings loading',
      'description' : 'Get current status of holdings loading'
    }, {
      'permissionName' : 'kb-ebsco.custom-labels.collection.get',
      'displayName' : 'get Custom Labels collection',
      'description' : 'Get Custom Labels collection'
    }, {
      'permissionName' : 'kb-ebsco.custom-labels.collection.put',
      'displayName' : 'put Custom Labels collection',
      'description' : 'Put Custom Labels collection'
    }, {
      'permissionName' : 'kb-ebsco.all',
      'displayName' : 'EBSCO KB Broker - all permissions',
      'description' : 'All permissions for EBSCO KB module',
      'subPermissions' : ['kb-ebsco.configuration.get', 'kb-ebsco.configuration.put', 'kb-ebsco.status.get', 'kb-ebsco.cache.delete', 'kb-ebsco.providers.collection.get', 'kb-ebsco.providers.item.get', 'kb-ebsco.providers.item.put', 'kb-ebsco.provider-packages.collection.get', 'kb-ebsco.provider-tags.put', 'kb-ebsco.titles.collection.get', 'kb-ebsco.titles.collection.post', 'kb-ebsco.titles.item.put', 'kb-ebsco.packages.collection.get', 'kb-ebsco.packages.collection.post', 'kb-ebsco.packages.item.delete', 'kb-ebsco.package-resources.collection.get', 'kb-ebsco.package-tags.put', 'kb-ebsco.titles.item.get', 'kb-ebsco.packages.item.get', 'kb-ebsco.packages.item.put', 'kb-ebsco.resources.item.get', 'kb-ebsco.resources.collection.post', 'kb-ebsco.resources.item.put', 'kb-ebsco.resources.item.delete', 'kb-ebsco.resource-tags.put', 'kb-ebsco.proxy-types.collection.get', 'kb-ebsco.root-proxy.get', 'kb-ebsco.root-proxy.put', 'kb-ebsco.tags.collection.get', 'kb-ebsco.unique.tags.collection.get', 'kb-ebsco.holdings.load.status.get', 'kb-ebsco.custom-labels.collection.get', 'kb-ebsco.custom-labels.collection.put']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-kb-ebsco-java:3.1.1-SNAPSHOT.184',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-licenses-2.1.0-SNAPSHOT.119',
    'name' : 'mod-licenses',
    'provides' : [{
      'id' : 'licenses',
      'version' : '2.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/licenses/licenses',
        'permissionsRequired' : ['licenses.licenses.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/licenses/{id}',
        'permissionsRequired' : ['licenses.licenses.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/licenses/{id}/linkedAgreements',
        'permissionsRequired' : ['licenses.licenses.item.linkedAgreements.get', 'licenses.agreements.linkedLicenses.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/licenses/licenses',
        'permissionsRequired' : ['licenses.licenses.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/licenses/licenses/{id}',
        'permissionsRequired' : ['licenses.licenses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/licenses/licenses/{id}',
        'permissionsRequired' : ['licenses.licenses.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/files',
        'permissionsRequired' : ['licenses.files.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/files/{id}',
        'permissionsRequired' : ['licenses.files.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/files/{id}/*',
        'permissionsRequired' : ['licenses.files.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/licenses/files',
        'permissionsRequired' : ['licenses.files.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/licenses/files/{id}',
        'permissionsRequired' : ['licenses.files.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/licenses/files/{id}',
        'permissionsRequired' : ['licenses.files.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/contacts',
        'permissionsRequired' : ['licenses.contacts.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/contacts/{id}',
        'permissionsRequired' : ['licenses.contacts.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/org',
        'permissionsRequired' : ['licenses.orgs.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/org/{id}',
        'permissionsRequired' : ['licenses.orgs.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/refdata',
        'permissionsRequired' : ['licenses.refdata.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/refdata/{domain}/{property}',
        'permissionsRequired' : ['licenses.refdata.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/refdata/{id}',
        'permissionsRequired' : ['licenses.refdata.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/licenses/refdata',
        'permissionsRequired' : ['licenses.refdata.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/licenses/refdata/{id}',
        'permissionsRequired' : ['licenses.refdata.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/licenses/refdata/{id}',
        'permissionsRequired' : ['licenses.refdata.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/custprops',
        'permissionsRequired' : ['licenses.custprops.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/custprops/{id}',
        'permissionsRequired' : ['licenses.custprops.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/licenses/custprops',
        'permissionsRequired' : ['licenses.custprops.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/licenses/custprops/{id}',
        'permissionsRequired' : ['licenses.custprops.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/licenses/custprops/{id}',
        'permissionsRequired' : ['licenses.custprops.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/licenseLinks',
        'permissionsRequired' : ['licenses.licenseLinks.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/licenses/licenseLinks/{id}',
        'permissionsRequired' : ['licenses.licenseLinks.item.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant/disable'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'licenses.licenses.view',
      'subPermissions' : ['licenses.licenses.collection.get', 'licenses.licenses.item.get', 'licenses.licenses.item.linkedAgreements.get', 'licenses.agreements.linkedLicenses.get']
    }, {
      'permissionName' : 'licenses.licenses.edit',
      'subPermissions' : ['licenses.licenses.view', 'licenses.licenses.item.post', 'licenses.licenses.item.put']
    }, {
      'permissionName' : 'licenses.licenses.manage',
      'subPermissions' : ['licenses.licenses.edit', 'licenses.licenses.item.delete']
    }, {
      'permissionName' : 'licenses.files.view',
      'subPermissions' : ['licenses.files.collection.get', 'licenses.files.item.get']
    }, {
      'permissionName' : 'licenses.files.edit',
      'subPermissions' : ['licenses.files.view', 'licenses.files.item.post', 'licenses.files.item.put']
    }, {
      'permissionName' : 'licenses.files.manage',
      'subPermissions' : ['licenses.files.edit', 'licenses.files.item.delete']
    }, {
      'permissionName' : 'licenses.contacts.view',
      'subPermissions' : ['licenses.contacts.collection.get', 'licenses.contacts.item.get']
    }, {
      'permissionName' : 'licenses.orgs.view',
      'subPermissions' : ['licenses.orgs.collection.get', 'licenses.orgs.item.get']
    }, {
      'permissionName' : 'licenses.refdata.view',
      'subPermissions' : ['licenses.refdata.collection.get', 'licenses.refdata.item.get']
    }, {
      'permissionName' : 'licenses.refdata.edit',
      'subPermissions' : ['licenses.refdata.view', 'licenses.refdata.item.post', 'licenses.refdata.item.put']
    }, {
      'permissionName' : 'licenses.refdata.manage',
      'subPermissions' : ['licenses.refdata.edit', 'licenses.refdata.item.delete']
    }, {
      'permissionName' : 'licenses.contacts.view',
      'subPermissions' : ['licenses.contacts.collection.get', 'licenses.contacts.item.get']
    }, {
      'permissionName' : 'licenses.licenseLinks.view',
      'subPermissions' : ['licenses.licenseLinks.collection.get', 'licenses.licenseLinks.item.get']
    }, {
      'permissionName' : 'licenses.custprops.view',
      'subPermissions' : ['licenses.custprops.collection.get', 'licenses.custprops.item.get']
    }, {
      'permissionName' : 'licenses.custprops.edit',
      'subPermissions' : ['licenses.custprops.view', 'licenses.custprops.item.post', 'licenses.custprops.item.put']
    }, {
      'permissionName' : 'licenses.custprops.manage',
      'subPermissions' : ['licenses.custprops.edit', 'licenses.custprops.item.delete']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-licenses:2.1.0-SNAPSHOT.119',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-server -XX:+UseContainerSupport -XX:MaxRAMPercentage=50.0 -XX:+PrintFlagsFinal'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '50'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8080/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 805306368
        }
      }
    }
  }, {
    'id' : 'mod-login-6.3.0-SNAPSHOT.72',
    'name' : 'login',
    'requires' : [{
      'id' : 'users',
      'version' : '15.0'
    }],
    'provides' : [{
      'id' : 'login',
      'version' : '6.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/authn/log/events',
        'permissionsRequired' : ['login.event.collection.post'],
        'modulePermissions' : ['users.collection.get', 'configuration.entries.collection.get', 'configuration.entries.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/authn/log/events',
        'permissionsRequired' : ['login.event.collection.get'],
        'modulePermissions' : ['configuration.entries.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/authn/log/events/{id}',
        'permissionsRequired' : ['login.event.delete'],
        'modulePermissions' : ['configuration.entries.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/authn/login',
        'modulePermissions' : ['auth.signtoken', 'auth.signrefreshtoken', 'users.collection.get', 'users.item.put', 'users.item.get', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/authn/loginAttempts/{id}',
        'permissionsRequired' : ['login.attempts.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/authn/credentials',
        'permissionsRequired' : ['login.collection.get', 'users.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/authn/credentials/{id}',
        'permissionsRequired' : ['login.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/authn/credentials',
        'permissionsRequired' : ['login.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/authn/credentials/{id}',
        'permissionsRequired' : ['login.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/authn/credentials/{id}',
        'permissionsRequired' : ['login.item.delete']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/authn/update',
        'modulePermissions' : ['users.collection.get', 'configuration.entries.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/authn/password/repeatable',
        'permissionsRequired' : ['login.password.validate'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/authn/password-reset-action',
        'permissionsRequired' : ['login.password-reset-action.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/authn/password-reset-action/{actionId}',
        'permissionsRequired' : ['login.password-reset-action.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/authn/reset-password',
        'permissionsRequired' : ['login.password-reset.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/authn/credentials-existence',
        'permissionsRequired' : ['login.credentials-existence.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'login.collection.get',
      'displayName' : 'login collection get',
      'description' : 'Get a list of logins'
    }, {
      'permissionName' : 'login.item.get',
      'displayName' : 'login item get',
      'description' : 'Read a single login'
    }, {
      'permissionName' : 'login.item.post',
      'displayName' : 'login item post',
      'description' : 'Add New Login'
    }, {
      'permissionName' : 'login.item.put',
      'displayName' : 'login item put',
      'description' : 'Modify login info'
    }, {
      'permissionName' : 'login.item.delete',
      'displayName' : 'login item delete',
      'description' : 'Remove existing login credentials'
    }, {
      'permissionName' : 'login.attempts.item.get',
      'displayName' : 'login attempt item get',
      'description' : 'Read a login attempt entity for user'
    }, {
      'permissionName' : 'login.password.validate',
      'displayName' : 'login password validate',
      'description' : 'Validate password for repeatability'
    }, {
      'permissionName' : 'login.password-reset-action.post',
      'displayName' : 'login create a new action',
      'description' : 'Saves action to storage'
    }, {
      'permissionName' : 'login.password-reset-action.get',
      'displayName' : 'login get the action by id',
      'description' : 'Retrieves action record by id'
    }, {
      'permissionName' : 'login.password-reset.post',
      'displayName' : 'login password reset',
      'description' : 'Resets password for user in record and deletes action record'
    }, {
      'permissionName' : 'login.event.collection.post',
      'displayName' : 'login save log event',
      'description' : 'Saves received event into the storage'
    }, {
      'permissionName' : 'login.event.collection.get',
      'displayName' : 'login get a list of events',
      'description' : 'Get a list of events from storage'
    }, {
      'permissionName' : 'login.event.delete',
      'displayName' : 'login delete event',
      'description' : 'Delete log event'
    }, {
      'permissionName' : 'login.credentials-existence.get',
      'displayName' : 'Credentials existence get',
      'description' : 'Get credentials existence'
    }, {
      'permissionName' : 'login.all',
      'displayName' : 'login credentials',
      'description' : 'All permissions for login credentials',
      'subPermissions' : ['login.item.get', 'login.collection.get', 'login.item.post', 'login.item.put', 'login.item.delete', 'login.attempts.item.get', 'login.password.validate', 'login.password-reset-action.get', 'login.password-reset-action.post', 'login.password-reset.post', 'login.password.validate', 'login.event.collection.post', 'login.event.collection.get', 'login.event.delete', 'login.credentials-existence.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-login:6.3.0-SNAPSHOT.72',
      'dockerPull' : true,
      'dockerCMD' : ['verify.user=true'],
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-login-saml-1.2.3-SNAPSHOT.46',
    'name' : 'SAML login',
    'requires' : [{
      'id' : 'authtoken',
      'version' : '1.0 2.0'
    }, {
      'id' : 'users',
      'version' : '14.0 15.0'
    }, {
      'id' : 'configuration',
      'version' : '2.0'
    }],
    'provides' : [{
      'id' : 'login-saml',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/saml/login',
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/saml/callback',
        'modulePermissions' : ['auth.signtoken', 'configuration.entries.collection.get', 'users.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/saml/regenerate',
        'permissionsRequired' : ['login-saml.regenerate'],
        'modulePermissions' : ['configuration.entries.collection.get', 'configuration.entries.item.post', 'configuration.entries.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/saml/check',
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET', 'PUT'],
        'pathPattern' : '/saml/configuration',
        'modulePermissions' : ['configuration.entries.collection.get', 'configuration.entries.item.post', 'configuration.entries.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/saml/validate'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'login-saml.regenerate',
      'displayName' : 'SAML sp-metadata regeneration',
      'description' : ''
    }, {
      'permissionName' : 'login-saml.all',
      'displayName' : 'Login-SAML: administration',
      'description' : '',
      'subPermissions' : ['login-saml.regenerate'],
      'visible' : true
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-login-saml:1.2.3-SNAPSHOT.46',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-marccat-2.3.0-SNAPSHOT.363',
    'name' : 'MARCcat',
    'requires' : [{
      'id' : 'configuration',
      'version' : '2.0'
    }],
    'provides' : [{
      'id' : 'marccat',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/marccat/search',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/mergedSearch',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/searchVertical',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/countSearch',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/document-count-by-id',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/bibliographic/fields/mandatory',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/field-template',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/browse',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/next-page',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/previous-page',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/headings-by-tag',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/filteredTagsList',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/filteredTag',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/record-templates',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/record-template/{id}',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/marccat/record-template',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/marccat/record-template/{id}',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/record-template/from-record',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/marccat/record-template/{id}',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/marccat/bibliographic-record',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/bibliographic-record/{id}',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/marccat/bibliographic-record/{id}',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/bibliographic-record/from-template/{idTemplate}',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/bibliographic-record/duplicate',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/marccat/bibliographic-record/fixed-field-display-value',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/fixed-fields-code-groups-by-leader',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/fixed-fields-code-groups',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/marccat/header-types',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/marccat/create-heading',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/marccat/load-from-file',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/marccat/bibliographic-record/lock/{id}',
        'modulePermissions' : ['configuration.all']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/marccat/bibliographic-record/unlock/{id}',
        'modulePermissions' : ['configuration.all']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'marccat.records.collection.get',
      'displayName' : 'MARCcat - get marc records collection',
      'description' : 'Get marc records collection'
    }, {
      'permissionName' : 'marccat.record.count.get',
      'displayName' : 'MARCcat - get count of document by id',
      'description' : 'Get count of MARC document by id'
    }, {
      'permissionName' : 'marccat.tag.collection.get',
      'displayName' : 'MARCcat - get marc tag collection for auto suggest',
      'description' : 'Get marc tag collection for auto suggest'
    }, {
      'permissionName' : 'marccat.record.unlock.delete',
      'displayName' : 'MARCcat - unlock record',
      'description' : 'Unlock MARC record'
    }, {
      'permissionName' : 'marccat.record.lock.put',
      'displayName' : 'MARCcat - lock record',
      'description' : ':Lock MARC record'
    }, {
      'permissionName' : 'marccat.tag.heading.post',
      'displayName' : 'MARCcat - create new heading for tag',
      'description' : 'Create new heading in tag for MARC record'
    }, {
      'permissionName' : 'marccat.tag.value.post',
      'displayName' : 'MARCcat - tag display value',
      'description' : 'Display value in tag for MARC record'
    }, {
      'permissionName' : 'marccat.record.insert.post',
      'displayName' : 'MARCcat - save/update record',
      'description' : 'Save or update MARC record'
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-marccat:2.3.0-SNAPSHOT.363',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 872415232
        }
      }
    }
  }, {
    'id' : 'mod-notes-2.8.1-SNAPSHOT.146',
    'name' : 'Notes',
    'requires' : [{
      'id' : 'users',
      'version' : '15.0'
    }, {
      'id' : 'configuration',
      'version' : '2.0'
    }],
    'provides' : [{
      'id' : 'notes',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/notes',
        'permissionsRequired' : ['notes.collection.get', 'notes.domain.all']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/notes',
        'permissionsRequired' : ['notes.item.post', 'notes.domain.all'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/notes/{id}',
        'permissionsRequired' : ['notes.item.get', 'notes.domain.all']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/notes/{id}',
        'permissionsRequired' : ['notes.item.put', 'notes.domain.all'],
        'modulePermissions' : ['users.item.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/notes/{id}',
        'permissionsRequired' : ['notes.item.delete', 'notes.domain.all']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/note-types',
        'permissionsRequired' : ['note.types.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/note-types/{typeId}',
        'permissionsRequired' : ['note.types.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/note-types',
        'permissionsRequired' : ['note.types.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/note-types/{id}',
        'permissionsRequired' : ['note.types.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/note-types/{id}',
        'permissionsRequired' : ['note.types.item.delete']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/note-links/type/{type}/id/{id}',
        'permissionsRequired' : ['note.links.collection.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/note-links/domain/{domain}/type/{type}/id/{id}',
        'permissionsRequired' : ['notes.collection.get.by.status']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }, {
      'id' : '_ramls',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/ramls'
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'notes.collection.get',
      'displayName' : 'Notes - get notes collection',
      'description' : 'Get notes collection'
    }, {
      'permissionName' : 'notes.item.get',
      'displayName' : 'Notes - get individual note from storage',
      'description' : 'Get individual note'
    }, {
      'permissionName' : 'notes.item.post',
      'displayName' : 'Notes - create note',
      'description' : 'Create note'
    }, {
      'permissionName' : 'notes.item.put',
      'displayName' : 'Notes - modify note',
      'description' : 'Modify note'
    }, {
      'permissionName' : 'notes.item.delete',
      'displayName' : 'Notes - delete note',
      'description' : 'Delete note'
    }, {
      'permissionName' : 'notes.domain.all',
      'displayName' : 'Notes - allow access to all domains',
      'description' : 'All domains'
    }, {
      'permissionName' : 'note.types.item.get',
      'displayName' : 'Note types - get individual note type from storage',
      'description' : 'Get individual note type'
    }, {
      'permissionName' : 'note.types.item.post',
      'displayName' : 'Note types - create note type',
      'description' : 'Create note type'
    }, {
      'permissionName' : 'note.types.item.put',
      'displayName' : 'Note types - modify note type',
      'description' : 'Modify note type'
    }, {
      'permissionName' : 'note.types.item.delete',
      'displayName' : 'Note types - delete note type',
      'description' : 'Delete note type'
    }, {
      'permissionName' : 'note.links.collection.put',
      'displayName' : 'Note links - update note links',
      'description' : 'Update note links'
    }, {
      'permissionName' : 'notes.collection.get.by.status',
      'displayName' : 'Notes - get notes collection sorted by status',
      'description' : 'Get notes collection by status and domain'
    }, {
      'permissionName' : 'notes.allops',
      'displayName' : 'Notes module - all CRUD permissions',
      'description' : 'Entire set of permissions needed to use the notes modules, but no domain permissions',
      'subPermissions' : ['notes.collection.get', 'notes.item.get', 'notes.item.post', 'notes.item.put', 'notes.item.delete', 'note.links.collection.put', 'notes.collection.get.by.status'],
      'visible' : false
    }, {
      'permissionName' : 'note.types.allops',
      'displayName' : 'Note types - all CRUD permissions',
      'description' : 'Entire set of permissions needed to use the note type for note module',
      'subPermissions' : ['note.types.item.get', 'note.types.collection.get', 'note.types.item.post', 'note.types.item.put', 'note.types.item.delete'],
      'visible' : false
    }, {
      'permissionName' : 'notes.all',
      'displayName' : 'Notes module - all permissions and all domains',
      'description' : 'Entire set of permissions needed to use the notes modules on any domain',
      'subPermissions' : ['notes.allops', 'notes.domain.all', 'note.types.allops'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-notes:2.8.1-SNAPSHOT.146',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-notify-2.5.0-SNAPSHOT.88',
    'name' : 'Notify',
    'requires' : [{
      'id' : 'users',
      'version' : '15.0'
    }, {
      'id' : 'mod-event',
      'version' : '1.0'
    }, {
      'id' : 'template-engine',
      'version' : '2.0'
    }, {
      'id' : 'message-delivery',
      'version' : '1.0'
    }],
    'provides' : [{
      'id' : 'notify',
      'version' : '2.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/notify',
        'permissionsRequired' : ['notify.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/notify',
        'permissionsRequired' : ['notify.item.post'],
        'modulePermissions' : ['event.config.collection.get', 'template-request.post', 'sender.message-delivery']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/notify/_username/{uid}',
        'permissionsRequired' : ['notify.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/notify/{id}',
        'permissionsRequired' : ['notify.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/notify/{id}',
        'permissionsRequired' : ['notify.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/notify/{id}',
        'permissionsRequired' : ['notify.item.delete']
      }]
    }, {
      'id' : 'patron-notice',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/patron-notice',
        'permissionsRequired' : ['patron-notice.post'],
        'modulePermissions' : ['template-request.post', 'sender.message-delivery']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }, {
      'id' : '_ramls',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/ramls'
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'notify.collection.get',
      'displayName' : 'Notifications - get notify collection',
      'description' : 'Get notify collection'
    }, {
      'permissionName' : 'notify.item.get',
      'displayName' : 'Notifications- get individual notification from storage',
      'description' : 'Get individual notification'
    }, {
      'permissionName' : 'notify.item.post',
      'displayName' : 'Notifications - create notification',
      'description' : 'Create notification'
    }, {
      'permissionName' : 'notify.item.put',
      'displayName' : 'Notifications - modify notification',
      'description' : 'Modify notification'
    }, {
      'permissionName' : 'notify.item.delete',
      'displayName' : 'Notifications - delete notification',
      'description' : 'Delete notification'
    }, {
      'permissionName' : 'patron-notice.post',
      'displayName' : 'Patron Notice',
      'description' : 'Post Patron Notice'
    }, {
      'permissionName' : 'notify.all',
      'displayName' : 'Notifications module - all permissions',
      'description' : 'Entire set of permissions needed to use the notify modules',
      'subPermissions' : ['notify.collection.get', 'notify.item.get', 'notify.item.post', 'notify.item.put', 'notify.item.delete'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-notify:2.5.0-SNAPSHOT.88',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-oai-pmh-2.0.1-SNAPSHOT.57',
    'name' : 'OAI-PMH Repository Module',
    'requires' : [{
      'id' : 'instance-storage',
      'version' : '6.0 7.0'
    }, {
      'id' : 'source-storage-records',
      'version' : '1.0'
    }],
    'provides' : [{
      'id' : 'oai-pmh',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/oai/records',
        'permissionsRequired' : ['oai-pmh.records.collection.get'],
        'modulePermissions' : ['inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.instances.source-record.marc-json.get', 'source-storage.records.get', 'source-storage.sourceRecords.get', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/oai/records/{id}',
        'permissionsRequired' : ['oai-pmh.records.item.get'],
        'modulePermissions' : ['inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'inventory-storage.instances.source-record.marc-json.get', 'source-storage.records.get', 'source-storage.sourceRecords.get', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/oai/repository_info',
        'permissionsRequired' : ['oai-pmh.identify.get'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/oai/identifiers',
        'permissionsRequired' : ['oai-pmh.identifiers.collection.get'],
        'modulePermissions' : ['inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'source-storage.sourceRecords.get', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/oai/metadata_formats',
        'permissionsRequired' : ['oai-pmh.metadata-formats.collection.get'],
        'modulePermissions' : ['inventory-storage.instances.collection.get', 'inventory-storage.instances.item.get', 'source-storage.sourceRecords.get', 'configuration.entries.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/oai/sets',
        'permissionsRequired' : ['oai-pmh.set.collection.get'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'oai-pmh.records.item.get',
      'displayName' : 'OAI-PMH - retrieve individual record',
      'description' : 'Retrieve an individual metadata record'
    }, {
      'permissionName' : 'oai-pmh.identify.get',
      'displayName' : 'OAI-PMH - get information about a repository',
      'description' : 'Get information about a repository'
    }, {
      'permissionName' : 'oai-pmh.identifiers.collection.get',
      'displayName' : 'OAI-PMH - get headers list',
      'description' : 'Get headers list of record in specific format'
    }, {
      'permissionName' : 'oai-pmh.metadata-formats.collection.get',
      'displayName' : 'OAI-PMH - get metadata formats available from a repository',
      'description' : 'Get metadata formats available from a repository'
    }, {
      'permissionName' : 'oai-pmh.records.collection.get',
      'displayName' : 'OAI-PMH - get list of records',
      'description' : 'Get records from repository'
    }, {
      'permissionName' : 'oai-pmh.set.collection.get',
      'displayName' : 'oai-pmh - get set structure of a repository',
      'description' : 'Get set structure of a repository'
    }, {
      'permissionName' : 'oai-pmh.all',
      'displayName' : 'OAI-PMH - all permissions',
      'description' : 'Entire set of permissions needed to use OAI-PMH',
      'subPermissions' : ['oai-pmh.records.item.get', 'oai-pmh.identify.get', 'oai-pmh.identifiers.collection.get', 'oai-pmh.metadata-formats.collection.get', 'oai-pmh.records.collection.get', 'oai-pmh.set.collection.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-oai-pmh:2.0.1-SNAPSHOT.57',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-orders-9.1.0-SNAPSHOT.246',
    'name' : 'Orders Business Logic Module',
    'requires' : [{
      'id' : 'acquisitions-units-storage.units',
      'version' : '1.1'
    }, {
      'id' : 'acquisitions-units-storage.memberships',
      'version' : '1.0'
    }, {
      'id' : 'configuration',
      'version' : '2.0'
    }, {
      'id' : 'orders-storage.purchase-orders',
      'version' : '6.1'
    }, {
      'id' : 'orders-storage.alerts',
      'version' : '3.0'
    }, {
      'id' : 'orders-storage.pieces',
      'version' : '3.2'
    }, {
      'id' : 'orders-storage.receiving-history',
      'version' : '3.2'
    }, {
      'id' : 'orders-storage.reporting-codes',
      'version' : '3.0'
    }, {
      'id' : 'orders-storage.po-lines',
      'version' : '9.0'
    }, {
      'id' : 'orders-storage.order-templates',
      'version' : '1.0'
    }, {
      'id' : 'holdings-storage',
      'version' : '3.1 4.0'
    }, {
      'id' : 'orders-storage.po-number',
      'version' : '2.0'
    }, {
      'id' : 'inventory',
      'version' : '9.6 10.0'
    }, {
      'id' : 'instance-types',
      'version' : '2.0'
    }, {
      'id' : 'instance-statuses',
      'version' : '1.0'
    }, {
      'id' : 'item-storage',
      'version' : '7.8 8.0'
    }, {
      'id' : 'identifier-types',
      'version' : '1.2'
    }, {
      'id' : 'isbn-utils',
      'version' : '2.0'
    }, {
      'id' : 'loan-types',
      'version' : '2.2'
    }, {
      'id' : 'organizations-storage.organizations',
      'version' : '2.1'
    }, {
      'id' : 'finance.funds',
      'version' : '1.0'
    }, {
      'id' : 'finance.transactions',
      'version' : '1.0'
    }, {
      'id' : 'finance.order-transaction-summaries',
      'version' : '1.0'
    }, {
      'id' : 'finance.ledgers',
      'version' : '1.0'
    }, {
      'id' : 'orders-storage.titles',
      'version' : '1.0'
    }],
    'provides' : [{
      'id' : 'orders',
      'version' : '9.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders/composite-orders',
        'permissionsRequired' : ['orders.collection.get'],
        'modulePermissions' : ['acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.purchase-orders.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders/composite-orders',
        'permissionsRequired' : ['orders.item.post'],
        'permissionsDesired' : ['orders.acquisitions-units-assignments.assign', 'orders.item.approve'],
        'modulePermissions' : ['modperms.orders.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders/composite-orders/{id}',
        'permissionsRequired' : ['orders.item.get'],
        'modulePermissions' : ['orders-storage.purchase-orders.item.get', 'orders-storage.po-lines.collection.get', 'orders-storage.alerts.item.get', 'orders-storage.reporting-codes.item.get', 'configuration.entries.collection.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders/composite-orders/{id}',
        'permissionsRequired' : ['orders.item.put'],
        'permissionsDesired' : ['orders.acquisitions-units-assignments.manage', 'orders.item.approve'],
        'modulePermissions' : ['modperms.orders.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders/composite-orders/{id}',
        'permissionsRequired' : ['orders.item.delete'],
        'modulePermissions' : ['orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.delete', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.delete', 'orders-storage.alerts.item.delete', 'orders-storage.reporting-codes.item.delete', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }]
    }, {
      'id' : 'order-lines',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders/order-lines',
        'permissionsRequired' : ['orders.po-lines.collection.get'],
        'modulePermissions' : ['acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.po-lines.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders/order-lines',
        'permissionsRequired' : ['orders.po-lines.item.post'],
        'modulePermissions' : ['orders-storage.purchase-orders.item.get', 'orders-storage.po-line-number.get', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.post', 'orders-storage.alerts.item.post', 'orders-storage.reporting-codes.item.post', 'configuration.entries.collection.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'inventory-storage.identifier-types.collection.get', 'isbn-utils.convert-to-13.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders/order-lines/{id}',
        'permissionsRequired' : ['orders.po-lines.item.get'],
        'modulePermissions' : ['orders-storage.po-lines.item.get', 'orders-storage.alerts.item.get', 'orders-storage.reporting-codes.item.get', 'orders-storage.purchase-orders.item.get', 'orders-storage.titles.collection.get', 'configuration.entries.collection.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders/order-lines/{id}',
        'permissionsRequired' : ['orders.po-lines.item.put'],
        'modulePermissions' : ['orders-storage.alerts.item.post', 'orders-storage.alerts.item.put', 'orders-storage.alerts.item.delete', 'orders-storage.po-lines.item.get', 'orders-storage.po-lines.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.put', 'orders-storage.reporting-codes.item.post', 'orders-storage.reporting-codes.item.put', 'orders-storage.reporting-codes.item.delete', 'configuration.entries.collection.get', 'inventory-storage.identifier-types.collection.get', 'isbn-utils.convert-to-13.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders/order-lines/{id}',
        'permissionsRequired' : ['orders.po-lines.item.delete'],
        'modulePermissions' : ['orders-storage.purchase-orders.item.get', 'orders-storage.po-lines.item.get', 'orders-storage.po-lines.item.delete', 'orders-storage.alerts.item.delete', 'orders-storage.reporting-codes.item.delete', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }]
    }, {
      'id' : 'po-number',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/orders/po-number/validate',
        'permissionsRequired' : ['orders.po-number.item.post'],
        'modulePermissions' : ['orders-storage.purchase-orders.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders/po-number',
        'permissionsRequired' : ['orders.po-number.item.get'],
        'modulePermissions' : ['orders-storage.po-number.get']
      }]
    }, {
      'id' : 'receiving',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/orders/receive',
        'permissionsRequired' : ['orders.receiving.collection.post'],
        'modulePermissions' : ['orders-storage.pieces.collection.get', 'orders-storage.pieces.item.put', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.put', 'orders-storage.titles.collection.get', 'inventory.items.collection.get', 'inventory.items.item.put', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.post', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.purchase-orders.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders/check-in',
        'permissionsRequired' : ['orders.check-in.collection.post'],
        'modulePermissions' : ['orders-storage.pieces.collection.get', 'orders-storage.pieces.item.put', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.put', 'orders-storage.titles.collection.get', 'inventory.items.collection.get', 'inventory.items.item.put', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.post', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.purchase-orders.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders/receiving-history',
        'permissionsRequired' : ['orders.receiving-history.collection.get'],
        'modulePermissions' : ['acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.receiving-history.collection.get']
      }]
    }, {
      'id' : 'pieces',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/orders/pieces',
        'permissionsRequired' : ['orders.pieces.item.post'],
        'modulePermissions' : ['orders-storage.pieces.item.post', 'orders-storage.po-lines.item.get', 'orders-storage.purchase-orders.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders/pieces/{id}',
        'permissionsRequired' : ['orders.pieces.item.put'],
        'modulePermissions' : ['orders-storage.pieces.item.put', 'orders-storage.pieces.item.get', 'orders-storage.po-lines.item.get', 'orders-storage.purchase-orders.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders/pieces/{id}',
        'permissionsRequired' : ['orders.pieces.item.delete'],
        'modulePermissions' : ['orders-storage.pieces.item.delete', 'orders-storage.pieces.item.get', 'orders-storage.po-lines.item.get', 'orders-storage.purchase-orders.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }]
    }, {
      'id' : 'order-templates',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders/order-templates',
        'permissionsRequired' : ['orders.order-templates.collection.get'],
        'modulePermissions' : ['orders-storage.order-templates.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders/order-templates',
        'permissionsRequired' : ['orders.order-templates.item.post'],
        'modulePermissions' : ['orders-storage.order-templates.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders/order-templates/{id}',
        'permissionsRequired' : ['orders.order-templates.item.get'],
        'modulePermissions' : ['orders-storage.order-templates.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders/order-templates/{id}',
        'permissionsRequired' : ['orders.order-templates.item.put'],
        'modulePermissions' : ['orders-storage.order-templates.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders/order-templates/{id}',
        'permissionsRequired' : ['orders.order-templates.item.delete'],
        'modulePermissions' : ['orders-storage.order-templates.item.delete']
      }]
    }, {
      'id' : 'acquisitions-units',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units/units',
        'permissionsRequired' : ['acquisitions-units.units.collection.get'],
        'modulePermissions' : ['acquisitions-units-storage.units.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/acquisitions-units/units',
        'permissionsRequired' : ['acquisitions-units.units.item.post'],
        'modulePermissions' : ['acquisitions-units-storage.units.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units/units/{id}',
        'permissionsRequired' : ['acquisitions-units.units.item.get'],
        'modulePermissions' : ['acquisitions-units-storage.units.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/acquisitions-units/units/{id}',
        'permissionsRequired' : ['acquisitions-units.units.item.put'],
        'modulePermissions' : ['acquisitions-units-storage.units.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/acquisitions-units/units/{id}',
        'permissionsRequired' : ['acquisitions-units.units.item.delete'],
        'modulePermissions' : ['acquisitions-units-storage.units.item.get', 'acquisitions-units-storage.units.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units/memberships',
        'permissionsRequired' : ['acquisitions-units.memberships.collection.get'],
        'modulePermissions' : ['acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/acquisitions-units/memberships',
        'permissionsRequired' : ['acquisitions-units.memberships.item.post'],
        'modulePermissions' : ['acquisitions-units-storage.memberships.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units/memberships/{id}',
        'permissionsRequired' : ['acquisitions-units.memberships.item.get'],
        'modulePermissions' : ['acquisitions-units-storage.memberships.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/acquisitions-units/memberships/{id}',
        'permissionsRequired' : ['acquisitions-units.memberships.item.put'],
        'modulePermissions' : ['acquisitions-units-storage.memberships.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/acquisitions-units/memberships/{id}',
        'permissionsRequired' : ['acquisitions-units.memberships.item.delete'],
        'modulePermissions' : ['acquisitions-units-storage.memberships.item.delete']
      }]
    }, {
      'id' : 'titles',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders/titles',
        'permissionsRequired' : ['orders.titles.collection.get'],
        'modulePermissions' : ['orders-storage.titles.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders/titles',
        'permissionsRequired' : ['orders.titles.item.post'],
        'modulePermissions' : ['orders-storage.titles.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders/titles/{id}',
        'permissionsRequired' : ['orders.titles.item.get'],
        'modulePermissions' : ['orders-storage.titles.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders/titles/{id}',
        'permissionsRequired' : ['orders.titles.item.put'],
        'modulePermissions' : ['orders-storage.titles.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders/titles/{id}',
        'permissionsRequired' : ['orders.titles.item.delete'],
        'modulePermissions' : ['orders-storage.titles.item.delete']
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'orders.collection.get',
      'displayName' : 'orders - get orders collection',
      'description' : 'Get orders collection'
    }, {
      'permissionName' : 'orders.item.post',
      'displayName' : 'orders - create a new order',
      'description' : 'Create a new order'
    }, {
      'permissionName' : 'orders.item.get',
      'displayName' : 'orders - get an existing order',
      'description' : 'Get an existing order'
    }, {
      'permissionName' : 'orders.item.put',
      'displayName' : 'orders - modify an existing order',
      'description' : 'Modify an existing order'
    }, {
      'permissionName' : 'orders.item.delete',
      'displayName' : 'orders - delete an existing order',
      'description' : 'Delete an existing order'
    }, {
      'permissionName' : 'orders.po-lines.collection.get',
      'displayName' : 'Orders - get collection of PO lines',
      'description' : 'Get collection of PO lines'
    }, {
      'permissionName' : 'orders.po-lines.item.post',
      'displayName' : 'Orders - create a new PO line',
      'description' : 'Create a new PO line'
    }, {
      'permissionName' : 'orders.po-lines.item.get',
      'displayName' : 'Orders - get an existing PO line',
      'description' : 'Get an existing PO line'
    }, {
      'permissionName' : 'orders.po-lines.item.put',
      'displayName' : 'Orders - modify an existing PO line',
      'description' : 'Modify an existing PO line'
    }, {
      'permissionName' : 'orders.po-lines.item.delete',
      'displayName' : 'Orders - delete an existing PO line',
      'description' : 'Delete an existing PO line'
    }, {
      'permissionName' : 'orders.po-number.item.get',
      'displayName' : 'Orders - generate a PO Number',
      'description' : 'Generate a PO Number'
    }, {
      'permissionName' : 'orders.po-number.item.post',
      'displayName' : 'Orders - validate a PO Number',
      'description' : 'Validate a PO Number'
    }, {
      'permissionName' : 'orders.receiving.collection.post',
      'displayName' : 'Orders - Receive items',
      'description' : 'Receive items spanning one or more po-lines in this order'
    }, {
      'permissionName' : 'orders.check-in.collection.post',
      'displayName' : 'Orders - Check-in items',
      'description' : 'Check-in items spanning one or more po-lines in this order'
    }, {
      'permissionName' : 'orders.receiving-history.collection.get',
      'displayName' : 'Orders - Receiving history',
      'description' : 'Get receiving history matching the provided criteria'
    }, {
      'permissionName' : 'orders.pieces.item.post',
      'displayName' : 'Orders - Piece',
      'description' : 'Create piece record'
    }, {
      'permissionName' : 'orders.pieces.item.put',
      'displayName' : 'orders - modify an existing piece record',
      'description' : 'Modify an existing piece'
    }, {
      'permissionName' : 'orders.pieces.item.delete',
      'displayName' : 'orders - delete an existing piece record',
      'description' : 'Delete an existing piece'
    }, {
      'permissionName' : 'orders.order-templates.collection.get',
      'displayName' : 'Orders - Get template collection',
      'description' : 'Get a collection of order templates'
    }, {
      'permissionName' : 'orders.order-templates.item.post',
      'displayName' : 'Orders - Create an order template',
      'description' : 'Create a new order template'
    }, {
      'permissionName' : 'orders.order-templates.item.get',
      'displayName' : 'Orders - Get an order template',
      'description' : 'Fetch an order templates'
    }, {
      'permissionName' : 'orders.order-templates.item.put',
      'displayName' : 'Orders - Update an order template',
      'description' : 'Update an order template'
    }, {
      'permissionName' : 'orders.order-templates.item.delete',
      'displayName' : 'Orders - Delete an order template',
      'description' : 'Delete an order template'
    }, {
      'permissionName' : 'orders.order-templates.all',
      'displayName' : 'All order-templates permissions',
      'description' : 'All permissions for the order-templates',
      'subPermissions' : ['orders.order-templates.collection.get', 'orders.order-templates.item.post', 'orders.order-templates.item.get', 'orders.order-templates.item.put', 'orders.order-templates.item.delete']
    }, {
      'permissionName' : 'acquisitions-units.units.collection.get',
      'displayName' : 'Acquisitions units - get units',
      'description' : 'Get a collection of acquisitions units'
    }, {
      'permissionName' : 'acquisitions-units.units.item.post',
      'displayName' : 'Acquisitions units - create unit',
      'description' : 'Create a new acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units.units.item.get',
      'displayName' : 'Acquisitions units - get unit',
      'description' : 'Fetch an acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units.units.item.put',
      'displayName' : 'Acquisitions units - update unit',
      'description' : 'Update an acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units.units.item.delete',
      'displayName' : 'Acquisitions units - delete unit',
      'description' : 'Delete an acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units.units.all',
      'displayName' : 'All acquisitions-units perms',
      'description' : 'All permissions for the acquisitions-units',
      'subPermissions' : ['acquisitions-units.units.collection.get', 'acquisitions-units.units.item.post', 'acquisitions-units.units.item.get', 'acquisitions-units.units.item.put', 'acquisitions-units.units.item.delete']
    }, {
      'permissionName' : 'orders.acquisitions-units-assignments.assign',
      'displayName' : 'Acquisitions unit assignment - create unit assignment',
      'description' : 'Assign new order to acquisitions units'
    }, {
      'permissionName' : 'orders.acquisitions-units-assignments.manage',
      'displayName' : 'Acquisitions units assignment - manage unit assignments',
      'description' : 'Manage unit assignments during orders update'
    }, {
      'permissionName' : 'orders.acquisitions-units-assignments.all',
      'displayName' : 'All order acquisitions-unit-assignments permissions',
      'description' : 'All permissions for the acquisitions-unit-assignments',
      'subPermissions' : ['orders.acquisitions-units-assignments.assign', 'orders.acquisitions-units-assignments.manage']
    }, {
      'permissionName' : 'acquisitions-units.memberships.collection.get',
      'displayName' : 'Acquisitions units memberships - get units memberships',
      'description' : 'Get a collection of acquisitions units memberships'
    }, {
      'permissionName' : 'acquisitions-units.memberships.item.post',
      'displayName' : 'Acquisitions units memberships - create units membership',
      'description' : 'Create a new acquisitions units membership'
    }, {
      'permissionName' : 'acquisitions-units.memberships.item.get',
      'displayName' : 'Acquisitions units memberships - get units membership',
      'description' : 'Fetch an acquisitions units membership'
    }, {
      'permissionName' : 'acquisitions-units.memberships.item.put',
      'displayName' : 'Acquisitions units memberships - update units membership',
      'description' : 'Update an acquisitions units membership'
    }, {
      'permissionName' : 'acquisitions-units.memberships.item.delete',
      'displayName' : 'Acquisitions units memberships - delete units membership',
      'description' : 'Delete an acquisitions units membership'
    }, {
      'permissionName' : 'acquisitions-units.memberships.all',
      'displayName' : 'All acquisitions-units perms',
      'description' : 'All permissions for the acquisitions-units memberships',
      'subPermissions' : ['acquisitions-units.memberships.collection.get', 'acquisitions-units.memberships.item.post', 'acquisitions-units.memberships.item.get', 'acquisitions-units.memberships.item.put', 'acquisitions-units.memberships.item.delete']
    }, {
      'permissionName' : 'orders.titles.collection.get',
      'displayName' : 'Titles - get titles collection',
      'description' : 'Get titles collection'
    }, {
      'permissionName' : 'orders.titles.item.post',
      'displayName' : 'Titles - create a new title',
      'description' : 'Create a new title'
    }, {
      'permissionName' : 'orders.titles.item.get',
      'displayName' : 'Titles - get an existing title',
      'description' : 'Get an existing title'
    }, {
      'permissionName' : 'orders.titles.item.put',
      'displayName' : 'Titles - modify an existing title',
      'description' : 'Modify an existing title'
    }, {
      'permissionName' : 'orders.titles.item.delete',
      'displayName' : 'Titles - delete an existing title',
      'description' : 'Delete an existing title'
    }, {
      'permissionName' : 'orders.titles.all',
      'displayName' : 'All titles perms',
      'description' : 'All permissions for the titles',
      'subPermissions' : ['orders.titles.collection.get', 'orders.titles.item.post', 'orders.titles.item.get', 'orders.titles.item.put', 'orders.titles.item.delete']
    }, {
      'permissionName' : 'orders.all',
      'displayName' : 'orders - all permissions',
      'description' : 'Entire set of permissions needed to use orders',
      'subPermissions' : ['orders.collection.get', 'orders.item.post', 'orders.item.get', 'orders.item.put', 'orders.item.delete', 'orders.po-lines.collection.get', 'orders.po-lines.item.post', 'orders.po-lines.item.get', 'orders.po-lines.item.put', 'orders.po-lines.item.delete', 'orders.po-number.item.get', 'orders.po-number.item.post', 'orders.receiving.collection.post', 'orders.check-in.collection.post', 'orders.receiving-history.collection.get', 'orders.pieces.item.post', 'orders.pieces.item.put', 'orders.pieces.item.delete', 'orders.acquisitions-units-assignments.all', 'orders.order-templates.all', 'orders.titles.all']
    }, {
      'permissionName' : 'modperms.orders.item.put',
      'displayName' : 'module permissions for put purchase order',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['orders-storage.purchase-orders.collection.get', 'orders-storage.purchase-orders.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.post', 'orders-storage.po-lines.item.put', 'orders-storage.po-lines.item.delete', 'orders-storage.alerts.item.post', 'orders-storage.alerts.item.get', 'orders-storage.alerts.item.put', 'orders-storage.alerts.item.delete', 'orders-storage.pieces.item.post', 'orders-storage.pieces.collection.get', 'orders-storage.po-line-number.get', 'orders-storage.reporting-codes.item.post', 'orders-storage.reporting-codes.item.get', 'orders-storage.reporting-codes.item.put', 'orders-storage.reporting-codes.item.delete', 'orders-storage.titles.collection.get', 'orders-storage.titles.item.put', 'configuration.entries.collection.get', 'finance.funds.collection.get', 'finance.encumbrances.item.post', 'finance.ledgers.current-fiscal-year.item.get', 'finance.order-transaction-summaries.item.post', 'inventory.instances.collection.get', 'inventory.instances.item.post', 'inventory-storage.instance-types.collection.get', 'inventory-storage.instance-statuses.collection.get', 'inventory-storage.holdings.item.post', 'inventory-storage.holdings.collection.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.post', 'inventory-storage.loan-types.collection.get', 'inventory-storage.contributor-name-types.collection.get', 'organizations-storage.organizations.collection.get', 'organizations-storage.organizations.item.get', 'isbn-utils.convert-to-13.get', 'inventory-storage.identifier-types.collection.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get'],
      'visible' : false
    }, {
      'permissionName' : 'modperms.orders.item.post',
      'displayName' : 'module permissions for post purchase order',
      'description' : 'to reduce X-Okapi-Token size',
      'subPermissions' : ['orders-storage.purchase-orders.collection.get', 'orders-storage.purchase-orders.item.post', 'orders-storage.purchase-orders.item.put', 'orders-storage.alerts.item.post', 'orders-storage.alerts.item.put', 'orders-storage.po-lines.item.post', 'orders-storage.po-lines.item.put', 'orders-storage.po-lines.collection.get', 'orders-storage.pieces.item.post', 'orders-storage.pieces.collection.get', 'orders-storage.po-line-number.get', 'orders-storage.po-number.get', 'orders-storage.reporting-codes.item.post', 'orders-storage.reporting-codes.item.put', 'orders-storage.titles.collection.get', 'orders-storage.titles.item.put', 'configuration.entries.collection.get', 'finance.encumbrances.item.post', 'finance.funds.collection.get', 'finance.ledgers.current-fiscal-year.item.get', 'finance.order-transaction-summaries.item.post', 'inventory.instances.collection.get', 'inventory.instances.item.post', 'inventory-storage.instance-types.collection.get', 'inventory-storage.instance-statuses.collection.get', 'inventory-storage.holdings.item.post', 'inventory-storage.holdings.collection.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.post', 'inventory-storage.loan-types.collection.get', 'inventory-storage.contributor-name-types.collection.get', 'organizations-storage.organizations.collection.get', 'organizations-storage.organizations.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'inventory-storage.identifier-types.collection.get', 'isbn-utils.convert-to-13.get'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-orders:9.1.0-SNAPSHOT.246',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-orders-storage-10.0.0-SNAPSHOT.157',
    'name' : 'Orders CRUD module',
    'provides' : [{
      'id' : 'orders-storage.alerts',
      'version' : '3.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/alerts',
        'permissionsRequired' : ['orders-storage.alerts.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/alerts',
        'permissionsRequired' : ['orders-storage.alerts.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/alerts/{id}',
        'permissionsRequired' : ['orders-storage.alerts.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/alerts/{id}',
        'permissionsRequired' : ['orders-storage.alerts.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/alerts/{id}',
        'permissionsRequired' : ['orders-storage.alerts.item.delete']
      }]
    }, {
      'id' : 'orders-storage.pieces',
      'version' : '3.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/pieces',
        'permissionsRequired' : ['orders-storage.pieces.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/pieces',
        'permissionsRequired' : ['orders-storage.pieces.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/pieces/{id}',
        'permissionsRequired' : ['orders-storage.pieces.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/pieces/{id}',
        'permissionsRequired' : ['orders-storage.pieces.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/pieces/{id}',
        'permissionsRequired' : ['orders-storage.pieces.item.delete']
      }]
    }, {
      'id' : 'orders-storage.titles',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/titles',
        'permissionsRequired' : ['orders-storage.titles.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/titles',
        'permissionsRequired' : ['orders-storage.titles.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/titles/{id}',
        'permissionsRequired' : ['orders-storage.titles.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/titles/{id}',
        'permissionsRequired' : ['orders-storage.titles.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/titles/{id}',
        'permissionsRequired' : ['orders-storage.titles.item.delete']
      }]
    }, {
      'id' : 'orders-storage.po-lines',
      'version' : '9.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/po-lines',
        'permissionsRequired' : ['orders-storage.po-lines.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/po-lines',
        'permissionsRequired' : ['orders-storage.po-lines.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/po-lines/{id}',
        'permissionsRequired' : ['orders-storage.po-lines.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/po-lines/{id}',
        'permissionsRequired' : ['orders-storage.po-lines.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/po-lines/{id}',
        'permissionsRequired' : ['orders-storage.po-lines.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/order-lines',
        'permissionsRequired' : ['orders-storage.po-lines.collection.get']
      }]
    }, {
      'id' : 'orders-storage.purchase-orders',
      'version' : '6.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/purchase-orders',
        'permissionsRequired' : ['orders-storage.purchase-orders.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/purchase-orders',
        'permissionsRequired' : ['orders-storage.purchase-orders.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/purchase-orders/{id}',
        'permissionsRequired' : ['orders-storage.purchase-orders.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/purchase-orders/{id}',
        'permissionsRequired' : ['orders-storage.purchase-orders.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/purchase-orders/{id}',
        'permissionsRequired' : ['orders-storage.purchase-orders.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/orders',
        'permissionsRequired' : ['orders-storage.purchase-orders.collection.get']
      }]
    }, {
      'id' : 'orders-storage.receiving-history',
      'version' : '3.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/receiving-history',
        'permissionsRequired' : ['orders-storage.receiving-history.collection.get']
      }]
    }, {
      'id' : 'orders-storage.reporting-codes',
      'version' : '3.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/reporting-codes',
        'permissionsRequired' : ['orders-storage.reporting-codes.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/reporting-codes',
        'permissionsRequired' : ['orders-storage.reporting-codes.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/reporting-codes/{id}',
        'permissionsRequired' : ['orders-storage.reporting-codes.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/reporting-codes/{id}',
        'permissionsRequired' : ['orders-storage.reporting-codes.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/reporting-codes/{id}',
        'permissionsRequired' : ['orders-storage.reporting-codes.item.delete']
      }]
    }, {
      'id' : 'orders-storage.po-number',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/po-number',
        'permissionsRequired' : ['orders-storage.po-number.get']
      }]
    }, {
      'id' : 'orders-storage.po-line-number',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/po-line-number',
        'permissionsRequired' : ['orders-storage.po-line-number.get']
      }]
    }, {
      'id' : 'orders-storage.order-invoice-relationships',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/order-invoice-relns',
        'permissionsRequired' : ['orders-storage.order-invoice-relationships.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/order-invoice-relns',
        'permissionsRequired' : ['orders-storage.order-invoice-relationships.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/order-invoice-relns/{id}',
        'permissionsRequired' : ['orders-storage.order-invoice-relationships.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/order-invoice-relns/{id}',
        'permissionsRequired' : ['orders-storage.order-invoice-relationships.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/order-invoice-relns/{id}',
        'permissionsRequired' : ['orders-storage.order-invoice-relationships.item.delete']
      }]
    }, {
      'id' : 'orders-storage.order-templates',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/order-templates',
        'permissionsRequired' : ['orders-storage.order-templates.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/orders-storage/order-templates',
        'permissionsRequired' : ['orders-storage.order-templates.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/orders-storage/order-templates/{id}',
        'permissionsRequired' : ['orders-storage.order-templates.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/orders-storage/order-templates/{id}',
        'permissionsRequired' : ['orders-storage.order-templates.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/orders-storage/order-templates/{id}',
        'permissionsRequired' : ['orders-storage.order-templates.item.delete']
      }]
    }, {
      'id' : 'acquisitions-units-storage.units',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units-storage/units',
        'permissionsRequired' : ['acquisitions-units-storage.units.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/acquisitions-units-storage/units',
        'permissionsRequired' : ['acquisitions-units-storage.units.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units-storage/units/{id}',
        'permissionsRequired' : ['acquisitions-units-storage.units.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/acquisitions-units-storage/units/{id}',
        'permissionsRequired' : ['acquisitions-units-storage.units.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/acquisitions-units-storage/units/{id}',
        'permissionsRequired' : ['acquisitions-units-storage.units.item.delete']
      }]
    }, {
      'id' : 'acquisitions-units-storage.memberships',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units-storage/memberships',
        'permissionsRequired' : ['acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/acquisitions-units-storage/memberships',
        'permissionsRequired' : ['acquisitions-units-storage.memberships.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/acquisitions-units-storage/memberships/{id}',
        'permissionsRequired' : ['acquisitions-units-storage.memberships.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/acquisitions-units-storage/memberships/{id}',
        'permissionsRequired' : ['acquisitions-units-storage.memberships.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/acquisitions-units-storage/memberships/{id}',
        'permissionsRequired' : ['acquisitions-units-storage.memberships.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'orders-storage.alerts.collection.get',
      'displayName' : 'alert-collection get',
      'description' : 'Get a collection of alerts'
    }, {
      'permissionName' : 'orders-storage.alerts.item.post',
      'displayName' : 'alert-item post',
      'description' : 'Create a new alert'
    }, {
      'permissionName' : 'orders-storage.alerts.item.get',
      'displayName' : 'alert-item get',
      'description' : 'Fetch an alert'
    }, {
      'permissionName' : 'orders-storage.alerts.item.put',
      'displayName' : 'alert-item put',
      'description' : 'Update an alert'
    }, {
      'permissionName' : 'orders-storage.alerts.item.delete',
      'displayName' : 'alert-item delete',
      'description' : 'Delete an alert'
    }, {
      'permissionName' : 'orders-storage.alerts.all',
      'displayName' : 'All alert perms',
      'description' : 'All permissions for the alert',
      'subPermissions' : ['orders-storage.alerts.collection.get', 'orders-storage.alerts.item.post', 'orders-storage.alerts.item.get', 'orders-storage.alerts.item.put', 'orders-storage.alerts.item.delete']
    }, {
      'permissionName' : 'orders-storage.pieces.collection.get',
      'displayName' : 'orders-storage.pieces-collection get',
      'description' : 'Get a collection of pieces'
    }, {
      'permissionName' : 'orders-storage.pieces.item.post',
      'displayName' : 'orders-storage.pieces-item post',
      'description' : 'Create a new pieces'
    }, {
      'permissionName' : 'orders-storage.pieces.item.get',
      'displayName' : 'orders-storage.pieces-item get',
      'description' : 'Fetch a piece'
    }, {
      'permissionName' : 'orders-storage.pieces.item.put',
      'displayName' : 'orders-storage.pieces-item put',
      'description' : 'Update a piece'
    }, {
      'permissionName' : 'orders-storage.pieces.item.delete',
      'displayName' : 'orders-storage.pieces-item delete',
      'description' : 'Delete a piece'
    }, {
      'permissionName' : 'orders-storage.pieces.all',
      'displayName' : 'All orders-storage pieces perms',
      'description' : 'All permissions for the orders-storage-pieces',
      'subPermissions' : ['orders-storage.pieces.collection.get', 'orders-storage.pieces.item.post', 'orders-storage.pieces.item.get', 'orders-storage.pieces.item.put', 'orders-storage.pieces.item.delete']
    }, {
      'permissionName' : 'orders-storage.titles.collection.get',
      'displayName' : 'orders-storage.titles-collection get',
      'description' : 'Get a collection of titles'
    }, {
      'permissionName' : 'orders-storage.titles.item.post',
      'displayName' : 'orders-storage.titles-item post',
      'description' : 'Create a new title'
    }, {
      'permissionName' : 'orders-storage.titles.item.get',
      'displayName' : 'orders-storage.titles-item get',
      'description' : 'Fetch a title'
    }, {
      'permissionName' : 'orders-storage.titles.item.put',
      'displayName' : 'orders-storage.titles-item put',
      'description' : 'Update a title'
    }, {
      'permissionName' : 'orders-storage.titles.item.delete',
      'displayName' : 'orders-storage.titles-item delete',
      'description' : 'Delete a title'
    }, {
      'permissionName' : 'orders-storage.titles.all',
      'displayName' : 'All orders-storage titles perms',
      'description' : 'All permissions for the orders-storage-titles',
      'subPermissions' : ['orders-storage.titles.collection.get', 'orders-storage.titles.item.post', 'orders-storage.titles.item.get', 'orders-storage.titles.item.put', 'orders-storage.titles.item.delete']
    }, {
      'permissionName' : 'orders-storage.po-lines.collection.get',
      'displayName' : 'po-line-collection get',
      'description' : 'Get a collection of po-lines'
    }, {
      'permissionName' : 'orders-storage.po-lines.item.post',
      'displayName' : 'po-line-item post',
      'description' : 'Create a new po-line'
    }, {
      'permissionName' : 'orders-storage.po-lines.item.get',
      'displayName' : 'po-line-item get',
      'description' : 'Fetch a po-line'
    }, {
      'permissionName' : 'orders-storage.po-lines.item.put',
      'displayName' : 'po-line-item put',
      'description' : 'Update a purchase order line'
    }, {
      'permissionName' : 'orders-storage.po-lines.item.delete',
      'displayName' : 'po-line-item delete',
      'description' : 'Delete a po line'
    }, {
      'permissionName' : 'orders-storage.po-lines.all',
      'displayName' : 'All po line perms',
      'description' : 'All permissions for the po line',
      'subPermissions' : ['orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.post', 'orders-storage.po-lines.item.get', 'orders-storage.po-lines.item.put', 'orders-storage.po-lines.item.delete']
    }, {
      'permissionName' : 'orders-storage.purchase-orders.collection.get',
      'displayName' : 'purchase-order-collection get',
      'description' : 'Get a collection of purchase orders'
    }, {
      'permissionName' : 'orders-storage.purchase-orders.item.post',
      'displayName' : 'purchase-order-item post',
      'description' : 'Create a new purchase-order'
    }, {
      'permissionName' : 'orders-storage.purchase-orders.item.get',
      'displayName' : 'purchase-order-item get',
      'description' : 'Fetch a purchase-order'
    }, {
      'permissionName' : 'orders-storage.purchase-orders.item.put',
      'displayName' : 'purchase-order-item put',
      'description' : 'Update a purchase order'
    }, {
      'permissionName' : 'orders-storage.purchase-orders.item.delete',
      'displayName' : 'purchase-order-item delete',
      'description' : 'Delete a purchase order'
    }, {
      'permissionName' : 'orders-storage.purchase-orders.all',
      'displayName' : 'All purchase order perms',
      'description' : 'All permissions for the purchase order',
      'subPermissions' : ['orders-storage.purchase-orders.collection.get', 'orders-storage.purchase-orders.item.post', 'orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.put', 'orders-storage.purchase-orders.item.delete']
    }, {
      'permissionName' : 'orders-storage.receiving-history.collection.get',
      'displayName' : 'orders-storage.receiving-history-collection get',
      'description' : 'Get a collection of receiving-history'
    }, {
      'permissionName' : 'orders-storage.receiving-history.all',
      'displayName' : 'All orders-storage receiving-history perms',
      'description' : 'All permissions for the orders-storage-receiving-history',
      'subPermissions' : ['orders-storage.receiving-history.collection.get']
    }, {
      'permissionName' : 'orders-storage.reporting-codes.collection.get',
      'displayName' : 'reporting-code-collection get',
      'description' : 'Get a collection of reporting-codes'
    }, {
      'permissionName' : 'orders-storage.reporting-codes.item.post',
      'displayName' : 'reporting-code-item post',
      'description' : 'Create a new reporting-code'
    }, {
      'permissionName' : 'orders-storage.reporting-codes.item.get',
      'displayName' : 'reporting-code-item get',
      'description' : 'Fetch a reporting-code'
    }, {
      'permissionName' : 'orders-storage.reporting-codes.item.put',
      'displayName' : 'reporting-code-item put',
      'description' : 'Update a reporting-code'
    }, {
      'permissionName' : 'orders-storage.reporting-codes.item.delete',
      'displayName' : 'reporting_code-item delete',
      'description' : 'Delete a reporting-code'
    }, {
      'permissionName' : 'orders-storage.reporting-codes.all',
      'displayName' : 'All reporting_code perms',
      'description' : 'All permissions for the reporting-code',
      'subPermissions' : ['orders-storage.reporting-codes.collection.get', 'orders-storage.reporting-codes.item.post', 'orders-storage.reporting-codes.item.get', 'orders-storage.reporting-codes.item.put', 'orders-storage.reporting-codes.item.delete']
    }, {
      'permissionName' : 'orders-storage.po-number.get',
      'displayName' : 'po-number get',
      'description' : 'Get a generated PO number'
    }, {
      'permissionName' : 'orders-storage.po-number.all',
      'displayName' : 'All po-number perms',
      'description' : 'All permissions for the PO number',
      'subPermissions' : ['orders-storage.po-number.get']
    }, {
      'permissionName' : 'orders-storage.po-line-number.get',
      'displayName' : 'po-line-number get',
      'description' : 'Get a POLine number'
    }, {
      'permissionName' : 'orders-storage.po-line-number.all',
      'displayName' : 'All po-line-number perms',
      'description' : 'All permissions for the POLine number',
      'subPermissions' : ['orders-storage.po-line-number.get']
    }, {
      'permissionName' : 'orders-storage.order-invoice-relationships.collection.get',
      'displayName' : 'order-invoice-relationships-collection get',
      'description' : 'Get a collection of order-invoice-relationship'
    }, {
      'permissionName' : 'orders-storage.order-invoice-relationships.item.post',
      'displayName' : 'order-invoice-relationships post',
      'description' : 'Create a new relationship between order and invoice'
    }, {
      'permissionName' : 'orders-storage.order-invoice-relationships.item.get',
      'displayName' : 'order-invoice-relationships-item get',
      'description' : 'Fetch an order-invoice-relationship'
    }, {
      'permissionName' : 'orders-storage.order-invoice-relationships.item.put',
      'displayName' : 'order-invoice-relationships-item put',
      'description' : 'Update an order-invoice-relationship'
    }, {
      'permissionName' : 'orders-storage.order-invoice-relationships.item.delete',
      'displayName' : 'order-invoice-relationships-item delete',
      'description' : 'Delete an order-invoice-relationship'
    }, {
      'permissionName' : 'orders-storage.order-invoice-relationships.all',
      'displayName' : 'All order-invoice-relationships perms',
      'description' : 'All permissions for the order-invoice-relationship',
      'subPermissions' : ['orders-storage.order-invoice-relationships.collection.get', 'orders-storage.order-invoice-relationships.item.post', 'orders-storage.order-invoice-relationships.item.get', 'orders-storage.order-invoice-relationships.item.put', 'orders-storage.order-invoice-relationships.item.delete']
    }, {
      'permissionName' : 'orders-storage.order-templates.collection.get',
      'displayName' : 'order-order-templates-collection get',
      'description' : 'Get a collection of order templates'
    }, {
      'permissionName' : 'orders-storage.order-templates.item.post',
      'displayName' : 'order-templates post',
      'description' : 'Create a new order template'
    }, {
      'permissionName' : 'orders-storage.order-templates.item.get',
      'displayName' : 'order-templates-item get',
      'description' : 'Fetch an order templates'
    }, {
      'permissionName' : 'orders-storage.order-templates.item.put',
      'displayName' : 'order-templates-item put',
      'description' : 'Update an order template'
    }, {
      'permissionName' : 'orders-storage.order-templates.item.delete',
      'displayName' : 'order-templates-item delete',
      'description' : 'Delete an order template'
    }, {
      'permissionName' : 'orders-storage.order-templates.all',
      'displayName' : 'All order-templates perms',
      'description' : 'All permissions for the order-templates',
      'subPermissions' : ['orders-storage.order-templates.collection.get', 'orders-storage.order-templates.item.post', 'orders-storage.order-templates.item.get', 'orders-storage.order-templates.item.put', 'orders-storage.order-templates.item.delete']
    }, {
      'permissionName' : 'acquisitions-units-storage.units.collection.get',
      'displayName' : 'acquisitions-units-collection get',
      'description' : 'Get a collection of acquisitions units'
    }, {
      'permissionName' : 'acquisitions-units-storage.units.item.post',
      'displayName' : 'acquisitions-units-item post',
      'description' : 'Create a new acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units-storage.units.item.get',
      'displayName' : 'acquisitions-units-item get',
      'description' : 'Fetch an acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units-storage.units.item.put',
      'displayName' : 'acquisitions-units-item put',
      'description' : 'Update an acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units-storage.units.item.delete',
      'displayName' : 'acquisitions-units-item delete',
      'description' : 'Delete an acquisitions unit'
    }, {
      'permissionName' : 'acquisitions-units-storage.units.all',
      'displayName' : 'All acquisitions-units perms',
      'description' : 'All permissions for the acquisitions-units',
      'subPermissions' : ['acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.units.item.post', 'acquisitions-units-storage.units.item.get', 'acquisitions-units-storage.units.item.put', 'acquisitions-units-storage.units.item.delete']
    }, {
      'permissionName' : 'acquisitions-units-storage.memberships.collection.get',
      'displayName' : 'acquisitions-units-memberships-collection get',
      'description' : 'Get a collection of acquisitions units memberships'
    }, {
      'permissionName' : 'acquisitions-units-storage.memberships.item.post',
      'displayName' : 'acquisitions-units-memberships-item post',
      'description' : 'Create a new acquisitions unit membership'
    }, {
      'permissionName' : 'acquisitions-units-storage.memberships.item.get',
      'displayName' : 'acquisitions-units-memberships-item get',
      'description' : 'Fetch an acquisitions unit membership'
    }, {
      'permissionName' : 'acquisitions-units-storage.memberships.item.put',
      'displayName' : 'acquisitions-units-memberships-item put',
      'description' : 'Update an acquisitions unit membership'
    }, {
      'permissionName' : 'acquisitions-units-storage.memberships.item.delete',
      'displayName' : 'acquisitions-units-memberships-item delete',
      'description' : 'Delete an acquisitions unit membership'
    }, {
      'permissionName' : 'acquisitions-units-storage.memberships.all',
      'displayName' : 'All acquisitions-units-memberships perms',
      'description' : 'All permissions for the acquisitions-units memberships',
      'subPermissions' : ['acquisitions-units-storage.memberships.collection.get', 'acquisitions-units-storage.memberships.item.post', 'acquisitions-units-storage.memberships.item.get', 'acquisitions-units-storage.memberships.item.put', 'acquisitions-units-storage.memberships.item.delete']
    }, {
      'permissionName' : 'orders-storage.module.all',
      'displayName' : 'All orders-storage-module perms',
      'description' : 'All permissions for the orders-storage module',
      'subPermissions' : ['orders-storage.alerts.all', 'orders-storage.pieces.all', 'orders-storage.titles.all', 'orders-storage.po-lines.all', 'orders-storage.po-number.all', 'orders-storage.po-line-number.all', 'orders-storage.purchase-orders.all', 'orders-storage.receiving-history.all', 'orders-storage.reporting-codes.all', 'orders-storage.order-invoice-relationships.all', 'orders-storage.order-templates.all', 'acquisitions-units-storage.units.all', 'acquisitions-units-storage.memberships.all']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-orders-storage:10.0.0-SNAPSHOT.157',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-organizations-storage-2.3.0-SNAPSHOT.34',
    'name' : 'Organizations CRUD module',
    'provides' : [{
      'id' : 'organizations-storage.addresses',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/addresses',
        'permissionsRequired' : ['organizations-storage.addresses.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/addresses',
        'permissionsRequired' : ['organizations-storage.addresses.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/addresses/{id}',
        'permissionsRequired' : ['organizations-storage.addresses.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/addresses/{id}',
        'permissionsRequired' : ['organizations-storage.addresses.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/addresses/{id}',
        'permissionsRequired' : ['organizations-storage.addresses.item.delete']
      }]
    }, {
      'id' : 'organizations-storage.categories',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/categories',
        'permissionsRequired' : ['organizations-storage.categories.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/categories',
        'permissionsRequired' : ['organizations-storage.categories.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/categories/{id}',
        'permissionsRequired' : ['organizations-storage.categories.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/categories/{id}',
        'permissionsRequired' : ['organizations-storage.categories.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/categories/{id}',
        'permissionsRequired' : ['organizations-storage.categories.item.delete']
      }]
    }, {
      'id' : 'organizations-storage.contacts',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/contacts',
        'permissionsRequired' : ['organizations-storage.contacts.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/contacts',
        'permissionsRequired' : ['organizations-storage.contacts.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/contacts/{id}',
        'permissionsRequired' : ['organizations-storage.contacts.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/contacts/{id}',
        'permissionsRequired' : ['organizations-storage.contacts.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/contacts/{id}',
        'permissionsRequired' : ['organizations-storage.contacts.item.delete']
      }]
    }, {
      'id' : 'organizations-storage.emails',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/emails',
        'permissionsRequired' : ['organizations-storage.emails.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/emails',
        'permissionsRequired' : ['organizations-storage.emails.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/emails/{id}',
        'permissionsRequired' : ['organizations-storage.emails.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/emails/{id}',
        'permissionsRequired' : ['organizations-storage.emails.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/emails/{id}',
        'permissionsRequired' : ['organizations-storage.emails.item.delete']
      }]
    }, {
      'id' : 'organizations-storage.interfaces',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/interfaces',
        'permissionsRequired' : ['organizations-storage.interfaces.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/interfaces',
        'permissionsRequired' : ['organizations-storage.interfaces.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/interfaces/{id}',
        'permissionsRequired' : ['organizations-storage.interfaces.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/interfaces/{id}',
        'permissionsRequired' : ['organizations-storage.interfaces.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/interfaces/{id}',
        'permissionsRequired' : ['organizations-storage.interfaces.item.delete']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/interfaces/{id}/credentials',
        'permissionsRequired' : ['organizations-storage.interfaces.credentials.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/interfaces/{id}/credentials',
        'permissionsRequired' : ['organizations-storage.interfaces.credentials.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/interfaces/{id}/credentials',
        'permissionsRequired' : ['organizations-storage.interfaces.credentials.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/interfaces/{id}/credentials',
        'permissionsRequired' : ['organizations-storage.interfaces.credentials.item.delete']
      }]
    }, {
      'id' : 'organizations-storage.phone-numbers',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/phone-numbers',
        'permissionsRequired' : ['organizations-storage.phone-numbers.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/phone-numbers',
        'permissionsRequired' : ['organizations-storage.phone-numbers.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/phone-numbers/{id}',
        'permissionsRequired' : ['organizations-storage.phone-numbers.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/phone-numbers/{id}',
        'permissionsRequired' : ['organizations-storage.phone-numbers.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/phone-numbers/{id}',
        'permissionsRequired' : ['organizations-storage.phone-numbers.item.delete']
      }]
    }, {
      'id' : 'organizations-storage.urls',
      'version' : '1.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/urls',
        'permissionsRequired' : ['organizations-storage.urls.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/urls',
        'permissionsRequired' : ['organizations-storage.urls.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/urls/{id}',
        'permissionsRequired' : ['organizations-storage.urls.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/urls/{id}',
        'permissionsRequired' : ['organizations-storage.urls.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/urls/{id}',
        'permissionsRequired' : ['organizations-storage.urls.item.delete']
      }]
    }, {
      'id' : 'organizations-storage.organizations',
      'version' : '2.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/organizations',
        'permissionsRequired' : ['organizations-storage.organizations.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/organizations-storage/organizations',
        'permissionsRequired' : ['organizations-storage.organizations.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/organizations-storage/organizations/{organizations_id}',
        'permissionsRequired' : ['organizations-storage.organizations.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/organizations-storage/organizations/{organizations_id}',
        'permissionsRequired' : ['organizations-storage.organizations.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/organizations-storage/organizations/{organizations_id}',
        'permissionsRequired' : ['organizations-storage.organizations.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'organizations-storage.addresses.collection.get',
      'displayName' : 'address collection get',
      'description' : 'Get a collection of addresses'
    }, {
      'permissionName' : 'organizations-storage.addresses.item.post',
      'displayName' : 'address post',
      'description' : 'Create a new address'
    }, {
      'permissionName' : 'organizations-storage.addresses.item.get',
      'displayName' : 'address get',
      'description' : 'Fetch a address'
    }, {
      'permissionName' : 'organizations-storage.addresses.item.put',
      'displayName' : 'address put',
      'description' : 'Update a address'
    }, {
      'permissionName' : 'organizations-storage.addresses.item.delete',
      'displayName' : 'address delete',
      'description' : 'Delete a address'
    }, {
      'permissionName' : 'organizations-storage.addresses.all',
      'displayName' : 'address all',
      'description' : 'All permissions for address',
      'subPermissions' : ['organizations-storage.addresses.collection.get', 'organizations-storage.addresses.item.post', 'organizations-storage.addresses.item.get', 'organizations-storage.addresses.item.put', 'organizations-storage.addresses.item.delete']
    }, {
      'permissionName' : 'organizations-storage.categories.collection.get',
      'displayName' : 'category collection get',
      'description' : 'Get a collection of categories'
    }, {
      'permissionName' : 'organizations-storage.categories.item.post',
      'displayName' : 'category post',
      'description' : 'Create a new category'
    }, {
      'permissionName' : 'organizations-storage.categories.item.get',
      'displayName' : 'category get',
      'description' : 'Fetch a category'
    }, {
      'permissionName' : 'organizations-storage.categories.item.put',
      'displayName' : 'category put',
      'description' : 'Update a category'
    }, {
      'permissionName' : 'organizations-storage.categories.item.delete',
      'displayName' : 'category delete',
      'description' : 'Delete a category'
    }, {
      'permissionName' : 'organizations-storage.categories.all',
      'displayName' : 'category all',
      'description' : 'All permissions for category',
      'subPermissions' : ['organizations-storage.categories.collection.get', 'organizations-storage.categories.item.post', 'organizations-storage.categories.item.get', 'organizations-storage.categories.item.put', 'organizations-storage.categories.item.delete']
    }, {
      'permissionName' : 'organizations-storage.contacts.collection.get',
      'displayName' : 'contact collection get',
      'description' : 'Get a collection of contacts'
    }, {
      'permissionName' : 'organizations-storage.contacts.item.post',
      'displayName' : 'contact post',
      'description' : 'Create a new contact'
    }, {
      'permissionName' : 'organizations-storage.contacts.item.get',
      'displayName' : 'contact get',
      'description' : 'Fetch a contact'
    }, {
      'permissionName' : 'organizations-storage.contacts.item.put',
      'displayName' : 'contact put',
      'description' : 'Update a contact'
    }, {
      'permissionName' : 'organizations-storage.contacts.item.delete',
      'displayName' : 'contact delete',
      'description' : 'Delete a contact'
    }, {
      'permissionName' : 'organizations-storage.contacts.all',
      'displayName' : 'contact all',
      'description' : 'All permissions for contact',
      'subPermissions' : ['organizations-storage.contacts.collection.get', 'organizations-storage.contacts.item.post', 'organizations-storage.contacts.item.get', 'organizations-storage.contacts.item.put', 'organizations-storage.contacts.item.delete']
    }, {
      'permissionName' : 'organizations-storage.emails.collection.get',
      'displayName' : 'email collection get',
      'description' : 'Get a collection of emails'
    }, {
      'permissionName' : 'organizations-storage.emails.item.post',
      'displayName' : 'email post',
      'description' : 'Create a new email'
    }, {
      'permissionName' : 'organizations-storage.emails.item.get',
      'displayName' : 'email get',
      'description' : 'Fetch a email'
    }, {
      'permissionName' : 'organizations-storage.emails.item.put',
      'displayName' : 'email put',
      'description' : 'Update a email'
    }, {
      'permissionName' : 'organizations-storage.emails.item.delete',
      'displayName' : 'email delete',
      'description' : 'Delete a email'
    }, {
      'permissionName' : 'organizations-storage.emails.all',
      'displayName' : 'email all',
      'description' : 'All permissions for email',
      'subPermissions' : ['organizations-storage.emails.collection.get', 'organizations-storage.emails.item.post', 'organizations-storage.emails.item.get', 'organizations-storage.emails.item.put', 'organizations-storage.emails.item.delete']
    }, {
      'permissionName' : 'organizations-storage.interfaces.collection.get',
      'displayName' : 'interface collection get',
      'description' : 'Get a collection of interface'
    }, {
      'permissionName' : 'organizations-storage.interfaces.item.post',
      'displayName' : 'interface post',
      'description' : 'Create a new interface'
    }, {
      'permissionName' : 'organizations-storage.interfaces.item.get',
      'displayName' : 'interface get',
      'description' : 'Fetch a interface'
    }, {
      'permissionName' : 'organizations-storage.interfaces.item.put',
      'displayName' : 'interface put',
      'description' : 'Update a interface'
    }, {
      'permissionName' : 'organizations-storage.interfaces.item.delete',
      'displayName' : 'interface delete',
      'description' : 'Delete a interface'
    }, {
      'permissionName' : 'organizations-storage.interfaces.all',
      'displayName' : 'interface all',
      'description' : 'All permissions for interface',
      'subPermissions' : ['organizations-storage.interfaces.collection.get', 'organizations-storage.interfaces.item.post', 'organizations-storage.interfaces.item.get', 'organizations-storage.interfaces.item.put', 'organizations-storage.interfaces.item.delete']
    }, {
      'permissionName' : 'organizations-storage.interfaces.credentials.item.post',
      'displayName' : 'interface credentials post',
      'description' : 'Create a new interface credentials'
    }, {
      'permissionName' : 'organizations-storage.interfaces.credentials.item.get',
      'displayName' : 'interface credentials get',
      'description' : 'Fetch an interface credentials'
    }, {
      'permissionName' : 'organizations-storage.interfaces.credentials.item.put',
      'displayName' : 'interface credentials put',
      'description' : 'Update an interface credentials'
    }, {
      'permissionName' : 'organizations-storage.interfaces.credentials.item.delete',
      'displayName' : 'interface credentials delete',
      'description' : 'Delete an interface credentials'
    }, {
      'permissionName' : 'organizations-storage.interfaces.credentials.all',
      'displayName' : 'interface credentials all',
      'description' : 'All permissions for interface credentials',
      'subPermissions' : ['organizations-storage.interfaces.credentials.item.post', 'organizations-storage.interfaces.credentials.item.get', 'organizations-storage.interfaces.credentials.item.put', 'organizations-storage.interfaces.credentials.item.delete']
    }, {
      'permissionName' : 'organizations-storage.phone-numbers.collection.get',
      'displayName' : 'phone_number collection get',
      'description' : 'Get a collection of phone_numbers'
    }, {
      'permissionName' : 'organizations-storage.phone-numbers.item.post',
      'displayName' : 'phone_number post',
      'description' : 'Create a new phone_number'
    }, {
      'permissionName' : 'organizations-storage.phone-numbers.item.get',
      'displayName' : 'phone_number get',
      'description' : 'Fetch a phone_number'
    }, {
      'permissionName' : 'organizations-storage.phone-numbers.item.put',
      'displayName' : 'phone_number put',
      'description' : 'Update a phone_number'
    }, {
      'permissionName' : 'organizations-storage.phone-numbers.item.delete',
      'displayName' : 'phone_number delete',
      'description' : 'Delete a phone_number'
    }, {
      'permissionName' : 'organizations-storage.phone-numbers.all',
      'displayName' : 'phone_number all',
      'description' : 'All permissions for phone_number',
      'subPermissions' : ['organizations-storage.phone-numbers.collection.get', 'organizations-storage.phone-numbers.item.post', 'organizations-storage.phone-numbers.item.get', 'organizations-storage.phone-numbers.item.put', 'organizations-storage.phone-numbers.item.delete']
    }, {
      'permissionName' : 'organizations-storage.urls.collection.get',
      'displayName' : 'url collection get',
      'description' : 'Get a collection of urls'
    }, {
      'permissionName' : 'organizations-storage.urls.item.post',
      'displayName' : 'url post',
      'description' : 'Create a new url'
    }, {
      'permissionName' : 'organizations-storage.urls.item.get',
      'displayName' : 'url get',
      'description' : 'Fetch a url'
    }, {
      'permissionName' : 'organizations-storage.urls.item.put',
      'displayName' : 'url put',
      'description' : 'Update a url'
    }, {
      'permissionName' : 'organizations-storage.urls.item.delete',
      'displayName' : 'url delete',
      'description' : 'Delete a url'
    }, {
      'permissionName' : 'organizations-storage.urls.all',
      'displayName' : 'url all',
      'description' : 'All permissions for url',
      'subPermissions' : ['organizations-storage.urls.collection.get', 'organizations-storage.urls.item.post', 'organizations-storage.urls.item.get', 'organizations-storage.urls.item.put', 'organizations-storage.urls.item.delete']
    }, {
      'permissionName' : 'organizations-storage.organizations.collection.get',
      'displayName' : 'organizations collection get',
      'description' : 'Get a collection of organizations'
    }, {
      'permissionName' : 'organizations-storage.organizations.item.post',
      'displayName' : 'organizations post',
      'description' : 'Create a new organizations'
    }, {
      'permissionName' : 'organizations-storage.organizations.item.get',
      'displayName' : 'organizations get',
      'description' : 'Fetch a organizations'
    }, {
      'permissionName' : 'organizations-storage.organizations.item.put',
      'displayName' : 'organizations put',
      'description' : 'Update a organizations'
    }, {
      'permissionName' : 'organizations-storage.organizations.item.delete',
      'displayName' : 'organizations delete',
      'description' : 'Delete a organizations'
    }, {
      'permissionName' : 'organizations-storage.organizations.all',
      'displayName' : 'organizations all',
      'description' : 'All permissions for organizations',
      'subPermissions' : ['organizations-storage.organizations.collection.get', 'organizations-storage.organizations.item.post', 'organizations-storage.organizations.item.get', 'organizations-storage.organizations.item.put', 'organizations-storage.organizations.item.delete']
    }, {
      'permissionName' : 'organizations-storage.module.all',
      'displayName' : 'organizations-storage-module all',
      'description' : 'All permissions for the organizations module',
      'subPermissions' : ['organizations-storage.addresses.all', 'organizations-storage.categories.all', 'organizations-storage.contacts.all', 'organizations-storage.emails.all', 'organizations-storage.interfaces.all', 'organizations-storage.interfaces.credentials.all', 'organizations-storage.phone-numbers.all', 'organizations-storage.urls.all', 'organizations-storage.organizations.all']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-organizations-storage:2.3.0-SNAPSHOT.34',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-password-validator-1.6.0-SNAPSHOT.14',
    'name' : 'Password Validator Module',
    'requires' : [{
      'id' : 'users',
      'version' : '15.0'
    }],
    'provides' : [{
      'id' : 'password-validator',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/password/validate',
        'permissionsRequired' : ['validation.validate.post'],
        'modulePermissions' : ['login.password.validate', 'users.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/tenant/rules',
        'permissionsRequired' : ['validation.rules.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/tenant/rules',
        'permissionsRequired' : ['validation.rules.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/tenant/rules',
        'permissionsRequired' : ['validation.rules.item.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/tenant/rules/{ruleId}',
        'permissionsRequired' : [' validation.rules.item.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'validation.rules.collection.get',
      'displayName' : 'get validation rules collection',
      'description' : 'Get a list of validators'
    }, {
      'permissionName' : 'validation.validate.post',
      'displayName' : 'validate password post',
      'description' : 'Validate a password'
    }, {
      'permissionName' : 'validation.rules.item.post',
      'displayName' : 'create validation rule',
      'description' : 'Add a new rule'
    }, {
      'permissionName' : 'validation.rules.item.put',
      'displayName' : 'modify validation rule',
      'description' : 'Modify the rule info'
    }, {
      'permissionName' : 'validation.rules.item.get',
      'displayName' : 'get validation rule',
      'description' : 'Get a rule by id'
    }, {
      'permissionName' : 'validation.all',
      'displayName' : 'password validator module - all permissions',
      'description' : 'All permissions for password validation',
      'subPermissions' : ['validation.rules.collection.get', 'validation.validate.post', 'validation.rules.item.post', 'validation.rules.item.put', 'validation.rules.item.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-password-validator:1.6.0-SNAPSHOT.14',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-patron-4.1.0-SNAPSHOT.54',
    'name' : 'Patron Services Module',
    'requires' : [{
      'id' : 'users',
      'version' : '15.0'
    }, {
      'id' : 'circulation',
      'version' : '8.0 9.0'
    }, {
      'id' : 'feesfines',
      'version' : '14.0 15.0'
    }, {
      'id' : 'inventory',
      'version' : '5.2 6.0 7.0 8.0 9.0 10.0'
    }, {
      'id' : 'holdings-storage',
      'version' : '1.2 2.0 3.0 4.0'
    }],
    'provides' : [{
      'id' : 'patron',
      'version' : '4.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/patron/account/{accountId}',
        'permissionsRequired' : ['patron.account.item.get'],
        'modulePermissions' : ['users.item.get', 'circulation.loans.collection.get', 'circulation.requests.collection.get', 'accounts.collection.get', 'inventory.items.item.get', 'inventory-storage.items.collection.get', 'inventory-storage.holdings.item.get', 'inventory.instances.item.get', 'feefines.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/patron/account/{accountId}/item/{itemId}/renew',
        'permissionsRequired' : ['patron.renew.item.post'],
        'modulePermissions' : ['circulation.renew-by-id.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/patron/account/{accountId}/item/{itemId}/hold',
        'permissionsRequired' : ['patron.hold.item.post'],
        'modulePermissions' : ['circulation.requests.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/patron/account/{accountId}/instance/{instanceId}/hold',
        'permissionsRequired' : ['patron.hold.instance.item.post'],
        'modulePermissions' : ['circulation.requests.instances.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/patron/account/{accountId}/hold/{holdId}/cancel',
        'permissionsRequired' : ['patron.hold.cancel.item.post'],
        'modulePermissions' : ['circulation.requests.item.put', 'circulation.requests.item.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'patron.account.item.get',
      'displayName' : 'patron - get account details',
      'description' : 'Get user account details'
    }, {
      'permissionName' : 'patron.renew.item.post',
      'displayName' : 'patron - renew a loan',
      'description' : 'Renew a loan for this patron'
    }, {
      'permissionName' : 'patron.hold.item.post',
      'displayName' : 'patron - create a hold',
      'description' : 'Creates a hold on the specified item for this patron'
    }, {
      'permissionName' : 'patron.hold.instance.item.post',
      'displayName' : 'patron - create an instance level hold',
      'description' : 'Creates a hold on an item from the specified instance for this patron'
    }, {
      'permissionName' : 'patron.hold.cancel.item.post',
      'displayName' : 'patron - remove a hold',
      'description' : 'Removes the specified hold'
    }, {
      'permissionName' : 'patron.all',
      'displayName' : 'patron - all permissions',
      'description' : 'Entire set of permissions needed to use patron',
      'subPermissions' : ['patron.account.item.get', 'patron.renew.item.post', 'patron.hold.item.post', 'patron.hold.instance.item.post', 'patron.hold.cancel.item.post']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-patron:4.1.0-SNAPSHOT.54',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-permissions-5.10.0-SNAPSHOT.69',
    'name' : 'permissions',
    'provides' : [{
      'id' : 'permissions',
      'version' : '5.2',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/perms/users*',
        'permissionsRequired' : ['perms.users.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/perms/users*',
        'permissionsRequired' : ['perms.users.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/perms/users/{id}',
        'permissionsRequired' : ['perms.users.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/perms/users/{id}',
        'permissionsRequired' : ['perms.users.item.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/perms/users/{id}/permissions/{perm}',
        'permissionsRequired' : ['perms.users.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/perms/permissions',
        'permissionsRequired' : ['perms.permissions.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/perms/permissions/{id}',
        'permissionsRequired' : ['perms.permissions.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/perms/permissions/{id}',
        'permissionsRequired' : ['perms.permissions.item.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/perms/permissions',
        'permissionsRequired' : ['perms.permissions.item.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/perms/permissions/{id}',
        'permissionsRequired' : ['perms.permissions.item.delete ']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }, {
      'id' : '_tenantPermissions',
      'version' : '1.0',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenantpermissions'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'perms.users.get',
      'displayName' : 'permission users read',
      'description' : 'Read or list permissions user(s)'
    }, {
      'permissionName' : 'perms.users.item.post',
      'displayName' : 'permission users item create',
      'description' : 'Add a new permissions user'
    }, {
      'permissionName' : 'perms.users.item.put',
      'displayName' : 'permission users item modify',
      'description' : 'Modify a permissions user'
    }, {
      'permissionName' : 'perms.users.item.delete',
      'displayName' : 'permission users item delete',
      'description' : 'Remove a permissions user or remove permissions from a user'
    }, {
      'permissionName' : 'perms.permissions.get',
      'displayName' : 'permission read',
      'description' : 'Read or list permissions'
    }, {
      'permissionName' : 'perms.permissions.item.post',
      'displayName' : 'permission item create',
      'description' : 'Add a new permission'
    }, {
      'permissionName' : 'perms.permissions.item.put',
      'displayName' : 'permission item modify',
      'description' : 'Modify a permission'
    }, {
      'permissionName' : 'perms.permissions.item.delete',
      'displayName' : 'permission item delete',
      'description' : 'Remove a permission'
    }, {
      'permissionName' : 'perms.permissions',
      'displayName' : 'permissions',
      'description' : 'All permissions for permission objects',
      'subPermissions' : ['perms.permissions.get', 'perms.permissions.item.post', 'perms.permissions.item.put', 'perms.permissions.item.delete']
    }, {
      'permissionName' : 'perms.users',
      'displayName' : 'permission users',
      'description' : 'All permissions for permission user objects',
      'subPermissions' : ['perms.users.get', 'perms.users.item.post', 'perms.users.item.put', 'perms.users.item.delete']
    }, {
      'permissionName' : 'perms.all',
      'displayName' : 'perms all',
      'description' : 'All permissions for the permissions module',
      'subPermissions' : ['perms.users', 'perms.permissions']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-permissions:5.10.0-SNAPSHOT.69',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 715827883
        }
      }
    }
  }, {
    'id' : 'mod-pubsub-1.1.0-SNAPSHOT.44',
    'name' : 'Pubsub',
    'requires' : [],
    'provides' : [{
      'id' : 'pubsub-event-types',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/pubsub/event-types',
        'permissionsRequired' : ['pubsub.event-types.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/pubsub/event-types',
        'permissionsRequired' : ['pubsub.event-types.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/pubsub/event-types/{eventTypeName}',
        'permissionsRequired' : ['pubsub.event-types.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/pubsub/event-types/{eventTypeName}',
        'permissionsRequired' : ['pubsub.event-types.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/pubsub/event-types/{eventTypeName}',
        'permissionsRequired' : ['pubsub.event-types.delete']
      }]
    }, {
      'id' : 'pubsub-publishers',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/pubsub/event-types/declare/publisher',
        'permissionsRequired' : ['pubsub.publishers.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/pubsub/event-types/{eventTypeName}/publishers',
        'permissionsRequired' : ['pubsub.publishers.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/pubsub/event-types/{eventTypeName}/publishers',
        'permissionsRequired' : ['pubsub.publishers.get']
      }]
    }, {
      'id' : 'pubsub-subscribers',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/pubsub/event-types/declare/subscriber',
        'permissionsRequired' : ['pubsub.subscribers.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/pubsub/event-types/{eventTypeName}/subscribers',
        'permissionsRequired' : ['pubsub.subscribers.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/pubsub/event-types/{eventTypeName}/subscribers',
        'permissionsRequired' : ['pubsub.subscribers.get']
      }]
    }, {
      'id' : 'pubsub-audit',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/pubsub/history',
        'permissionsRequired' : ['pubsub.audit.history.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/pubsub/audit-messages/{eventId}/payload',
        'permissionsRequired' : ['pubsub.audit.message.payload.get']
      }]
    }, {
      'id' : 'pubsub-publish',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/pubsub/publish',
        'permissionsRequired' : ['pubsub.publish.post']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant',
        'modulePermissions' : ['users.collection.get', 'users.item.post', 'login.item.post', 'perms.users.item.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'pubsub.event-types.get',
      'displayName' : 'PubSub - get Event Descriptor',
      'description' : 'Get Event Descriptor'
    }, {
      'permissionName' : 'pubsub.event-types.post',
      'displayName' : 'PubSub - create new Event Type',
      'description' : 'Post Event Descriptor'
    }, {
      'permissionName' : 'pubsub.event-types.put',
      'displayName' : 'PubSub - update Event Descriptor for Event Type',
      'description' : 'Put Event Descriptor'
    }, {
      'permissionName' : 'pubsub.event-types.delete',
      'displayName' : 'PubSub - delete Event Type',
      'description' : 'Delete Event Descriptor'
    }, {
      'permissionName' : 'pubsub.publishers.post',
      'displayName' : 'PubSub - declare publisher',
      'description' : 'Post Publisher Descriptor'
    }, {
      'permissionName' : 'pubsub.publishers.delete',
      'displayName' : 'PubSub - delete publisher declaration',
      'description' : 'Delete Publisher'
    }, {
      'permissionName' : 'pubsub.publishers.get',
      'displayName' : 'PubSub - get publishers',
      'description' : 'Get Publishers'
    }, {
      'permissionName' : 'pubsub.subscribers.post',
      'displayName' : 'PubSub - declare subscriber',
      'description' : 'Post Subscriber Descriptor'
    }, {
      'permissionName' : 'pubsub.subscribers.delete',
      'displayName' : 'PubSub - delete subscriber declaration',
      'description' : 'Delete Subscriber'
    }, {
      'permissionName' : 'pubsub.subscribers.get',
      'displayName' : 'PubSub - get subscribers',
      'description' : 'Get Subscribers'
    }, {
      'permissionName' : 'pubsub.audit.history.get',
      'displayName' : 'PubSub - get history',
      'description' : 'Get history'
    }, {
      'permissionName' : 'pubsub.audit.message.payload.get',
      'displayName' : 'PubSub - get audit message payload',
      'description' : 'Get audit message payload'
    }, {
      'permissionName' : 'pubsub.publish.post',
      'displayName' : 'PubSub - publish event',
      'description' : 'Publish event'
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-pubsub:1.1.0-SNAPSHOT.44',
      'dockerPull' : true,
      'env' : [{
        'name' : 'KAFKA_HOST',
        'value' : '10.36.1.163'
      }, {
        'name' : 'KAFKA_PORT',
        'value' : '9092'
      }, {
        'name' : 'OKAPI_URL',
        'value' : 'http://10.36.1.163:9130'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 715827882
        }
      }
    }
  }, {
    'id' : 'mod-rtac-1.4.0-SNAPSHOT.45',
    'name' : 'Real Time Availability Check Module',
    'requires' : [{
      'id' : 'inventory',
      'version' : '8.0 9.0 10.0'
    }, {
      'id' : 'holdings-storage',
      'version' : '1.2 2.0 3.0 4.0'
    }, {
      'id' : 'circulation',
      'version' : '3.0 4.0 5.0 6.0 7.0 8.0 9.0'
    }],
    'provides' : [{
      'id' : 'rtac',
      'version' : '1.3',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/rtac',
        'permissionsRequired' : ['rtac.holdings.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/rtac/{id}',
        'permissionsRequired' : ['rtac.holdings.item.get'],
        'modulePermissions' : ['inventory.instances.item.get', 'inventory-storage.holdings.collection.get', 'inventory.items.collection.get', 'circulation.loans.collection.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'rtac.holdings.collection.get',
      'displayName' : 'RTAC - get holding collection',
      'description' : 'Get holding collection'
    }, {
      'permissionName' : 'rtac.holdings.item.get',
      'displayName' : 'RTAC - get individual holding',
      'description' : 'Get individual holding'
    }, {
      'permissionName' : 'rtac.all',
      'displayName' : 'RTAC - all permissions',
      'description' : 'Entire set of permissions needed to use RTAC',
      'subPermissions' : ['rtac.holdings.collection.get', 'rtac.holdings.item.get']
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-rtac:1.4.0-SNAPSHOT.45',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-sender-1.3.0-SNAPSHOT.20',
    'name' : 'Mod sender',
    'requires' : [{
      'id' : 'users',
      'version' : '15.0'
    }, {
      'id' : 'email',
      'version' : '1.0'
    }],
    'provides' : [{
      'id' : 'message-delivery',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/message-delivery',
        'permissionsRequired' : ['sender.message-delivery'],
        'modulePermissions' : ['email.message.post', 'users.item.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'sender.message-delivery',
      'displayName' : 'Message delivery',
      'description' : 'Send message'
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-sender:1.3.0-SNAPSHOT.20',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 536870912
        }
      }
    }
  }, {
    'id' : 'mod-source-record-manager-2.1.0-SNAPSHOT.212',
    'name' : 'Source Record Manager Module',
    'requires' : [{
      'id' : 'source-storage-snapshots',
      'version' : '1.0'
    }, {
      'id' : 'source-storage-records',
      'version' : '1.0'
    }, {
      'id' : 'source-storage-batch',
      'version' : '0.1'
    }, {
      'id' : 'inventory-batch',
      'version' : '0.3'
    }, {
      'id' : 'users',
      'version' : '15.0'
    }, {
      'id' : 'identifier-types',
      'version' : '1.2'
    }, {
      'id' : 'electronic-access-relationships',
      'version' : '1.0'
    }, {
      'id' : 'classification-types',
      'version' : '1.2'
    }, {
      'id' : 'instance-types',
      'version' : '2.0'
    }, {
      'id' : 'instance-formats',
      'version' : '2.0'
    }, {
      'id' : 'contributor-name-types',
      'version' : '1.2'
    }, {
      'id' : 'contributor-types',
      'version' : '2.0'
    }, {
      'id' : 'instance-note-types',
      'version' : '1.0'
    }, {
      'id' : 'alternative-title-types',
      'version' : '1.0'
    }, {
      'id' : 'pubsub-event-types',
      'version' : '0.1'
    }, {
      'id' : 'pubsub-publishers',
      'version' : '0.1'
    }, {
      'id' : 'pubsub-subscribers',
      'version' : '0.1'
    }, {
      'id' : 'pubsub-publish',
      'version' : '0.1'
    }],
    'provides' : [{
      'id' : 'source-manager-job-executions',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/metadata-provider/jobExecutions',
        'permissionsRequired' : ['metadata-provider.jobexecutions.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/metadata-provider/logs/{jobExecutionId}',
        'permissionsRequired' : ['metadata-provider.logs.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/metadata-provider/journalRecords/{jobExecutionId}',
        'permissionsRequired' : ['metadata-provider.logs.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/change-manager/jobExecutions',
        'permissionsRequired' : ['change-manager.jobexecutions.post'],
        'modulePermissions' : ['source-storage.snapshots.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/change-manager/jobExecutions/{id}',
        'permissionsRequired' : ['change-manager.jobexecutions.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/change-manager/jobExecutions/{id}',
        'permissionsRequired' : ['change-manager.jobexecutions.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/change-manager/jobExecutions/{id}/children',
        'permissionsRequired' : ['change-manager.jobexecutions.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/change-manager/jobExecutions/{id}/status',
        'permissionsRequired' : ['change-manager.jobexecutions.put'],
        'modulePermissions' : ['source-storage.snapshots.put']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/change-manager/jobExecutions/{id}/jobProfile',
        'permissionsRequired' : ['change-manager.jobexecutions.put']
      }]
    }, {
      'id' : 'source-manager-records',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/change-manager/jobExecutions/{id}/records',
        'permissionsRequired' : ['change-manager.records.post'],
        'modulePermissions' : ['source-storage.snapshots.get', 'source-storage.snapshots.put', 'source-storage.records.get', 'source-storage.records.post', 'source-storage.records.put', 'inventory.instances.batch.post', 'users.collection.get', 'inventory-storage.identifier-types.collection.get', 'inventory-storage.classification-types.collection.get', 'inventory-storage.instance-types.collection.get', 'inventory-storage.electronic-access-relationships.collection.get', 'inventory-storage.instance-formats.collection.get', 'inventory-storage.contributor-types.collection.get', 'inventory-storage.contributor-name-types.collection.get', 'inventory-storage.instance-note-types.collection.get', 'inventory-storage.alternative-title-types.collection.get', 'pubsub.publish.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/change-manager/jobExecutions/{id}/records',
        'permissionsRequired' : ['change-manager.records.delete'],
        'modulePermissions' : ['source-storage.snapshots.records.delete']
      }]
    }, {
      'id' : 'mapping-rules-provider',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/mapping-rules',
        'permissionsRequired' : ['mapping-rules.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/mapping-rules',
        'permissionsRequired' : ['mapping-rules.update']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/mapping-rules/restore',
        'permissionsRequired' : ['mapping-rules.restore']
      }]
    }, {
      'id' : 'source-manager-event-handlers',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/change-manager/handlers/created-inventory-instance',
        'permissionsRequired' : ['source-records-manager.events.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/change-manager/handlers/data-import-error',
        'permissionsRequired' : ['source-records-manager.events.post']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant',
        'modulePermissions' : ['pubsub.event-types.post', 'pubsub.publishers.post', 'pubsub.subscribers.post']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }, {
      'id' : '_jsonSchemas',
      'version' : '1.0',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/_/jsonSchemas'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'metadata-provider.jobexecutions.get',
      'displayName' : 'Metadata Provider - get jobExecutions',
      'description' : 'Get JobExecutions'
    }, {
      'permissionName' : 'metadata-provider.logs.get',
      'displayName' : 'Metadata Provider - get jobExecution logs',
      'description' : 'Get JobExecutionLogDto'
    }, {
      'permissionName' : 'change-manager.jobexecutions.post',
      'displayName' : 'Change Manager - create jobExecutions',
      'description' : 'Post JobExecution'
    }, {
      'permissionName' : 'change-manager.jobexecutions.put',
      'displayName' : 'Change Manager - update jobExecutions',
      'description' : 'Put JobExecution'
    }, {
      'permissionName' : 'change-manager.jobexecutions.get',
      'displayName' : 'Change Manager - get jobExecutions by id',
      'description' : 'Get JobExecution by id'
    }, {
      'permissionName' : 'change-manager.records.post',
      'displayName' : 'Change Manager - post chunk of raw records',
      'description' : 'Post chunk of raw records'
    }, {
      'permissionName' : 'change-manager.records.delete',
      'displayName' : 'Change Manager - delete jobExecution and all associated records from SRS',
      'description' : 'Delete JobExecution and all associated records from SRS'
    }, {
      'permissionName' : 'mapping-rules.get',
      'displayName' : 'Mapping Rules provider - get default rules by tenant id',
      'description' : 'Get mapping rules for tenant'
    }, {
      'permissionName' : 'mapping-rules.update',
      'displayName' : 'Mapping Rules provider - update default rules by tenant id',
      'description' : 'Update mapping rules for tenant'
    }, {
      'permissionName' : 'mapping-rules.restore',
      'displayName' : 'Mapping Rules provider - restore default rules by tenant id',
      'description' : 'Restore existing mapping rules to default for tenant'
    }, {
      'permissionName' : 'source-records-manager.events.post',
      'displayName' : 'Source Record Manager - handle event',
      'description' : 'Handle event'
    }, {
      'permissionName' : 'source-records-manager.all',
      'displayName' : 'Source Record Manager - all permissions',
      'description' : 'Entire set of permissions needed to manage jobExecutions',
      'subPermissions' : ['metadata-provider.jobexecutions.get', 'change-manager.jobexecutions.post', 'change-manager.jobexecutions.put', 'change-manager.jobexecutions.get', 'change-manager.records.post', 'change-manager.records.delete', 'mapping-rules.get', 'mapping-rules.update', 'mapping-rules.restore', 'source-records-manager.events.post'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-source-record-manager:2.1.0-SNAPSHOT.212',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }, {
        'name' : 'test.mode',
        'value' : 'true'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 715827883
        }
      }
    }
  }, {
    'id' : 'mod-source-record-storage-3.1.0-SNAPSHOT.109',
    'name' : 'Source Record Storage Module',
    'requires' : [{
      'id' : 'pubsub-event-types',
      'version' : '0.1'
    }, {
      'id' : 'pubsub-publishers',
      'version' : '0.1'
    }, {
      'id' : 'pubsub-subscribers',
      'version' : '0.1'
    }, {
      'id' : 'pubsub-publish',
      'version' : '0.1'
    }],
    'provides' : [{
      'id' : 'source-storage-snapshots',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/source-storage/snapshots',
        'permissionsRequired' : ['source-storage.snapshots.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/source-storage/snapshots',
        'permissionsRequired' : ['source-storage.snapshots.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/source-storage/snapshots/{jobExecutionId}',
        'permissionsRequired' : ['source-storage.snapshots.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/source-storage/snapshots/{jobExecutionId}',
        'permissionsRequired' : ['source-storage.snapshots.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/source-storage/snapshots/{jobExecutionId}',
        'permissionsRequired' : ['source-storage.snapshots.delete']
      }]
    }, {
      'id' : 'source-storage-records',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/source-storage/records',
        'permissionsRequired' : ['source-storage.records.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/source-storage/records',
        'permissionsRequired' : ['source-storage.records.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/source-storage/records/{id}',
        'permissionsRequired' : ['source-storage.records.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/source-storage/records/{id}',
        'permissionsRequired' : ['source-storage.records.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/source-storage/records/{id}',
        'permissionsRequired' : ['source-storage.records.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/source-storage/sourceRecords',
        'permissionsRequired' : ['source-storage.sourceRecords.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/source-storage/formattedRecords/{id}',
        'permissionsRequired' : ['source-storage.records.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/source-storage/snapshots/{jobExecutionId}/records',
        'permissionsRequired' : ['source-storage.snapshots.records.delete']
      }]
    }, {
      'id' : 'source-storage-test-records',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/source-storage/populate-test-marc-records',
        'permissionsRequired' : ['source-storage.populate.records']
      }]
    }, {
      'id' : 'source-storage-suppress-discovery',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['PUT'],
        'pathPattern' : '/source-storage/record/suppressFromDiscovery',
        'permissionsRequired' : ['source-storage.record.update']
      }]
    }, {
      'id' : 'source-storage-batch',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/source-storage/batch/records',
        'permissionsRequired' : ['source-storage.records.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/source-storage/batch/parsed-records',
        'permissionsRequired' : ['source-storage.records.put']
      }]
    }, {
      'id' : 'source-storage-event-handlers',
      'version' : '0.1',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/source-storage/handlers/created-inventory-instance',
        'permissionsRequired' : ['source-storage.events.post'],
        'modulePermissions' : ['pubsub.publish.post']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant',
        'modulePermissions' : ['pubsub.event-types.post', 'pubsub.publishers.post', 'pubsub.subscribers.post']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'source-storage.snapshots.get',
      'displayName' : 'Source Storage - get snapshot(s)',
      'description' : 'Get Snapshot(s)'
    }, {
      'permissionName' : 'source-storage.snapshots.post',
      'displayName' : 'Source Storage - create new snapshot',
      'description' : 'Post Snapshot'
    }, {
      'permissionName' : 'source-storage.snapshots.put',
      'displayName' : 'Source Storage - update snapshot',
      'description' : 'Put Snapshot'
    }, {
      'permissionName' : 'source-storage.snapshots.delete',
      'displayName' : 'Source Storage - delete snapshot',
      'description' : 'Delete Snapshot'
    }, {
      'permissionName' : 'source-storage.snapshots.records.delete',
      'displayName' : 'Source Storage - delete records and snapshot',
      'description' : 'Delete Records and Snapshot'
    }, {
      'permissionName' : 'source-storage.records.get',
      'displayName' : 'Source Storage - get record(s)',
      'description' : 'Get Record(s)'
    }, {
      'permissionName' : 'source-storage.records.post',
      'displayName' : 'Source Storage - create new record',
      'description' : 'Post Record'
    }, {
      'permissionName' : 'source-storage.records.put',
      'displayName' : 'Source Storage - update record',
      'description' : 'Put Record'
    }, {
      'permissionName' : 'source-storage.record.update',
      'displayName' : 'Source Storage - update record',
      'description' : "Update Record's fields"
    }, {
      'permissionName' : 'source-storage.records.delete',
      'displayName' : 'Source Storage - delete record',
      'description' : 'Delete Record'
    }, {
      'permissionName' : 'source-storage.sourceRecords.get',
      'displayName' : 'Source Storage - get results',
      'description' : 'Get Results'
    }, {
      'permissionName' : 'source-storage.populate.records',
      'displayName' : 'Source Storage - populate storage with test records',
      'description' : 'Populate storage with test records'
    }, {
      'permissionName' : 'source-storage.events.post',
      'displayName' : 'Source Storage - handle event',
      'description' : 'Handle event'
    }, {
      'permissionName' : 'source-storage.all',
      'displayName' : 'Source Record Storage - all permissions',
      'description' : 'Entire set of permissions needed to manage snapshots and records',
      'subPermissions' : ['source-storage.snapshots.get', 'source-storage.snapshots.post', 'source-storage.snapshots.put', 'source-storage.snapshots.delete', 'source-storage.snapshots.records.delete', 'source-storage.records.get', 'source-storage.records.post', 'source-storage.records.put', 'source-storage.records.delete', 'source-storage.sourceRecords.get', 'source-storage.populate.records', 'source-storage.record.update', 'source-storage.events.post'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-source-record-storage:3.1.0-SNAPSHOT.109',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }, {
        'name' : 'test.mode',
        'value' : 'true'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 603725575
        }
      }
    }
  }, {
    'id' : 'mod-tags-0.6.0-SNAPSHOT.45',
    'name' : 'Tags',
    'requires' : [],
    'provides' : [{
      'id' : 'tags',
      'version' : '1.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/tags',
        'permissionsRequired' : ['tags.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/tags',
        'permissionsRequired' : ['tags.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/tags/{id}',
        'permissionsRequired' : ['tags.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/tags/{id}',
        'permissionsRequired' : ['tags.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/tags/{id}',
        'permissionsRequired' : ['tags.item.delete']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'tags.collection.get',
      'displayName' : 'Tags - get tags collection',
      'description' : 'Get tags collection'
    }, {
      'permissionName' : 'tags.item.get',
      'displayName' : 'Tags - get individual tag from storage',
      'description' : 'Get individual tag'
    }, {
      'permissionName' : 'tags.item.post',
      'displayName' : 'Tags - create tag',
      'description' : 'Create tag'
    }, {
      'permissionName' : 'tags.item.put',
      'displayName' : 'Tags - modify tag',
      'description' : 'Modify tag'
    }, {
      'permissionName' : 'tags.item.delete',
      'displayName' : 'Tags - delete tag',
      'description' : 'Delete tag'
    }, {
      'permissionName' : 'tags.all',
      'displayName' : 'Tags module - all permissions',
      'description' : 'Entire set of permissions needed to use the tags module',
      'subPermissions' : ['tags.collection.get', 'tags.item.get', 'tags.item.post', 'tags.item.put', 'tags.item.delete'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-tags:0.6.0-SNAPSHOT.45',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-template-engine-1.8.0-SNAPSHOT.53',
    'name' : 'Template engine module',
    'requires' : [{
      'id' : 'configuration',
      'version' : '2.0'
    }, {
      'id' : 'patron-notice-policy-storage',
      'version' : '0.8'
    }],
    'provides' : [{
      'id' : 'template-engine',
      'version' : '2.2',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/templates',
        'permissionsRequired' : ['templates.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/templates',
        'permissionsRequired' : ['templates.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/templates/{templateId}',
        'permissionsRequired' : ['templates.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/templates/{templateId}',
        'permissionsRequired' : ['templates.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/templates/{templateId}',
        'permissionsRequired' : ['templates.item.delete'],
        'modulePermissions' : ['circulation-storage.patron-notice-policies.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/template-request',
        'permissionsRequired' : ['template-request.post'],
        'modulePermissions' : ['configuration.entries.collection.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/tenant'
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'templates.collection.get',
      'displayName' : 'Templates - get Templates collection',
      'description' : 'Get Templates collection'
    }, {
      'permissionName' : 'templates.item.get',
      'displayName' : 'Templates - get individual tag from storage',
      'description' : 'Get individual tag'
    }, {
      'permissionName' : 'templates.item.post',
      'displayName' : 'Templates - create tag',
      'description' : 'Create tag'
    }, {
      'permissionName' : 'templates.item.put',
      'displayName' : 'Templates - modify tag',
      'description' : 'Modify tag'
    }, {
      'permissionName' : 'templates.item.delete',
      'displayName' : 'Templates - delete tag',
      'description' : 'Delete tag'
    }, {
      'permissionName' : 'template-request.post',
      'displayName' : 'Template request',
      'description' : 'Request for template compilation'
    }, {
      'permissionName' : 'templates.all',
      'displayName' : 'Templates module - all permissions',
      'description' : 'Entire set of permissions needed to use the Templates module',
      'subPermissions' : ['templates.collection.get', 'templates.item.get', 'templates.item.post', 'templates.item.put', 'templates.item.delete', 'template-request.post'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-template-engine:1.8.0-SNAPSHOT.53',
      'dockerPull' : true,
      'dockerCMD' : ['verify.user=true'],
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-user-import-3.1.1-SNAPSHOT.34',
    'name' : 'User import',
    'requires' : [{
      'id' : 'permissions',
      'version' : '5.0'
    }, {
      'id' : 'users',
      'version' : '14.0 15.0'
    }],
    'provides' : [{
      'id' : 'user-import',
      'version' : '2.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/user-import',
        'permissionsRequired' : ['user-import.add']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/user-import',
        'permissionsRequired' : ['user-import.add'],
        'modulePermissions' : ['users.collection.get', 'addresstypes.collection.get', 'usergroups.collection.get', 'users.item.get', 'users.item.post', 'users.item.put', 'perms.users.item.post']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'user-import.add',
      'displayName' : 'Import users',
      'description' : ''
    }, {
      'permissionName' : 'user-import.all',
      'displayName' : 'User import',
      'description' : '',
      'subPermissions' : ['user-import.add'],
      'visible' : true
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-user-import:3.1.1-SNAPSHOT.34',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'mod-users-16.0.1-SNAPSHOT.115',
    'name' : 'users',
    'provides' : [{
      'id' : 'users',
      'version' : '15.1',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/users',
        'permissionsRequired' : ['users.collection.get'],
        'permissionsDesired' : ['users.read.basic', 'users.read.restricted']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/users/{id}',
        'permissionsRequired' : ['users.item.get'],
        'permissionsDesired' : ['users.read.basic', 'users.read.restricted']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/users',
        'permissionsRequired' : ['users.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/users/{id}',
        'permissionsRequired' : ['users.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/users/{id}',
        'permissionsRequired' : ['users.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/groups',
        'permissionsRequired' : ['usergroups.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/groups/{id}*',
        'permissionsRequired' : ['usergroups.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/groups*',
        'permissionsRequired' : ['usergroups.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/groups/{id}*',
        'permissionsRequired' : ['usergroups.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/groups/{id}*',
        'permissionsRequired' : ['usergroups.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/addresstypes',
        'permissionsRequired' : ['addresstypes.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/addresstypes/{id}',
        'permissionsRequired' : ['addresstypes.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/addresstypes',
        'permissionsRequired' : ['addresstypes.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/addresstypes/{id}',
        'permissionsRequired' : ['addresstypes.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/addresstypes/{id}',
        'permissionsRequired' : ['addresstypes.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/proxiesfor',
        'permissionsRequired' : ['proxiesfor.collection.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/proxiesfor/{id}',
        'permissionsRequired' : ['proxiesfor.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/proxiesfor',
        'permissionsRequired' : ['proxiesfor.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/proxiesfor/{id}',
        'permissionsRequired' : ['proxiesfor.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/proxiesfor/{id}',
        'permissionsRequired' : ['proxiesfor.item.delete']
      }]
    }, {
      'id' : 'custom-fields',
      'version' : '1.1',
      'interfaceType' : 'multiple',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/custom-fields',
        'permissionsRequired' : ['user-settings.custom-fields.collection.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/custom-fields',
        'permissionsRequired' : ['user-settings.custom-fields.item.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/custom-fields/{id}',
        'permissionsRequired' : ['user-settings.custom-fields.item.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/custom-fields/{id}',
        'permissionsRequired' : ['user-settings.custom-fields.item.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/custom-fields/{id}',
        'permissionsRequired' : ['user-settings.custom-fields.item.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/custom-fields/{id}/stats',
        'permissionsRequired' : ['user-settings.custom-fields.item.stats.get']
      }]
    }, {
      'id' : '_tenant',
      'version' : '1.2',
      'interfaceType' : 'system',
      'handlers' : [{
        'methods' : ['POST', 'DELETE'],
        'pathPattern' : '/_/tenant'
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'users.collection.get',
      'displayName' : 'users collection get',
      'description' : 'Get a collection of user records'
    }, {
      'permissionName' : 'users.item.get',
      'displayName' : 'users item get',
      'description' : 'Read an individual record in the User module'
    }, {
      'permissionName' : 'users.read.basic',
      'displayName' : 'users read-basic',
      'description' : 'Read non-restricted User data information'
    }, {
      'permissionName' : 'users.read.restricted',
      'displayName' : 'users read-restricted',
      'description' : 'Read restricted User data information'
    }, {
      'permissionName' : 'users.item.post',
      'displayName' : 'users item post',
      'description' : 'Create new records in the User module'
    }, {
      'permissionName' : 'users.item.put',
      'displayName' : 'users item put',
      'description' : 'Edit existing records in the User module'
    }, {
      'permissionName' : 'users.item.delete',
      'displayName' : 'users item delete',
      'description' : 'Delete records from the User module'
    }, {
      'permissionName' : 'usergroups.collection.get',
      'displayName' : 'usergroups collection get',
      'description' : 'Get a list of usergroup records'
    }, {
      'permissionName' : 'usergroups.item.get',
      'displayName' : 'usergroups item get',
      'description' : 'Get a single usergroup item'
    }, {
      'permissionName' : 'usergroups.item.post',
      'displayName' : 'usergroups item post',
      'description' : 'Create new Groups for users'
    }, {
      'permissionName' : 'usergroups.item.put',
      'displayName' : 'usergroups item put',
      'description' : 'Edit existing Groups for users'
    }, {
      'permissionName' : 'usergroups.item.delete',
      'displayName' : 'usergroups item delete',
      'description' : 'Delete Groups for users'
    }, {
      'permissionName' : 'addresstypes.collection.get',
      'displayName' : 'addresstypes collection get',
      'description' : 'Get a list of addresstype records'
    }, {
      'permissionName' : 'addresstypes.item.get',
      'displayName' : 'addresstypes item get',
      'description' : 'Get a single addresstype record'
    }, {
      'permissionName' : 'addresstypes.item.post',
      'displayName' : 'addresstypes item post',
      'description' : 'Create a new addresstype record'
    }, {
      'permissionName' : 'addresstypes.item.put',
      'displayName' : 'addresstypes item put',
      'description' : 'Edit an addresstype record'
    }, {
      'permissionName' : 'addresstypes.item.delete',
      'displayName' : 'addresstypes item delete',
      'description' : 'Delete an addresstype record'
    }, {
      'permissionName' : 'proxiesfor.collection.get',
      'displayName' : 'proxiesfor collection get',
      'description' : 'Get a list of proxyfor records'
    }, {
      'permissionName' : 'proxiesfor.item.get',
      'displayName' : 'proxiesfor item get',
      'description' : 'Get a single proxyfor record'
    }, {
      'permissionName' : 'proxiesfor.item.post',
      'displayName' : 'proxiesfor item post',
      'description' : 'Create a new proxyfor record'
    }, {
      'permissionName' : 'proxiesfor.item.put',
      'displayName' : 'proxiesfor item put',
      'description' : 'Edit a proxyfor record'
    }, {
      'permissionName' : 'proxiesfor.item.delete',
      'displayName' : 'proxiesfor.item.delete',
      'description' : 'Delete a proxyfor record'
    }, {
      'permissionName' : 'users.all',
      'displayName' : 'users all',
      'description' : 'All permissions for the mod-users module',
      'subPermissions' : ['users.collection.get', 'users.item.get', 'users.read.basic', 'users.read.restricted', 'users.item.post', 'users.item.put', 'users.item.delete', 'usergroups.collection.get', 'usergroups.item.get', 'usergroups.item.post', 'usergroups.item.put', 'usergroups.item.delete', 'addresstypes.collection.get', 'addresstypes.item.get', 'addresstypes.item.post', 'addresstypes.item.put', 'addresstypes.item.delete', 'proxiesfor.collection.get', 'proxiesfor.item.get', 'proxiesfor.item.post', 'proxiesfor.item.put', 'proxiesfor.item.delete']
    }, {
      'permissionName' : 'user-settings.custom-fields.collection.get',
      'displayName' : 'User Custom Fields - get collection',
      'description' : 'Get User Custom Fields collection'
    }, {
      'permissionName' : 'user-settings.custom-fields.item.post',
      'displayName' : 'User Custom Fields - create field',
      'description' : 'Create User Custom Field'
    }, {
      'permissionName' : 'user-settings.custom-fields.item.get',
      'displayName' : 'User Custom Fields - get field',
      'description' : 'Get User Custom Field'
    }, {
      'permissionName' : 'user-settings.custom-fields.item.put',
      'displayName' : 'User Custom Fields - modify field',
      'description' : 'Modify User Custom Field'
    }, {
      'permissionName' : 'user-settings.custom-fields.item.delete',
      'displayName' : 'User Custom Fields - delete field',
      'description' : 'Delete User Custom Field'
    }, {
      'permissionName' : 'user-settings.custom-fields.item.stats.get',
      'displayName' : 'User Custom Fields - get item usage statistic',
      'description' : 'Get Custom Field Statistic'
    }, {
      'permissionName' : 'user-settings.custom-fields.all',
      'displayName' : 'User Custom Fields module - all permissions',
      'description' : 'Entire set of permissions needed to use the user custom fields',
      'subPermissions' : ['user-settings.custom-fields.collection.get', 'user-settings.custom-fields.item.post', 'user-settings.custom-fields.item.get', 'user-settings.custom-fields.item.put', 'user-settings.custom-fields.item.delete', 'user-settings.custom-fields.item.stats.get'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-users:16.0.1-SNAPSHOT.115',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }, {
        'name' : 'DB_HOST',
        'value' : 'postgres'
      }, {
        'name' : 'DB_PORT',
        'value' : '5432'
      }, {
        'name' : 'DB_USERNAME',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_PASSWORD',
        'value' : 'folio_admin'
      }, {
        'name' : 'DB_DATABASE',
        'value' : 'okapi_modules'
      }, {
        'name' : 'DB_QUERYTIMEOUT',
        'value' : '60000'
      }, {
        'name' : 'DB_CHARSET',
        'value' : 'UTF-8'
      }, {
        'name' : 'DB_MAXPOOLSIZE',
        'value' : '5'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 536870912
        }
      }
    }
  }, {
    'id' : 'mod-users-bl-5.2.1-SNAPSHOT.80',
    'name' : 'users business logic',
    'requires' : [{
      'id' : 'users',
      'version' : '14.3 15.0'
    }, {
      'id' : 'permissions',
      'version' : '5.0'
    }, {
      'id' : 'login',
      'version' : '6.0'
    }, {
      'id' : 'service-points',
      'version' : '2.1 3.0'
    }, {
      'id' : 'service-points-users',
      'version' : '1.0'
    }, {
      'id' : 'password-validator',
      'version' : '1.0'
    }, {
      'id' : 'authtoken',
      'version' : '2.0'
    }, {
      'id' : 'notify',
      'version' : '2.0'
    }, {
      'id' : 'configuration',
      'version' : '2.0'
    }],
    'provides' : [{
      'id' : 'users-bl',
      'version' : '5.0',
      'handlers' : [{
        'methods' : ['GET'],
        'pathPattern' : '/bl-users',
        'permissionsRequired' : ['users-bl.collection.get'],
        'modulePermissions' : ['users.collection.get', 'inventory-storage.service-points-users.collection.get', 'inventory-storage.service-points-users.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/bl-users/_self',
        'permissionsRequired' : [],
        'modulePermissions' : ['users.item.get', 'users.collection.get', 'perms.users.get', 'usergroups.item.get', 'inventory-storage.service-points-users.collection.get', 'inventory-storage.service-points-users.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users/login',
        'permissionsRequired' : [],
        'modulePermissions' : ['users.item.get', 'users.collection.get', 'perms.users.item.get', 'perms.users.get', 'usergroups.item.get', 'inventory-storage.service-points-users.collection.get', 'inventory-storage.service-points-users.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/bl-users/by-username/{id}',
        'permissionsRequired' : ['users-bl.item.get', 'perms.users.get'],
        'modulePermissions' : ['users.item.get', 'users.collection.get', 'perms.users.get', 'login.item.get', 'inventory-storage.service-points-users.collection.get', 'inventory-storage.service-points-users.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/bl-users/by-id/{id}',
        'permissionsRequired' : ['users-bl.item.get', 'perms.users.get'],
        'modulePermissions' : ['users.item.get', 'users.collection.get', 'perms.users.get', 'login.item.get', 'inventory-storage.service-points-users.collection.get', 'inventory-storage.service-points-users.item.get', 'inventory-storage.service-points.collection.get', 'inventory-storage.service-points.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users',
        'permissionsRequired' : ['users-bl.item.post'],
        'permissionsDesired' : ['perms.users.item.post'],
        'modulePermissions' : ['users.item.post', 'perms.users.item.post', 'login.item.post']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/bl-users/{id}',
        'permissionsRequired' : ['users-bl.item.put'],
        'permissionsDesired' : ['perms.users.item.put'],
        'modulePermissions' : ['users.edit', 'users.item.put', 'perms.users.item.put', 'login.item.put']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users/forgotten/password',
        'permissionsRequired' : [],
        'permissionsDesired' : [],
        'modulePermissions' : ['users.edit', 'users.item.put', 'perms.users.item.put', 'login.item.put', 'configuration.entries.collection.get', 'users.collection.get', 'users.item.get', 'login.password-reset-action.post', 'auth.signtoken', 'notify.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users/forgotten/username',
        'permissionsRequired' : [],
        'permissionsDesired' : [],
        'modulePermissions' : ['users.edit', 'users.item.put', 'perms.users.item.put', 'login.item.put', 'configuration.entries.collection.get', 'users.collection.get', 'notify.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users/settings/myprofile/password',
        'permissionsRequired' : [],
        'permissionsDesired' : [],
        'modulePermissions' : ['validation.validate.post', 'login.item.put', 'users.item.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users/password-reset/link',
        'permissionsRequired' : ['users-bl.password-reset-link.generate'],
        'permissionsDesired' : [],
        'modulePermissions' : ['users.item.get', 'configuration.entries.collection.get', 'login.password-reset-action.post', 'auth.signtoken', 'notify.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users/password-reset/reset',
        'permissionsRequired' : ['users-bl.password-reset-link.reset'],
        'permissionsDesired' : [],
        'modulePermissions' : ['login.password-reset-action.get', 'users.item.get', 'auth.signtoken', 'login.password-reset.post', 'validation.validate.post', 'notify.item.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/bl-users/password-reset/validate',
        'permissionsRequired' : ['users-bl.password-reset-link.validate'],
        'permissionsDesired' : [],
        'modulePermissions' : ['users.item.get', 'auth.signtoken', 'login.password-reset-action.get']
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'users-bl.collection.get',
      'displayName' : 'users-bl collection get',
      'description' : 'Get a list of composite user records'
    }, {
      'permissionName' : 'users-bl.item.get',
      'displayName' : 'users-bl item get',
      'description' : 'Get a single composite user record by id'
    }, {
      'permissionName' : 'users-bl.item.post',
      'displayName' : 'users-bl item post',
      'description' : 'Create a new composite user record'
    }, {
      'permissionName' : 'users-bl.item.put',
      'displayName' : 'users-bl item put',
      'description' : 'Modify a composite user record'
    }, {
      'permissionName' : 'users-bl.password-reset-link.generate',
      'displayName' : 'users-bl password reset link generate',
      'description' : 'Generate and send password reset link'
    }, {
      'permissionName' : 'users-bl.password-reset-link.validate',
      'displayName' : 'users-bl password-reset-link validate',
      'description' : 'Validate create/reset password link and log user into system to change password'
    }, {
      'permissionName' : 'users-bl.password-reset-link.reset',
      'displayName' : 'users-bl password-reset-link reset',
      'description' : 'Reset password by link'
    }, {
      'permissionName' : 'users-bl.all',
      'displayName' : 'users-bl all',
      'description' : 'All user business-logic permissions',
      'subPermissions' : ['users-bl.collection.get', 'users-bl.item.get', 'users-bl.item.post', 'users-bl.item.put', 'users-bl.password-reset-link.generate', 'users-bl.password-reset-link.validate', 'users-bl.password-reset-link.reset'],
      'visible' : false
    }],
    'launchDescriptor' : {
      'dockerImage' : 'folioci/mod-users-bl:5.2.1-SNAPSHOT.80',
      'dockerPull' : true,
      'env' : [{
        'name' : 'JAVA_OPTIONS',
        'value' : '-XX:MaxRAMPercentage=66.0'
      }],
      'dockerArgs' : {
        'HostConfig' : {
          'PortBindings' : {
            '8081/tcp' : [{
              'HostPort' : '%p'
            }]
          },
          'Memory' : 357913941
        }
      }
    }
  }, {
    'id' : 'okapi-2.36.3',
    'name' : 'Okapi',
    'requires' : [],
    'provides' : [{
      'id' : 'okapi-proxy',
      'version' : '1.9',
      'interfaceType' : 'internal',
      'handlers' : []
    }, {
      'id' : 'okapi',
      'version' : '1.9',
      'interfaceType' : 'internal',
      'handlers' : [{
        'methods' : ['POST'],
        'pathPattern' : '/_/deployment/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.deployment.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/deployment/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.deployment.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/deployment/modules/{instanceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.deployment.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/deployment/modules/{instanceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.deployment.delete']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/discovery/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/modules/{serviceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/modules/{serviceId}/{instanceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/_/discovery/modules/{serviceId}/{instanceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/discovery/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/discovery/modules/{serviceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.delete']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/discovery/modules/{serviceId}/{instanceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/health',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.health.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/health/{serviceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.health.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/health/{serviceId}/{instanceId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.health.get']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/nodes',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.nodes.get']
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/_/discovery/nodes/{nodeId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.nodes.put']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/discovery/nodes/{nodeId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.discovery.nodes.get']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/proxy/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.modules.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/modules',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/modules/{moduleId}',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/_/proxy/modules/{moduleId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.modules.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/proxy/modules/{moduleId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.modules.delete']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/proxy/tenants',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/tenants',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['PUT'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.put']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.delete']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/upgrade',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.upgrade.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/install',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.install.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.modules.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/modules',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/modules/{moduleId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.modules.enabled.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/modules/{moduleId}',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/modules/{moduleId}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.tenants.modules.enabled.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/interfaces',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/tenants/{tenantId}/interfaces/{interfaceId}',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/proxy/health',
        'type' : 'internal',
        'permissionsRequired' : []
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/proxy/pull/modules',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.proxy.pull.modules.post']
      }, {
        'methods' : ['POST'],
        'pathPattern' : '/_/env',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.env.post']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/env',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.env.list']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/env/{id}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.env.get']
      }, {
        'methods' : ['DELETE'],
        'pathPattern' : '/_/env/{id}',
        'type' : 'internal',
        'permissionsRequired' : ['okapi.env.delete']
      }, {
        'methods' : ['GET'],
        'pathPattern' : '/_/version',
        'type' : 'internal',
        'permissionsRequired' : []
      }]
    }],
    'permissionSets' : [{
      'permissionName' : 'okapi.deployment.get',
      'displayName' : 'Okapi - get deployment info',
      'description' : "Get deployment info for module on 'this' node"
    }, {
      'permissionName' : 'okapi.deployment.post',
      'displayName' : 'Okapi - deploy locally',
      'description' : "Deploy a module on 'this' node"
    }, {
      'permissionName' : 'okapi.deployment.delete',
      'displayName' : 'Okapi - undeploy locally',
      'description' : "Undeploy a module on 'this' node"
    }, {
      'permissionName' : 'okapi.discovery.get',
      'displayName' : 'Okapi - get discovery info',
      'description' : 'Get discovery info for module'
    }, {
      'permissionName' : 'okapi.discovery.post',
      'displayName' : 'Okapi - deploy a module on a given node',
      'description' : "Undeploy a module on 'this' node"
    }, {
      'permissionName' : 'okapi.discovery.put',
      'displayName' : 'Okapi - update description of deployed module',
      'description' : 'Update description'
    }, {
      'permissionName' : 'okapi.discovery.delete',
      'displayName' : 'Okapi - undeploy a module instance',
      'description' : 'Undeploy a given instance of a module'
    }, {
      'permissionName' : 'okapi.discovery.health.get',
      'displayName' : 'Okapi - Get a health for module/node',
      'description' : 'Get health info'
    }, {
      'permissionName' : 'okapi.discovery.nodes.get',
      'displayName' : 'Okapi - Get a node descriptor',
      'description' : 'Get a node descriptor'
    }, {
      'permissionName' : 'okapi.discovery.nodes.put',
      'displayName' : 'Okapi - Update a node descriptor',
      'description' : 'Update a node descriptor, usually to give it a new name'
    }, {
      'permissionName' : 'okapi.proxy.modules.post',
      'displayName' : 'Okapi - declare a module',
      'description' : 'Declare a module'
    }, {
      'permissionName' : 'okapi.proxy.modules.put',
      'displayName' : 'Okapi - update a module description',
      'description' : 'Update a module description'
    }, {
      'permissionName' : 'okapi.proxy.modules.delete',
      'displayName' : 'Okapi - undeclare a module',
      'description' : 'Remove a moduleDescriptor from the system'
    }, {
      'permissionName' : 'okapi.proxy.pull.modules.post',
      'displayName' : 'Okapi - get ModuleDescriptors',
      'description' : 'Get MDs from another Okapi, maybe a repo'
    }, {
      'permissionName' : 'okapi.proxy.tenants.post',
      'displayName' : 'Okapi - create a tenant',
      'description' : 'Declare a tenant'
    }, {
      'permissionName' : 'okapi.proxy.tenants.put',
      'displayName' : 'Okapi - Update a tenant',
      'description' : 'Update a tenant description'
    }, {
      'permissionName' : 'okapi.proxy.tenants.delete',
      'displayName' : 'Okapi - Delete a tenant',
      'description' : 'Remove a tenant description'
    }, {
      'permissionName' : 'okapi.proxy.tenants.upgrade.post',
      'displayName' : 'Okapi - Upgrade modules',
      'description' : 'Check if newer versions available, and upgrade'
    }, {
      'permissionName' : 'okapi.proxy.tenants.install.post',
      'displayName' : 'Okapi - Enable modules and dependencies',
      'description' : 'Check dependencies and enable/disable modules as needed'
    }, {
      'permissionName' : 'okapi.proxy.tenants.modules.post',
      'displayName' : 'Okapi - Enable a module for tenant',
      'description' : 'Enable a module for the tenant'
    }, {
      'permissionName' : 'okapi.proxy.tenants.modules.enabled.post',
      'displayName' : 'Okapi - Enable a module and disable another',
      'description' : 'Enable a module for the tenant, and disable another one'
    }, {
      'permissionName' : 'okapi.proxy.tenants.modules.enabled.delete',
      'displayName' : 'Okapi - Disable a module for tenant',
      'description' : 'Disable a module for the tenant'
    }, {
      'permissionName' : 'okapi.env.post',
      'displayName' : 'Okapi - post env variable',
      'description' : 'Set up an environment variable for all modules'
    }, {
      'permissionName' : 'okapi.env.list',
      'displayName' : 'Okapi - list env variables',
      'description' : 'List the environment variables'
    }, {
      'permissionName' : 'okapi.env.get',
      'displayName' : 'Okapi - get one env variable',
      'description' : 'Get one environment variable'
    }, {
      'permissionName' : 'okapi.env.delete',
      'displayName' : 'Okapi - Delete env variable',
      'description' : 'Delete one environment variable'
    }, {
      'permissionName' : 'okapi.deploy',
      'displayName' : 'Okapi - Manage deployments',
      'description' : 'Deploy and undeploy modules',
      'subPermissions' : ['okapi.deployment.post', 'okapi.deployment.get', 'okapi.deployment.delete', 'okapi.discovery.post', 'okapi.discovery.get', 'okapi.discovery.put', 'okapi.discovery.delete', 'okapi.discovery.nodes.put', 'okapi.discovery.health.get', 'okapi.discovery.nodes.get']
    }, {
      'permissionName' : 'okapi.modules',
      'displayName' : 'Okapi - Manage modules',
      'description' : 'Manage ModuleDescriptors known to the system',
      'subPermissions' : ['okapi.proxy.modules.post', 'okapi.proxy.modules.put', 'okapi.proxy.modules.delete', 'okapi.proxy.pull.modules.post']
    }, {
      'permissionName' : 'okapi.tenants',
      'displayName' : 'Okapi - Manage tenants',
      'description' : 'Manage tenants known to the system',
      'subPermissions' : ['okapi.proxy.tenants.post', 'okapi.proxy.tenants.put', 'okapi.proxy.tenants.delete']
    }, {
      'permissionName' : 'okapi.tenantmodules',
      'displayName' : 'Okapi - Manage modules enabled for a tenant',
      'description' : 'Enable and disable modules for a tenant',
      'subPermissions' : ['okapi.proxy.tenants.modules.post', 'okapi.proxy.tenants.modules.enabled.post', 'okapi.proxy.tenants.modules.enabled.delete', 'okapi.proxy.tenants.upgrade.post', 'okapi.proxy.tenants.install.post']
    }, {
      'permissionName' : 'okapi.env',
      'displayName' : 'Okapi - Manage environment variables',
      'description' : 'Set up env vars for modules',
      'subPermissions' : ['okapi.env.post', 'okapi.env.delete', 'okapi.env.list', 'okapi.env.get']
    }, {
      'permissionName' : 'okapi.all',
      'displayName' : 'Okapi - All permissions',
      'description' : 'Anything goes',
      'subPermissions' : ['okapi.deploy', 'okapi.modules', 'okapi.tenants', 'okapi.tenantmodules', 'okapi.env']
    }]
  }]);
}
