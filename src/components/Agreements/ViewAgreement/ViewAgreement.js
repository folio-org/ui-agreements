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

import {
  AgreementInfo,
  AssociatedAgreements,
  Eresources,
  License,
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
    eresources: {
      type: 'okapi',
      path: 'erm/sas/:{id}/resources',
      params: {
        stats: 'true',
        sort: 'pti.titleInstance.name;asc',
      },
      records: 'results',
      recordsRequired: '%{eresourcesCount}',
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
    eresourcesCount: { initialValue: ERESOURCES_RESULTS_INTERVAL },
    query: {},
  });

  static propTypes = {
    match: PropTypes.object,
    onClose: PropTypes.func,
    parentResources: PropTypes.object,
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stripes: PropTypes.object,
  };

  state = {
    sections: {
      agreementInfo: true,
      agreementLines: false,
      license: false,
      licenseBusinessTerms: false,
      organizations: false,
      eresources: false,
      associatedAgreements: false,
    }
  }

  componentDidMount() {
    this.fetchUsers();
  }

  componentDidUpdate(prevProps) {
    const prevUsers = get(prevProps.resources.contacts, ['records'], []).map(c => c.user);
    const users = get(this.props.resources.contacts, ['records'], []).map(c => c.user);
    const prevAgreement = get(prevProps.resources.selectedAgreement, ['records', 0], {});
    const agreement = get(this.props.resources.selectedAgreement, ['records', 0], {});

    if ((prevAgreement.id !== agreement.id) || (difference(users, prevUsers).length)) {
      this.fetchUsers();
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

  getInitialValues() {
    const agreement = cloneDeep(this.getAgreement());
    const { agreementStatus, renewalPriority, isPerpetual, contacts, orgs } = agreement;

    if (agreementStatus && agreementStatus.id) {
      agreement.agreementStatus = agreementStatus.id;
    }

    if (renewalPriority && renewalPriority.id) {
      agreement.renewalPriority = renewalPriority.id;
    }

    if (isPerpetual && isPerpetual.id) {
      agreement.isPerpetual = isPerpetual.id;
    }

    if (orgs && orgs.length) {
      agreement.orgs = orgs.map(o => ({ ...o, role: o.role.id }));
    }

    if (contacts) {
      agreement.contacts = contacts.map(c => ({
        ...c,
        role: c.role ? c.role.id : undefined,
      }));
    }

    return agreement;
  }

  getSectionProps() {
    return {
      agreement: this.getAgreement(),
      agreementLines: this.getAgreementLines(),
      contacts: this.getContacts(),
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
  }

  fetchMoreEresources = () => {
    const { eresourcesCount } = this.props.resources;
    this.props.mutator.eresourcesCount.replace(eresourcesCount + ERESOURCES_RESULTS_INTERVAL);
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
        defaultWidth={this.props.paneWidth}
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
        defaultWidth={this.props.paneWidth}
        paneTitle={agreement.name}
        dismissible
        onClose={this.props.onClose}
        actionMenu={() => {
          if (!stripes.hasPerm('ui-agreements.agreements.edit')) return null;

          return (
            <React.Fragment>
              <Button
                buttonStyle="dropdownItem"
                id="clickable-edit-agreement"
                href={this.props.editLink}
                onClick={this.props.onEdit}
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
          <License
            id="license"
            open={this.state.sections.license}
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
            id="eresources"
            open={this.state.sections.eresources}
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
