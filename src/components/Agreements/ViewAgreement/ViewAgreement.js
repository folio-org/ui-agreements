import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, difference, get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layer,
  Layout,
  Pane,
  Row,
} from '@folio/stripes/components';

import hyphenateUuid from '../../../util/hyphenateUuid';

import {
  AgreementInfo,
  AssociatedAgreements,
  Eresources,
  Finances,
  LicenseInfo,
  LicenseBusinessTerms,
  Organizations,
  VendorInfo
} from './Sections';

import EditAgreement from '../EditAgreement';

const ERESOURCES_RESULTS_INTERVAL = 100;

// Don't refresh when 'organizations' gets mutated since it's going to be in CreateOrganizationModal while
// the agreement is being edited. If we did refresh, then the entire edit process would be interrupted
// because this resource would get isPending/nulled out and we'd throw up the Loading pane in this component.
const shouldRefresh = (resource, action, refresh) => refresh && action.meta.resource !== 'organizations';

class ViewAgreement extends React.Component {
  static manifest = Object.freeze({
    selectedAgreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
      shouldRefresh,
    },
    agreementLines: {
      type: 'okapi',
      path: 'erm/entitlements',
      params: {
        match: 'owner.id',
        term: ':{id}',
      },
      shouldRefresh,
    },
    contacts: {
      type: 'okapi',
      path: 'erm/contacts',
      params: {
        match: 'owner.id',
        term: ':{id}',
      },
      shouldRefresh,
    },
    financesAgreementLines: {
      type: 'okapi',
      path: 'orders-storage/po_lines',
      params: {
        query: (_q, pathComponents, _r) => 'agreement_id==' + hyphenateUuid(`${pathComponents.id}`),
        limit: '500',
      },
      records: 'po_lines',
      shouldRefresh,
      throwErrors: false,
    },
    invoices: {
      type: 'okapi',
      path: 'invoice-storage/invoice-lines',
      records: 'invoiceLines',
      fetch: false,
      accumulate: true,
    },
    agreementEresources: {
      type: 'okapi',
      path: 'erm/sas/:{id}/resources',
      params: {
        stats: 'true',
        sort: 'pti.titleInstance.name;asc',
      },
      records: 'results',
      recordsRequired: '%{agreementEresourcesCount}',
      perRequest: ERESOURCES_RESULTS_INTERVAL,
      limitParam: 'perPage',
      shouldRefresh,
    },
    users: {
      type: 'okapi',
      path: '/users',
      fetch: false,
      accumulate: true,
    },
    agreementEresourcesCount: { initialValue: ERESOURCES_RESULTS_INTERVAL },
    query: {},
  });

  static propTypes = {
    editLink: PropTypes.string,
    match: PropTypes.object,
    mutator: PropTypes.object,
    onClose: PropTypes.func,
    onCloseEdit: PropTypes.func,
    onEdit: PropTypes.func,
    parentMutator: PropTypes.object,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    resources: PropTypes.object,
    stripes: PropTypes.object,
  };

  state = {
    sections: {
      agreementInfo: true,
      agreementLines: false,
      finances: false,
      licenseInfo: false,
      licenseBusinessTerms: false,
      organizations: false,
      eresourcesAgreementLines: false,
      associatedAgreements: false,
    }
  }

  componentDidMount() {
    this.fetchUsers();
    this.fetchInvoices();
  }

  componentDidUpdate(prevProps) {
    const prevUsers = get(prevProps.resources.contacts, ['records'], []).map(c => c.user);
    const users = get(this.props.resources.contacts, ['records'], []).map(c => c.user);
    const prevFinances = get(prevProps.resources.financesAgreementLines, ['records'], []).map(f => f.id);
    const finances = get(this.props.resources.financesAgreementLines, ['records'], []).map(f => f.id);
    const prevAgreement = get(prevProps.resources.selectedAgreement, ['records', 0], {});
    const agreement = get(this.props.resources.selectedAgreement, ['records', 0], {});

    if ((prevAgreement.id !== agreement.id) || (difference(users, prevUsers).length)) {
      this.fetchUsers();
    }
    if ((prevAgreement.id !== agreement.id) || (difference(finances, prevFinances).length)) {
      this.fetchInvoices();
    }
  }

  getAgreement() {
    return get(this.props.resources.selectedAgreement, ['records', 0], {});
  }

  getAgreementLines() {
    const isPending = get(this.props.resources.agreementLines, ['isPending'], true);
    if (isPending) return undefined;

    return get(this.props.resources.agreementLines, ['records'], []);
  }

  getContacts() {
    const isPending =
      get(this.props.resources.contacts, ['isPending'], true) ||
      get(this.props.resources.users, ['isPending'], true);

    if (isPending) return undefined;

    const contacts = get(this.props.resources.contacts, ['records'], []);
    const users = get(this.props.resources.users, ['records'], []);

    return contacts.map((contact, i) => ({
      ...users[i],
      ...contact,
    }));
  }

  getUser(userId) {
    const users = get(this.props.resources.users, ['records'], []);
    return users.find(u => u.id === userId);
  }

  getFinancesAgreementLines() {
    const isPending = get(this.props.resources.financesAgreementLines, ['isPending'], true);
    if (isPending) return undefined;

    return get(this.props.resources.financesAgreementLines, ['records'], []);
  }

  getInvoices() {
    const isPending = get(this.props.resources.invoices, ['isPending'], true);
    if (isPending) return undefined;

    return get(this.props.resources.invoices, ['records'], []);
  }

  getInitialValues() {
    const agreement = cloneDeep(this.getAgreement());
    const {
      agreementStatus = {},
      renewalPriority = {},
      isPerpetual = {},
      contacts = [],
      orgs = [],
      linkedLicenses = [],
      items = [],
    } = agreement;

    if (agreementStatus.id) {
      agreement.agreementStatus = agreementStatus.id;
    }

    if (renewalPriority.id) {
      agreement.renewalPriority = renewalPriority.id;
    }

    if (isPerpetual.id) {
      agreement.isPerpetual = isPerpetual.id;
    }

    if (contacts.length) {
      agreement.contacts = contacts.map(c => ({
        ...c,
        role: c.role ? c.role.id : undefined,
      }));
    }

    if (orgs.length) {
      agreement.orgs = orgs.map(o => ({ ...o, role: o.role.id }));
    }

    if (linkedLicenses.length) {
      agreement.linkedLicenses = linkedLicenses.map(l => ({
        ...l,
        status: l.status.id,
      }));
    }

    const agreementLines = this.getAgreementLines() || [];
    if (items.length && agreementLines.length) {
      agreement.items = items.map(item => {
        if (item.resource) {
          return item;
        } else {
          const foundLine = agreementLines.find(line => line.id === item.id);
          if (!foundLine) return item;

          return {
            id: foundLine.id,
            coverage: foundLine.customCoverage ? foundLine.coverage : undefined,
          };
        }
      });
    }

    return agreement;
  }

  getSectionProps() {
    return {
      agreement: this.getAgreement(),
      agreementLines: this.getAgreementLines(),
      contacts: this.getContacts(),
      financesAgreementLines: this.getFinancesAgreementLines(),
      invoices: this.getInvoices(),
      onToggle: this.handleSectionToggle,
      parentMutator: {
        ...this.props.parentMutator,
        ...this.props.mutator
      },
      parentResources: {
        ...this.props.parentResources,
        ...this.props.resources
      },
      stripes: this.props.stripes,
    };
  }

  fetchUsers = () => {
    const { mutator: { users } } = this.props;
    const contacts = get(this.props.resources.contacts, ['records'], []);

    users.reset();
    contacts.forEach(contact => users.GET({ path: `users/${contact.user}` }));
  };

  fetchInvoices = () => {
    if (!this.props.stripes.hasInterface('invoice-storage.invoice-line', '1.0')) {
      return;
    }

    const poLines = this.getFinancesAgreementLines();
    if (poLines === undefined) {
      return;
    }

    const { mutator: { invoices } } = this.props;
    invoices.reset();

    if (!poLines.length) {
      return;
    }

    const query = poLines.map(poLine => 'poLineId=' + poLine.id).join(' OR ');
    invoices.GET({
      params: { query },
    });
  };

  fetchMoreEresources = () => {
    const { agreementEresourcesCount } = this.props.resources;
    this.props.mutator.agreementEresourcesCount.replace(agreementEresourcesCount + ERESOURCES_RESULTS_INTERVAL);
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
  }

  renderLoadingPane() {
    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth="60%"
        paneTitle="Loading..."
        dismissible
        onClose={this.props.onClose}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="100px" />
        </Layout>
      </Pane>
    );
  }

  renderEditLayer() {
    const { resources: { query } } = this.props;

    return (
      <FormattedMessage id="ui-agreements.agreements.editAgreement">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'edit'}
            contentLabel={layerContentLabel}
          >
            <EditAgreement
              {...this.props}
              agreement={this.getAgreement()}
              agreementLines={this.getAgreementLines()}
              contacts={this.getContacts()}
              onCancel={this.props.onCloseEdit}
              parentMutator={{
                ...this.props.parentMutator,
                ...this.props.mutator
              }}
              parentResources={{
                ...this.props.parentResources,
                ...this.props.resources
              }}
              initialValues={this.getInitialValues()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  render() {
    const agreement = this.getAgreement();
    const agreementLines = this.getAgreementLines();
    if (!agreement || agreementLines === undefined) return this.renderLoadingPane();

    const { stripes } = this.props;
    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth="60%"
        paneTitle={agreement.name}
        dismissible
        onClose={this.props.onClose}
        actionMenu={({ onToggle }) => {
          if (!stripes.hasPerm('ui-agreements.agreements.edit')) return null;

          const handleClick = () => {
            this.props.onEdit();
            onToggle();
          };

          return (
            <React.Fragment>
              <Button
                buttonStyle="dropdownItem"
                id="clickable-edit-agreement"
                href={this.props.editLink}
                onClick={handleClick}
              >
                <Icon icon="edit">
                  <FormattedMessage id="ui-agreements.agreements.edit" />
                </Icon>
              </Button>
            </React.Fragment>
          );
        }}
      >
        <VendorInfo {...sectionProps} />
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
            </Col>
          </Row>
          <AgreementInfo
            id="agreementInfo"
            open={this.state.sections.agreementInfo}
            {...sectionProps}
          />
          <Finances
            id="finances"
            open={this.state.sections.finances}
            {...sectionProps}
          />
          <LicenseInfo
            id="licenseInfo"
            open={this.state.sections.licenseInfo}
            {...sectionProps}
          />
          <LicenseBusinessTerms
            id="licenseBusinessTerms"
            open={this.state.sections.licenseBusinessTerms}
            {...sectionProps}
          />
          <Organizations
            id="organizations"
            open={this.state.sections.organizations}
            {...sectionProps}
          />
          <Eresources
            id="eresourcesAgreementLines"
            open={this.state.sections.eresourcesAgreementLines}
            fetchMoreEresources={this.fetchMoreEresources}
            {...sectionProps}
          />
          <AssociatedAgreements
            id="associatedAgreements"
            open={this.state.sections.associatedAgreements}
            {...sectionProps}
          />
        </AccordionSet>
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewAgreement;
