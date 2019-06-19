import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { FieldArray } from 'redux-form';

import { withStripes } from '@folio/stripes/core';
import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';

import { OrganizationsFieldArray } from '@folio/stripes-erm-components';

class AgreementFormOrganizations extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      orgRoleValues: PropTypes.object,
    }),
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  };

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <FieldArray
              name="orgs"
              component={OrganizationsFieldArray}
              roles={get(this.props.parentResources.orgRoleValues, ['records'], [])}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default withStripes(AgreementFormOrganizations);
