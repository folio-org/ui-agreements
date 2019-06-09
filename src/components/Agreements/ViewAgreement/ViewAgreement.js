import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { cloneDeep, difference, get, keyBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { withTags, NotesSmartAccordion } from '@folio/stripes/smart-components';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  IconButton,
  Layer,
  Layout,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import hyphenateUuid from '../../../util/hyphenateUuid';

import {
  AgreementInfo,
  AssociatedAgreements,
  Eresources,
  Finances,
  InternalContacts,
  LicenseInfo,
  LicenseBusinessTerms,
  Organizations,
  SupplementaryInfo,
  VendorInfo,
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
      shouldRefresh: (resource, action, refresh) => {
        const { path } = action.meta;
        return refresh || (path && path.match(/link/));
      },
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
    interface: {
      type: 'okapi',
      path: 'organizations-storage/interfaces',
      accumulate: 'true',
      fetch: false,
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
    location: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.object,
    onClose: PropTypes.func,
    onCloseEdit: PropTypes.func,
    onEdit: PropTypes.func,
    parentMutator: PropTypes.object,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    resources: PropTypes.object,
    stripes: PropTypes.object,
    tagsEnabled: PropTypes.bool,
    tagsToggle: PropTypes.func,
  };

  state = {
    sections: {
      agreementLines: false,
      finances: false,
      internalContacts: false,
      licenseInfo: false,
      licenseBusinessTerms: false,
      organizations: false,
      eresourcesAgreementLines: false,
      supplementaryInfo: false,
      associatedAgreements: false,
      agreementNotes: false,
    }
  }

  componentDidMount() {
    this.fetchUsers();
    this.fetchInvoices();
    this.fetchInterfaces();
  }

  componentDidUpdate(prevProps) {
    const prevUsers = get(prevProps.resources.contacts, ['records'], []).map(c => c.user);
    const users = get(this.props.resources.contacts, ['records'], []).map(c => c.user);
    const prevFinances = get(prevProps.resources.financesAgreementLines, ['records'], []).map(f => f.id);
    const finances = get(this.props.resources.financesAgreementLines, ['records'], []).map(f => f.id);
    const prevAgreement = get(prevProps.resources.selectedAgreement, ['records', 0], {});
    const agreement = get(this.props.resources.selectedAgreement, ['records', 0], {});
    const prevOrgs = get(prevProps.resources.selectedAgreement, ['records', 0, 'orgs'], []).map(o => get(o, ['org', 'id']));
    const orgs = get(this.props.resources.selectedAgreement, ['records', 0, 'orgs'], []).map(o => get(o, ['org', 'id']));

    if ((prevAgreement.id !== agreement.id) || (difference(orgs, prevOrgs).length)) {
      this.fetchInterfaces();
    }

    if ((prevAgreement.id !== agreement.id) || (difference(users, prevUsers).length)) {
      this.fetchUsers();
    }
    if ((prevAgreement.id !== agreement.id) || (difference(finances, prevFinances).length)) {
      this.fetchInvoices();
    }
  }

  fetchInterfaces = () => {
    const { orgs } = this.getAgreement();
    const ids = [];
    if (orgs && orgs.length) {
      orgs.forEach(org => {
        const interfaces = get(org.org, ['orgsUuid_object', 'interfaces'], []);
        ids.push(...interfaces.map(id => `id==${id}`));
      });
      const query = [...new Set(ids)].join(' or ');
      this.props.mutator.interface.reset();
      if (ids && ids.length) this.props.mutator.interface.GET({ params: { query } });
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

  getOrganizations() {
    const isPending = get(this.props.resources.interface, ['isPending'], true);
    if (isPending) return undefined;
    const interfaces = get(this.props.resources, ['interface', 'records', 0, 'interfaces'], []);
    const interfaceMap = keyBy(interfaces, 'id');
    const { orgs } = this.getAgreement();
    const organizations = orgs && orgs.map(o => {
      const orgInterfaces = get(o.org, ['orgsUuid_object', 'interfaces'], []);
      return {
        ...o,
        org: {
          ...o.org,
          interfaces: orgInterfaces.map(i => interfaceMap[i]),
        }
      };
    });
    return organizations;
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
        role: c.role ? c.role.value : undefined,
      }));
    }

    if (orgs.length) {
      agreement.orgs = orgs.map(o => ({ ...o, role: o.role ? o.role.value : undefined }));
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
      handlers: this.props.handlers,
      organizations: this.getOrganizations(),
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
              organizations={this.getOrganizations()}
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

  renderDetailMenu(agreement) {
    const {
      tagsEnabled,
      tagsToggle,
    } = this.props;

    const tags = get(agreement, 'tags', []);

    return (
      <PaneMenu>
        {
          tagsEnabled &&
          <FormattedMessage id="ui-agreements.agreements.showTags">
            {ariaLabel => (
              <IconButton
                icon="tag"
                id="clickable-show-tags"
                badgeCount={tags.length}
                onClick={tagsToggle}
                ariaLabel={ariaLabel}
              />
            )}
          </FormattedMessage>
        }
      </PaneMenu>
    );
  }

  render() {
    const { stripes, location, match } = this.props;
    const query = location.search ? queryString.parse(location.search) : {};
    const width = (query.helper) ? '50%' : '60%';
    const key = (query.helper) ? 'smallPane' : 'largePane';
    const agreement = this.getAgreement();
    const agreementLines = this.getAgreementLines();
    if (!agreement || agreementLines === undefined) return this.renderLoadingPane();
    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth={width}
        key={key}
        paneTitle={agreement.name}
        lastMenu={this.renderDetailMenu(agreement)}
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
        <AgreementInfo id="agreementInfo" {...sectionProps} />
        <AccordionSet>
          <Row end="xs">
            <Col xs>
              <ExpandAllButton accordionStatus={this.state.sections} onToggle={this.handleAllSectionsToggle} />
            </Col>
          </Row>
          <InternalContacts
            id="internalContacts"
            open={this.state.sections.internalContacts}
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
          <SupplementaryInfo
            id="supplementaryInfo"
            open={this.state.sections.supplementaryInfo}
            {...sectionProps}
          />
          <AssociatedAgreements
            id="associatedAgreements"
            open={this.state.sections.associatedAgreements}
            {...sectionProps}
          />
          <NotesSmartAccordion
            domainName="agreements"
            entityName={agreement.name}
            entityType="agreement"
            entityId={match.params.id}
            id="agreementNotes"
            onToggle={this.handleSectionToggle}
            open={this.state.sections.agreementNotes}
            pathToNoteCreate="/erm/notes/new"
            pathToNoteDetails="/erm/notes"
          />
        </AccordionSet>
        {this.renderEditLayer()}
      </Pane>
    );
  }
}

export default withTags(ViewAgreement);
