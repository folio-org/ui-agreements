import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { ViewOrganizationCard } from '@folio/stripes-erm-components';
import {
  Accordion,
  Badge,
  Layout,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

export default class Organizations extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          interfaces: PropTypes.array.isRequired,
          org: PropTypes.shape({
            name: PropTypes.string.isRequired,
            orgsUuid: PropTypes.string,
          }).isRequired,
          role: PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderOrganizations = () => {
    const { agreement: { orgs = [] } } = this.props;

    return orgs.map(o => {
      const { interfaces, org, role } = o;
      if (!org || !role) return null;

      return (
        <ViewOrganizationCard
          data-test-organizations-org
          key={`${org.orgsUuid}-${role.value}`}
          headerStart={
            <span>
              <AppIcon
                app="organizations"
                size="small"
              />
              &nbsp;
              <Link to={`/organizations/view/${org.orgsUuid}`}>
                {org.name}
              </Link>
              {` · ${role.label}`}
            </span>
          }
          interfaces={interfaces}
        />
      );
    });
  }

  renderNoOrganizations = () => (
    <FormattedMessage id="ui-agreements.organizations.agreementHasNone" />
  );

  renderBadge = () => {
    const count = get(this.props.agreement, 'orgs.length', 0);
    return <Badge>{count}</Badge>;
  }

  render() {
    const { agreement: { orgs = [] }, id, open, onToggle } = this.props;
    return (
      <Accordion
        id={id}
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        open={open}
        onToggle={onToggle}
      >
        <Layout className="padding-bottom-gutter">
          { orgs.length ? this.renderOrganizations() : this.renderNoOrganizations() }
        </Layout>
      </Accordion>
    );
  }
}
