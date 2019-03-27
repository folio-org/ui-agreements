import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { FieldArray } from 'redux-form';

import { withStripes } from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Col,
  Row,
} from '@folio/stripes/components';

import { CreateOrganizationModal } from '@folio/stripes-erm-components';

import OrganizationsFieldArray from '../components/OrganizationsFieldArray';

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

  state = {
    showCreateOrgModal: false,
  }

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
            <Button onClick={() => this.setState({ showCreateOrgModal: true })}>
              <FormattedMessage id="ui-agreements.organizations.createNew" />
            </Button>
            <CreateOrganizationModal
              onClose={() => this.setState({ showCreateOrgModal: false })}
              open={this.state.showCreateOrgModal}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default withStripes(AgreementFormOrganizations);
