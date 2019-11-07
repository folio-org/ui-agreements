// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
import { get, isEmpty } from 'lodash';
import parseQueryString from './util';

export default function config() {
  this.get('/configurations/entries', {
    configs: []
  });

  this.get('/erm/resource/electronic', (schema, request) => {
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

    if (parsed) {
      return {
        results: schema.eresources.where((eresource) => {
          return parsed.reduce((acc, { name, value }) => {
            return acc || get(eresource, name) === value;
          }, false);
        }).models
      };
    } else {
      return { results: schema.eresources.all().models };
    }
  });

  this.get('erm/resource/:id', (schema, request) => {
    return schema.eresources.find(request.params.id).attrs;
  });

  this.get('/erm/kbs', () => []);

  this.get('/note-types', () => []);

  this.get('erm/resource/:id/entitlementOptions', () => []);

  this.get('erm/resource/:id/entitlements', {
    results: []
  });

  this.get('/erm/packages/:id/content/current', (schema) => {
    return {
      results: schema.pcis.where(pci => {
        if (!pci.accessEnd && new Date(pci.accessStart).getTime() < new Date().getTime()) {
          return pci;
        }
      }).models
    };
  });

  this.get('/erm/packages/:id/content/future', (schema) => {
    return {
      results: schema.pcis.where(pci => {
        if (!pci.accessEnd && new Date(pci.accessStart).getTime() > new Date().getTime()) {
          return pci;
        }
      }).models
    };
  });

  this.get('/erm/packages/:id/content/dropped', (schema) => {
    return {
      results: schema.pcis.where(pci => {
        if (!pci.accessStart && new Date(pci.accessEnd).getTime() < new Date().getTime()) {
          return pci;
        }
      }).models
    };
  });

  this.get('/note-links/domain/agreements/type/eresource/id/:id', () => []);

  this.get('/erm/sas', {
    results: []
  });

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

  this.post('erm/sas', (_, request) => {
    const body = JSON.parse(request.requestBody);
    return this.create('agreement', body).attrs;
  });

  this.get('/erm/org', () => []);

  this.get('/erm/contacts', {
    results: []
  });

  this.get('/users', (schema, request) => {
    console.log(request.queryParams, 'nattuga');
    return schema.contacts.all();
  });

  this.get('note-links/domain/agreements/type/agreement/id/:id', () => { });

  this.get('/note-types', () => { });

  this.get('/erm/sas/:id', (schema, request) => {
    return schema.agreements.find(request.params.id);
  });

  this.get('/erm/sas/:id/resources/current', (schema, request) => {
    const agreement = schema.agreements.find(request.params.id).attrs;
    const items = agreement.items;
    if (!items) return { results: [] };
    return {
      results: items.map(item => {
        return {
          _object: schema.pcis.all().models.find(pci => pci.pkg.id === item.resource.id && !pci.accessEnd && new Date(pci.accessStart).getTime() < new Date().getTime())
        };
      })
    };
  });

  this.get('/erm/sas/:id/resources/future', (schema, request) => {
    const agreement = schema.agreements.find(request.params.id).attrs;
    return {
      results: agreement.items.map(item => {
        return {
          _object: schema.pcis.all().models.find(pci => pci.pkg.id === item.resource.id && !pci.accessEnd && new Date(pci.accessStart).getTime() > new Date().getTime())
        };
      })
    };
  });

  this.get('/erm/sas/:id/resources/dropped', (schema, request) => {
    const agreement = schema.agreements.find(request.params.id).attrs;
    return {
      results: agreement.items.map(item => {
        return {
          _object: schema.pcis.all().models.find(pci => pci.pkg.id === item.resource.id && !pci.accessStart && new Date(pci.accessEnd).getTime() < new Date().getTime())
        };
      })
    };
  });

  this.get('/erm/entitlements', {
    results: []
  });

  this.get('/licenses/custprops', () => []);

  this.get('/tags', {
    tags: []
  });

  this.post('erm/sas/:id/clone', (schema, request) => {
    const body = JSON.parse(request.requestBody);
    return schema.agreements.find(request.params.id).attrs;
  });
}
