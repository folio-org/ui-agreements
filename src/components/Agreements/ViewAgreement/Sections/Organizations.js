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

  renderOrgList = (orgs) => {
    return (
      <React.Fragment>
        {orgs.map(o => (
          o.org ?
            <Layout className="marginTopHalf" key={o.org.id}>
              {o.org.orgsUuid ?
                <Link to={`/vendors/view/${o.org.orgsUuid}`}>{o.org.name}</Link> :
                o.org.name
              }
              {o.role && `, ${o.role.label}`}
            </Layout> : null
        ))}
      </React.Fragment>
    );
  }

  renderOrganizations = () => {
    const { orgs } = this.props.agreement;

    if (!orgs || !orgs.length) return <FormattedMessage id="ui-agreements.organizations.agreementHasNone" />;

    return this.renderOrgList(orgs);
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
          {this.renderOrganizations()}
        </Layout>
      </Accordion>
    );
  }
}
