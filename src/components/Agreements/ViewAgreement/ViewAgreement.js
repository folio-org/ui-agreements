import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  AccordionSet,
  Icon,
  Layout,
  Pane,
  Layer,
} from '@folio/stripes-components';

import {
  AgreementInfo,
  AgreementLines,
  AssociatedAgreements,
  Eresources,
  License,
  LicenseBusinessTerms,
  Organizations,
  VendorInfo
} from './Sections';

import EditAgreement from '../EditAgreement';

class ViewAgreement extends React.Component {
  static manifest = Object.freeze({
    selectedAgreement: {
      type: 'okapi',
      path: 'erm/sas/:{id}',
    },
    agreementLines: {
      type: 'okapi',
      path: 'erm/entitlements',
      params: {
        match: 'owner.id',
        term: ':{id}',
      },
    },
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

  getAgreement() {
    return get(this.props.resources.selectedAgreement, ['records', 0], {});
  }

  getAgreementLines() {
    return get(this.props.resources.agreementLines, ['records'], []);
  }

  getSectionProps() {
    return {
      agreement: this.getAgreement(),
      agreementLines: this.getAgreementLines(),
      onToggle: this.handleSectionToggle,
      stripes: this.props.stripes,
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  handleSubmit = (agreement) => {
    this.props.mutator.selectedAgreement.PUT(agreement)
      .then(() => this.props.onCloseEdit());
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
    const { resources: { query }, stripes: { intl } } = this.props;

    return (
      <Layer
        isOpen={query.layer === 'edit'}
        contentLabel={intl.formatMessage({ id: 'ui-erm.agreements.editAgreement' })}
      >
        <EditAgreement
          {...this.props}
          onSubmit={this.handleSubmit}
          parentMutator={this.props.mutator}
          initialValues={this.getAgreement()}
        />
      </Layer>
    );
  }

  render() {
    const agreement = this.getAgreement();
    if (!agreement) return this.renderLoadingPane();

    const { stripes } = this.props;
    const sectionProps = this.getSectionProps();

    return (
      <Pane
        id="pane-view-agreement"
        defaultWidth={this.props.paneWidth}
        paneTitle={agreement.name}
        dismissible
        onClose={this.props.onClose}
        actionMenuItems={stripes.hasPerm('ui-erm.agreements.edit') ? [{
          id: 'clickable-edit-agreement',
          title: stripes.intl.formatMessage({ id: 'ui-erm.agreements.editAgreement' }),
          label: stripes.intl.formatMessage({ id: 'ui-erm.agreements.edit' }),
          href: this.props.editLink,
          onClick: this.props.onEdit,
          icon: 'edit',
        }] : []}
      >
        <VendorInfo {...sectionProps} />
        <AccordionSet>
          <AgreementInfo id="agreementInfo" open={this.state.sections.agreementInfo} {...sectionProps} />
          <AgreementLines id="agreementLines" open={this.state.sections.agreementLines} {...sectionProps} />
          <License id="license" open={this.state.sections.license} {...sectionProps} />
          <LicenseBusinessTerms id="licenseBusinessTerms" open={this.state.sections.licenseBusinessTerms} {...sectionProps} />
          <Organizations id="organizations" open={this.state.sections.organizations} {...sectionProps} />
          <Eresources id="eresources" open={this.state.sections.eresources} {...sectionProps} />
          <AssociatedAgreements id="associatedAgreements" open={this.state.sections.associatedAgreements} {...sectionProps} />
        </AccordionSet>
        { this.renderEditLayer() }
      </Pane>
    );
  }
}

export default ViewAgreement;
