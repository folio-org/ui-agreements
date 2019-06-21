import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  Badge,
  Card,
  Icon,
  Layout,
  MultiColumnList
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
        <Card
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
        >
          {interfaces.length && typeof interfaces[0] === 'object' ?
            <MultiColumnList
              columnMapping={{
                name: <FormattedMessage id="ui-agreements.interface.name" />,
                username: <FormattedMessage id="ui-agreements.interface.username" />,
                password: <FormattedMessage id="ui-agreements.interface.password" />,
                type: <FormattedMessage id="ui-agreements.interface.type" />,
                notes: <FormattedMessage id="ui-agreements.interface.notes" />,
              }}
              columnWidths={{
                name: 150,
                notes: 250,
                username: 130,
                password: 130,
                type: 150,
              }}
              contentData={interfaces}
              formatter={{
                name: item => (
                  <span>
                    {item.name}
                    <a href={item.uri}>
                      <Icon icon="external-link" iconPosition="end" />
                    </a>
                  </span>
                ),
                notes: item => get(item, 'notes'),
                username: item => get(item, 'username'),
                password: item => get(item, 'password'),
                type: item => get(item, 'type').join(', '),
              }}
              interactive={false}
              visibleColumns={['name', 'username', 'password', 'type', 'notes']}
            /> : <FormattedMessage id="ui-agreements.interface.notFound" />}
        </Card>
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
