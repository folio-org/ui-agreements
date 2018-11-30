import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Accordion, Layout } from '@folio/stripes/components';

export default class Organizations extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      attachedLicenceId: PropTypes.string,
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          org: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string.isRequired,
            vendorsUuid: PropTypes.string,
          }).isRequired,
          role: PropTypes.shape({
            label: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  state = {
    displayLicenseOrgs: false,
  }

  toggleDisplayLicenseOrgs = () => {
    this.setState(prevState => ({ displayLicenseOrgs: !prevState.displayLicenseOrgs }));
  }

  renderOrgList = (orgs) => {
    return (
      <React.Fragment>
        { orgs.map((o) => (
          <div key={o.org.id}>
            {o.org.vendorsUuid ?
              <Link to={`/vendors/view/${o.org.vendorsUuid}`}>{o.org.name}</Link> :
              o.org.name
            }
            {o.role && `, ${o.role.label}`}
          </div>
        ))}
      </React.Fragment>
    );
  }

  renderOrganizations = () => {
    const { orgs } = this.props.agreement;

    if (!orgs || !orgs.length) return <FormattedMessage id="ui-agreements.organizations.agreementHasNone" />;

    return this.renderOrgList(orgs);
  }

  renderLicenseOrganizations = () => {
    const { attachedLicenceId } = this.props.agreement;

    if (!attachedLicenceId) return <FormattedMessage id="ui-agreements.license.agreementHasNone" />;

    return <FormattedMessage id="ui-agreements.license.noLicenseOrganizations" />;
  }

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Layout className="padding-bottom-gutter">
          { this.renderOrganizations() }
        </Layout>
        <Accordion
          id={`${this.props.id}-license`}
          label={<FormattedMessage id="ui-agreements.agreements.license" />}
          open={this.state.displayLicenseOrgs}
          onToggle={this.toggleDisplayLicenseOrgs}
        >
          <Layout className="padding-bottom-gutter">
            { this.renderLicenseOrganizations() }
          </Layout>
        </Accordion>
      </Accordion>
    );
  }
}
