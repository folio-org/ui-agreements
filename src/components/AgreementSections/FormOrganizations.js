import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { Accordion } from '@folio/stripes/components';
import { OrganizationCard } from '@folio/stripes-erm-components';
import { isEmpty } from 'lodash';

export default class FormOrganizations extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      orgRoleValues: PropTypes.array,
      orgs: PropTypes.object,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { data, id, onToggle, open } = this.props;
    const { orgs } = this.props.data;
    const attachedOrgs = !isEmpty(orgs) ? orgs.orgs : [];
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        open={open}
        onToggle={onToggle}
      >
        <FieldArray
          name="orgs"
          component={OrganizationCard}
          roles={data.orgRoleValues}
          organizations={attachedOrgs}
        />
      </Accordion>
    );
  }
}
