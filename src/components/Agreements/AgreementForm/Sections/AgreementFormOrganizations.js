import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field, FieldArray } from 'redux-form';

import { withStripes } from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Col,
  Select,
  IconButton,
  Row,
} from '@folio/stripes/components';

import CreateOrganizationModal from '../../../CreateOrganizationModal';
import OrganizationSelection from '../../../OrganizationSelection';

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

  constructor(props) {
    super(props);

    this.connectedCreateOrganizationModal = props.stripes.connect(CreateOrganizationModal, { dataKey: 'createOrganizationModal' });
  }

  state = {
    roles: [],
    showCreateOrgModal: false,
  }

  static getDerivedStateFromProps(nextProps, state) {
    const roles = get(nextProps.parentResources.orgRoleValues, ['records'], []);
    if (state.roles.length !== roles.length) {
      return { roles: roles.map(({ id, label }) => ({ value: id, label })) };
    }

    return null;
  }

  onRemoveOrganization = (fields, index, org) => {
    // mod-agreements is implemented so that it doesn't expect the entire
    // array of organizations to be sent back on edits bc of the potential
    // size of that array. Instead, organization deletions are expected
    // to be sent back as an object that looks like { id: '123', _delete: true }.
    //
    // There's no "edit" function in redux-form fields so we remove
    // the stale data and append the new data with the deletion marker property.

    fields.remove(index);

    if (org.id) {
      fields.push({
        id: org.id,
        _delete: true,
      });
    }
  }

  validate = (value) => (
    !value ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
  );

  renderOrgList = ({ fields }) => {
    const agreementOrgs = fields.getAll() || [];
    const renderedOrgs = agreementOrgs.filter(org => !org._delete);

    return (
      <div>
        <div>
          { !renderedOrgs.length && <FormattedMessage id="ui-agreements.organizations.agreementHasNone" /> }
          { renderedOrgs.map((org, index) => (
            <Row key={index}>
              <Col xs={8}>
                <Field
                  component={OrganizationSelection}
                  name={`orgs[${index}].org`}
                  validate={this.validate}
                />
              </Col>
              <Col xs={3}>
                <FormattedMessage id="ui-agreements.organizations.selectRole">
                  {placeholder => (
                    <Field
                      name={`orgs[${index}].role`}
                      component={Select}
                      dataOptions={this.state.roles}
                      placeholder={placeholder}
                      validate={this.validate}
                    />
                  )}
                </FormattedMessage>
              </Col>
              <Col xs={1}>
                <IconButton
                  icon="trash"
                  onClick={() => this.onRemoveOrganization(fields, index, org)}
                />
              </Col>
            </Row>
          ))}
        </div>
        <Button onClick={() => fields.push({ })}>
          <FormattedMessage id="ui-agreements.organizations.add" />
        </Button>
      </div>
    );
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
              component={this.renderOrgList}
            />
            <Button onClick={() => this.setState({ showCreateOrgModal: true })}>
              <FormattedMessage id="ui-agreements.organizations.createNew" />
            </Button>
            <this.connectedCreateOrganizationModal
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
