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

  this.get('/erm/resource/:id/entitlements', () => ({ results: [] }));

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
    return schema.agreements.find(request.params.id).attrs;
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

  this.get('/orders/order-lines', (schema, request) => {
    // query will look something like `id==123 or id==456`
    const poLineIds = request.queryParams.query.split(' or ')
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
      { 'id': '188389636d9ece46016d9ed018dc0036', 'value': 'does_not_apply', 'label': 'Does not apply' }]
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


  this.get('/users', (schema) => {
    return schema.contacts.all();
  });

  this.get('note-links/domain/agreements/type/agreement/id/:id', () => { });

  this.post('erm/sas/:id/clone', (schema, request) => {
    return schema.agreements.find(request.params.id).attrs;
  });

  this.get('/_/proxy/tenants/diku/modules', () => [{
    'id': 'mod-orders-9.0.0-SNAPSHOT.230',
    'name': 'Orders Business Logic Module',
    'requires': [{
      'id': 'acquisitions-units-storage.units',
      'version': '1.1'
    }, {
      'id': 'acquisitions-units-storage.memberships',
      'version': '1.0'
    }, {
      'id': 'configuration',
      'version': '2.0'
    }, {
      'id': 'orders-storage.purchase-orders',
      'version': '6.1'
    }, {
      'id': 'orders-storage.alerts',
      'version': '3.0'
    }, {
      'id': 'orders-storage.pieces',
      'version': '3.1'
    }, {
      'id': 'orders-storage.receiving-history',
      'version': '3.1'
    }, {
      'id': 'orders-storage.reporting-codes',
      'version': '3.0'
    }, {
      'id': 'orders-storage.po-lines',
      'version': '8.0'
    }, {
      'id': 'orders-storage.order-templates',
      'version': '1.0'
    }, {
      'id': 'holdings-storage',
      'version': '3.1 4.0'
    }, {
      'id': 'orders-storage.po-number',
      'version': '2.0'
    }, {
      'id': 'inventory',
      'version': '8.3 9.4'
    }, {
      'id': 'instance-types',
      'version': '2.0'
    }, {
      'id': 'instance-statuses',
      'version': '1.0'
    }, {
      'id': 'item-storage',
      'version': '7.5'
    }, {
      'id': 'identifier-types',
      'version': '1.2'
    }, {
      'id': 'isbn-utils',
      'version': '2.0'
    }, {
      'id': 'loan-types',
      'version': '2.2'
    }, {
      'id': 'organizations-storage.organizations',
      'version': '2.1'
    }],
    'provides': [{
      'id': 'orders',
      'version': '8.0',
      'handlers': [{
        'methods': ['GET'],
        'pathPattern': '/orders/composite-orders',
        'permissionsRequired': ['orders.collection.get'],
        'modulePermissions': ['acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.purchase-orders.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/orders/composite-orders',
        'permissionsRequired': ['orders.item.post'],
        'permissionsDesired': ['orders.acquisitions-units-assignments.assign', 'orders.item.approve'],
        'modulePermissions': ['orders-storage.purchase-orders.collection.get', 'orders-storage.purchase-orders.item.post', 'orders-storage.purchase-orders.item.put', 'orders-storage.alerts.item.post', 'orders-storage.alerts.item.put', 'orders-storage.po-lines.item.post', 'orders-storage.po-lines.item.put', 'orders-storage.po-lines.collection.get', 'orders-storage.pieces.item.post', 'orders-storage.pieces.collection.get', 'orders-storage.po-line-number.get', 'orders-storage.po-number.get', 'orders-storage.reporting-codes.item.post', 'orders-storage.reporting-codes.item.put', 'configuration.entries.collection.get', 'finance-storage.encumbrances.collection.get', 'finance-storage.encumbrances.item.post', 'inventory.instances.collection.get', 'inventory.instances.item.post', 'inventory-storage.instance-types.collection.get', 'inventory-storage.instance-statuses.collection.get', 'inventory-storage.holdings.item.post', 'inventory-storage.holdings.collection.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.post', 'inventory-storage.loan-types.collection.get', 'inventory-storage.contributor-name-types.collection.get', 'organizations-storage.organizations.collection.get', 'organizations-storage.organizations.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'inventory-storage.identifier-types.collection.get', 'isbn-utils.convert-to-13.get']
      }, {
        'methods': ['GET'],
        'pathPattern': '/orders/composite-orders/{id}',
        'permissionsRequired': ['orders.item.get'],
        'modulePermissions': ['orders-storage.purchase-orders.item.get', 'orders-storage.po-lines.collection.get', 'orders-storage.alerts.item.get', 'orders-storage.reporting-codes.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['PUT'],
        'pathPattern': '/orders/composite-orders/{id}',
        'permissionsRequired': ['orders.item.put'],
        'permissionsDesired': ['orders.acquisitions-units-assignments.manage', 'orders.item.approve'],
        'modulePermissions': ['orders-storage.purchase-orders.collection.get', 'orders-storage.purchase-orders.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.post', 'orders-storage.po-lines.item.put', 'orders-storage.po-lines.item.delete', 'orders-storage.alerts.item.post', 'orders-storage.alerts.item.get', 'orders-storage.alerts.item.put', 'orders-storage.alerts.item.delete', 'orders-storage.pieces.item.post', 'orders-storage.pieces.collection.get', 'orders-storage.po-line-number.get', 'orders-storage.reporting-codes.item.post', 'orders-storage.reporting-codes.item.get', 'orders-storage.reporting-codes.item.put', 'orders-storage.reporting-codes.item.delete', 'configuration.entries.collection.get', 'finance-storage.encumbrances.collection.get', 'finance-storage.encumbrances.item.post', 'inventory.instances.collection.get', 'inventory.instances.item.post', 'inventory-storage.instance-types.collection.get', 'inventory-storage.instance-statuses.collection.get', 'inventory-storage.holdings.item.post', 'inventory-storage.holdings.collection.get', 'inventory-storage.items.collection.get', 'inventory-storage.items.item.post', 'inventory-storage.loan-types.collection.get', 'inventory-storage.contributor-name-types.collection.get', 'organizations-storage.organizations.collection.get', 'organizations-storage.organizations.item.get', 'isbn-utils.convert-to-13.get', 'inventory-storage.identifier-types.collection.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['DELETE'],
        'pathPattern': '/orders/composite-orders/{id}',
        'permissionsRequired': ['orders.item.delete'],
        'modulePermissions': ['orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.delete', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.delete', 'orders-storage.alerts.item.delete', 'orders-storage.reporting-codes.item.delete', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['GET'],
        'pathPattern': '/orders/order-lines',
        'permissionsRequired': ['orders.po-lines.collection.get'],
        'modulePermissions': ['acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.po-lines.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/orders/order-lines',
        'permissionsRequired': ['orders.po-lines.item.post'],
        'modulePermissions': ['orders-storage.purchase-orders.item.get', 'orders-storage.po-line-number.get', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.post', 'orders-storage.alerts.item.post', 'orders-storage.reporting-codes.item.post', 'configuration.entries.collection.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'inventory-storage.identifier-types.collection.get', 'isbn-utils.convert-to-13.get']
      }, {
        'methods': ['GET'],
        'pathPattern': '/orders/order-lines/{id}',
        'permissionsRequired': ['orders.po-lines.item.get'],
        'modulePermissions': ['orders-storage.po-lines.item.get', 'orders-storage.alerts.item.get', 'orders-storage.reporting-codes.item.get', 'orders-storage.purchase-orders.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['PUT'],
        'pathPattern': '/orders/order-lines/{id}',
        'permissionsRequired': ['orders.po-lines.item.put'],
        'modulePermissions': ['orders-storage.alerts.item.post', 'orders-storage.alerts.item.put', 'orders-storage.alerts.item.delete', 'orders-storage.po-lines.item.get', 'orders-storage.po-lines.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.put', 'orders-storage.reporting-codes.item.post', 'orders-storage.reporting-codes.item.put', 'orders-storage.reporting-codes.item.delete', 'configuration.entries.collection.get', 'inventory-storage.identifier-types.collection.get', 'isbn-utils.convert-to-13.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['DELETE'],
        'pathPattern': '/orders/order-lines/{id}',
        'permissionsRequired': ['orders.po-lines.item.delete'],
        'modulePermissions': ['orders-storage.purchase-orders.item.get', 'orders-storage.po-lines.item.get', 'orders-storage.po-lines.item.delete', 'orders-storage.alerts.item.delete', 'orders-storage.reporting-codes.item.delete', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/orders/po-number/validate',
        'permissionsRequired': ['orders.po-number.item.post'],
        'modulePermissions': ['orders-storage.purchase-orders.collection.get']
      }, {
        'methods': ['GET'],
        'pathPattern': '/orders/po-number',
        'permissionsRequired': ['orders.po-number.item.get'],
        'modulePermissions': ['orders-storage.po-number.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/orders/receive',
        'permissionsRequired': ['orders.receiving.collection.post'],
        'modulePermissions': ['orders-storage.pieces.collection.get', 'orders-storage.pieces.item.put', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.put', 'inventory.items.collection.get', 'inventory.items.item.put', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.post', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.purchase-orders.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/orders/check-in',
        'permissionsRequired': ['orders.check-in.collection.post'],
        'modulePermissions': ['orders-storage.pieces.collection.get', 'orders-storage.pieces.item.put', 'orders-storage.po-lines.collection.get', 'orders-storage.po-lines.item.put', 'orders-storage.purchase-orders.item.get', 'orders-storage.purchase-orders.item.put', 'inventory.items.collection.get', 'inventory.items.item.put', 'inventory-storage.holdings.collection.get', 'inventory-storage.holdings.item.post', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.purchase-orders.collection.get']
      }, {
        'methods': ['GET'],
        'pathPattern': '/orders/receiving-history',
        'permissionsRequired': ['orders.receiving-history.collection.get'],
        'modulePermissions': ['acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get', 'orders-storage.receiving-history.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/orders/pieces',
        'permissionsRequired': ['orders.pieces.item.post'],
        'modulePermissions': ['orders-storage.pieces.item.post', 'orders-storage.po-lines.item.get', 'orders-storage.purchase-orders.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['PUT'],
        'pathPattern': '/orders/pieces/{id}',
        'permissionsRequired': ['orders.pieces.item.put'],
        'modulePermissions': ['orders-storage.pieces.item.put', 'orders-storage.pieces.item.get', 'orders-storage.po-lines.item.get', 'orders-storage.purchase-orders.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['DELETE'],
        'pathPattern': '/orders/pieces/{id}',
        'permissionsRequired': ['orders.pieces.item.delete'],
        'modulePermissions': ['orders-storage.pieces.item.delete', 'orders-storage.pieces.item.get', 'orders-storage.po-lines.item.get', 'orders-storage.purchase-orders.item.get', 'acquisitions-units-storage.units.collection.get', 'acquisitions-units-storage.memberships.collection.get']
      }]
    }, {
      'id': 'order-templates',
      'version': '1.0',
      'handlers': [{
        'methods': ['GET'],
        'pathPattern': '/orders/order-templates',
        'permissionsRequired': ['orders.order-templates.collection.get'],
        'modulePermissions': ['orders-storage.order-templates.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/orders/order-templates',
        'permissionsRequired': ['orders.order-templates.item.post'],
        'modulePermissions': ['orders-storage.order-templates.item.post']
      }, {
        'methods': ['GET'],
        'pathPattern': '/orders/order-templates/{id}',
        'permissionsRequired': ['orders.order-templates.item.get'],
        'modulePermissions': ['orders-storage.order-templates.item.get']
      }, {
        'methods': ['PUT'],
        'pathPattern': '/orders/order-templates/{id}',
        'permissionsRequired': ['orders.order-templates.item.put'],
        'modulePermissions': ['orders-storage.order-templates.item.put']
      }, {
        'methods': ['DELETE'],
        'pathPattern': '/orders/order-templates/{id}',
        'permissionsRequired': ['orders.order-templates.item.delete'],
        'modulePermissions': ['orders-storage.order-templates.item.delete']
      }]
    }, {
      'id': 'acquisitions-units',
      'version': '1.1',
      'handlers': [{
        'methods': ['GET'],
        'pathPattern': '/acquisitions-units/units',
        'permissionsRequired': ['acquisitions-units.units.collection.get'],
        'modulePermissions': ['acquisitions-units-storage.units.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/acquisitions-units/units',
        'permissionsRequired': ['acquisitions-units.units.item.post'],
        'modulePermissions': ['acquisitions-units-storage.units.item.post']
      }, {
        'methods': ['GET'],
        'pathPattern': '/acquisitions-units/units/{id}',
        'permissionsRequired': ['acquisitions-units.units.item.get'],
        'modulePermissions': ['acquisitions-units-storage.units.item.get']
      }, {
        'methods': ['PUT'],
        'pathPattern': '/acquisitions-units/units/{id}',
        'permissionsRequired': ['acquisitions-units.units.item.put'],
        'modulePermissions': ['acquisitions-units-storage.units.item.put']
      }, {
        'methods': ['DELETE'],
        'pathPattern': '/acquisitions-units/units/{id}',
        'permissionsRequired': ['acquisitions-units.units.item.delete'],
        'modulePermissions': ['acquisitions-units-storage.units.item.get', 'acquisitions-units-storage.units.item.put']
      }, {
        'methods': ['GET'],
        'pathPattern': '/acquisitions-units/memberships',
        'permissionsRequired': ['acquisitions-units.memberships.collection.get'],
        'modulePermissions': ['acquisitions-units-storage.memberships.collection.get']
      }, {
        'methods': ['POST'],
        'pathPattern': '/acquisitions-units/memberships',
        'permissionsRequired': ['acquisitions-units.memberships.item.post'],
        'modulePermissions': ['acquisitions-units-storage.memberships.item.post']
      }, {
        'methods': ['GET'],
        'pathPattern': '/acquisitions-units/memberships/{id}',
        'permissionsRequired': ['acquisitions-units.memberships.item.get'],
        'modulePermissions': ['acquisitions-units-storage.memberships.item.get']
      }, {
        'methods': ['PUT'],
        'pathPattern': '/acquisitions-units/memberships/{id}',
        'permissionsRequired': ['acquisitions-units.memberships.item.put'],
        'modulePermissions': ['acquisitions-units-storage.memberships.item.put']
      }, {
        'methods': ['DELETE'],
        'pathPattern': '/acquisitions-units/memberships/{id}',
        'permissionsRequired': ['acquisitions-units.memberships.item.delete'],
        'modulePermissions': ['acquisitions-units-storage.memberships.item.delete']
      }]
    }, {
      'id': '_jsonSchemas',
      'version': '1.0',
      'interfaceType': 'multiple',
      'handlers': [{
        'methods': ['GET'],
        'pathPattern': '/_/jsonSchemas'
      }]
    }],
    'permissionSets': [{
      'permissionName': 'orders.collection.get',
      'displayName': 'orders - get orders collection',
      'description': 'Get orders collection'
    }, {
      'permissionName': 'orders.item.post',
      'displayName': 'orders - create a new order',
      'description': 'Create a new order'
    }, {
      'permissionName': 'orders.item.get',
      'displayName': 'orders - get an existing order',
      'description': 'Get an existing order'
    }, {
      'permissionName': 'orders.item.put',
      'displayName': 'orders - modify an existing order',
      'description': 'Modify an existing order'
    }, {
      'permissionName': 'orders.item.delete',
      'displayName': 'orders - delete an existing order',
      'description': 'Delete an existing order'
    }, {
      'permissionName': 'orders.po-lines.collection.get',
      'displayName': 'Orders - get collection of PO lines',
      'description': 'Get collection of PO lines'
    }, {
      'permissionName': 'orders.po-lines.item.post',
      'displayName': 'Orders - create a new PO line',
      'description': 'Create a new PO line'
    }, {
      'permissionName': 'orders.po-lines.item.get',
      'displayName': 'Orders - get an existing PO line',
      'description': 'Get an existing PO line'
    }, {
      'permissionName': 'orders.po-lines.item.put',
      'displayName': 'Orders - modify an existing PO line',
      'description': 'Modify an existing PO line'
    }, {
      'permissionName': 'orders.po-lines.item.delete',
      'displayName': 'Orders - delete an existing PO line',
      'description': 'Delete an existing PO line'
    }, {
      'permissionName': 'orders.po-number.item.get',
      'displayName': 'Orders - generate a PO Number',
      'description': 'Generate a PO Number'
    }, {
      'permissionName': 'orders.po-number.item.post',
      'displayName': 'Orders - validate a PO Number',
      'description': 'Validate a PO Number'
    }, {
      'permissionName': 'orders.receiving.collection.post',
      'displayName': 'Orders - Receive items',
      'description': 'Receive items spanning one or more po-lines in this order'
    }, {
      'permissionName': 'orders.check-in.collection.post',
      'displayName': 'Orders - Check-in items',
      'description': 'Check-in items spanning one or more po-lines in this order'
    }, {
      'permissionName': 'orders.receiving-history.collection.get',
      'displayName': 'Orders - Receiving history',
      'description': 'Get receiving history matching the provided criteria'
    }, {
      'permissionName': 'orders.pieces.item.post',
      'displayName': 'Orders - Piece',
      'description': 'Create piece record'
    }, {
      'permissionName': 'orders.pieces.item.put',
      'displayName': 'orders - modify an existing piece record',
      'description': 'Modify an existing piece'
    }, {
      'permissionName': 'orders.pieces.item.delete',
      'displayName': 'orders - delete an existing piece record',
      'description': 'Delete an existing piece'
    }, {
      'permissionName': 'orders.order-templates.collection.get',
      'displayName': 'Orders - Get template collection',
      'description': 'Get a collection of order templates'
    }, {
      'permissionName': 'orders.order-templates.item.post',
      'displayName': 'Orders - Create an order template',
      'description': 'Create a new order template'
    }, {
      'permissionName': 'orders.order-templates.item.get',
      'displayName': 'Orders - Get an order template',
      'description': 'Fetch an order templates'
    }, {
      'permissionName': 'orders.order-templates.item.put',
      'displayName': 'Orders - Update an order template',
      'description': 'Update an order template'
    }, {
      'permissionName': 'orders.order-templates.item.delete',
      'displayName': 'Orders - Delete an order template',
      'description': 'Delete an order template'
    }, {
      'permissionName': 'orders.order-templates.all',
      'displayName': 'All order-templates permissions',
      'description': 'All permissions for the order-templates',
      'subPermissions': ['orders.order-templates.collection.get', 'orders.order-templates.item.post', 'orders.order-templates.item.get', 'orders.order-templates.item.put', 'orders.order-templates.item.delete']
    }, {
      'permissionName': 'acquisitions-units.units.collection.get',
      'displayName': 'Acquisitions units - get units',
      'description': 'Get a collection of acquisitions units'
    }, {
      'permissionName': 'acquisitions-units.units.item.post',
      'displayName': 'Acquisitions units - create unit',
      'description': 'Create a new acquisitions unit'
    }, {
      'permissionName': 'acquisitions-units.units.item.get',
      'displayName': 'Acquisitions units - get unit',
      'description': 'Fetch an acquisitions unit'
    }, {
      'permissionName': 'acquisitions-units.units.item.put',
      'displayName': 'Acquisitions units - update unit',
      'description': 'Update an acquisitions unit'
    }, {
      'permissionName': 'acquisitions-units.units.item.delete',
      'displayName': 'Acquisitions units - delete unit',
      'description': 'Delete an acquisitions unit'
    }, {
      'permissionName': 'acquisitions-units.units.all',
      'displayName': 'All acquisitions-units perms',
      'description': 'All permissions for the acquisitions-units',
      'subPermissions': ['acquisitions-units.units.collection.get', 'acquisitions-units.units.item.post', 'acquisitions-units.units.item.get', 'acquisitions-units.units.item.put', 'acquisitions-units.units.item.delete']
    }, {
      'permissionName': 'orders.acquisitions-units-assignments.assign',
      'displayName': 'Acquisitions unit assignment - create unit assignment',
      'description': 'Assign new order to acquisitions units'
    }, {
      'permissionName': 'orders.acquisitions-units-assignments.manage',
      'displayName': 'Acquisitions units assignment - manage unit assignments',
      'description': 'Manage unit assignments during orders update'
    }, {
      'permissionName': 'orders.acquisitions-units-assignments.all',
      'displayName': 'All order acquisitions-unit-assignments permissions',
      'description': 'All permissions for the acquisitions-unit-assignments',
      'subPermissions': ['orders.acquisitions-units-assignments.assign', 'orders.acquisitions-units-assignments.manage']
    }, {
      'permissionName': 'acquisitions-units.memberships.collection.get',
      'displayName': 'Acquisitions units memberships - get units memberships',
      'description': 'Get a collection of acquisitions units memberships'
    }, {
      'permissionName': 'acquisitions-units.memberships.item.post',
      'displayName': 'Acquisitions units memberships - create units membership',
      'description': 'Create a new acquisitions units membership'
    }, {
      'permissionName': 'acquisitions-units.memberships.item.get',
      'displayName': 'Acquisitions units memberships - get units membership',
      'description': 'Fetch an acquisitions units membership'
    }, {
      'permissionName': 'acquisitions-units.memberships.item.put',
      'displayName': 'Acquisitions units memberships - update units membership',
      'description': 'Update an acquisitions units membership'
    }, {
      'permissionName': 'acquisitions-units.memberships.item.delete',
      'displayName': 'Acquisitions units memberships - delete units membership',
      'description': 'Delete an acquisitions units membership'
    }, {
      'permissionName': 'acquisitions-units.memberships.all',
      'displayName': 'All acquisitions-units perms',
      'description': 'All permissions for the acquisitions-units memberships',
      'subPermissions': ['acquisitions-units.memberships.collection.get', 'acquisitions-units.memberships.item.post', 'acquisitions-units.memberships.item.get', 'acquisitions-units.memberships.item.put', 'acquisitions-units.memberships.item.delete']
    }, {
      'permissionName': 'orders.all',
      'displayName': 'orders - all permissions',
      'description': 'Entire set of permissions needed to use orders',
      'subPermissions': ['orders.collection.get', 'orders.item.post', 'orders.item.get', 'orders.item.put', 'orders.item.delete', 'orders.po-lines.collection.get', 'orders.po-lines.item.post', 'orders.po-lines.item.get', 'orders.po-lines.item.put', 'orders.po-lines.item.delete', 'orders.po-number.item.get', 'orders.po-number.item.post', 'orders.receiving.collection.post', 'orders.check-in.collection.post', 'orders.receiving-history.collection.get', 'orders.pieces.item.post', 'orders.pieces.item.put', 'orders.pieces.item.delete', 'orders.acquisitions-units-assignments.all', 'orders.order-templates.all']
    }],
    'launchDescriptor': {
      'dockerImage': 'folioci/mod-orders:9.0.0-SNAPSHOT.230',
      'dockerPull': true,
      'env': [{
        'name': 'JAVA_OPTIONS',
        'value': '-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap'
      }],
      'dockerArgs': {
        'HostConfig': {
          'Memory': 357913941,
          'PortBindings': {
            '8081/tcp': [{
              'HostPort': '%p'
            }]
          }
        }
      }
    }
  }]);
}
