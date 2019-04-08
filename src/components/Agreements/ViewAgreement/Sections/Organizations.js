import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Accordion, Badge, Icon, Layout } from '@folio/stripes/components';

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
        { orgs.map((o, index) => (
          <Layout className="marginTopHalf" key={index}>
            {o.org.vendorsUuid ?
              <Link to={`/vendors/view/${o.org.vendorsUuid}`}>{o.org.name}</Link> :
              o.org.name
            }
            {o.role && `, ${o.role.label}`}
          </Layout>
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

    if (!attachedLicenceId) return <FormattedMessage id="ui-agreements.license.noLicenses" />;

    return <FormattedMessage id="ui-agreements.license.noLicenseOrganizations" />;
  }

  renderBadge = () => {
    const count = get(this.props.agreement, ['orgs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  render() {
    return (
      <Accordion
        id={this.props.id}
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Layout className="padding-bottom-gutter">
          { this.renderOrganizations() }
        </Layout>
        <div style={{ marginLeft: '2rem' }}>
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
        </div>
      </Accordion>
    );
  }
}
