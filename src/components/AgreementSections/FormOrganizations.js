import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { Accordion } from '@folio/stripes/components';
import { OrganizationsFieldArray } from '@folio/stripes-erm-components';

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
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        open={open}
        onToggle={onToggle}
      >
        <FieldArray
          name="orgs"
          component={OrganizationsFieldArray}
          roles={data.orgRoleValues}
        />
      </Accordion>
    );
  }
}
