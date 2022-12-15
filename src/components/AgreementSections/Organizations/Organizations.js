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

import { urls } from '../../utilities';

export default class Organizations extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          interfaces: PropTypes.arrayOf(PropTypes.object),
          note: PropTypes.string,
          org: PropTypes.shape({
            name: PropTypes.string.isRequired,
            orgsUuid: PropTypes.string,
          }).isRequired,
          roles: PropTypes.arrayOf(
            PropTypes.shape({
              role: PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
              }).isRequired,
            })
          ),
        }),
      ),
    }).isRequired,
    id: PropTypes.string,
  };

  renderOrganizations = () => {
    const { agreement: { orgs = [] } } = this.props;

    return orgs.map(o => {
      const { interfaces, note, org, primaryOrg, roles } = o;
      if (!org || !roles.length) return null;

      return (
        <ViewOrganizationCard
          key={`${org.orgsUuid}`}
          data-test-organizations-org
          headerStart={
            <span>
              <AppIcon app="organizations" size="small">
                <Link to={urls.orgView(org.orgsUuid)}>
                  <strong>{org.name}</strong>
                </Link>
                {primaryOrg ? ' . ' : null}
                {primaryOrg ? <FormattedMessage id="ui-agreements.organizations.primary" /> : null}
              </AppIcon>
            </span>
          }
          interfaces={interfaces}
          note={note}
          org={org}
          roles={roles}
        />
      );
    });
  }

  renderNoOrganizations = () => (
    <FormattedMessage id="ui-agreements.emptyAccordion.organizations" />
  );

  renderBadge = () => {
    const count = get(this.props.agreement, 'orgs.length', 0);
    return <Badge>{count}</Badge>;
  }

  render() {
    const { agreement: { orgs = [] }, id } = this.props;
    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
      >
        <Layout className="padding-bottom-gutter">
          {orgs.length ? this.renderOrganizations() : this.renderNoOrganizations()}
        </Layout>
      </Accordion>
    );
  }
}
