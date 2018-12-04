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
  OptionSegment,
  Select,
  Selection,
  IconButton,
  Row,
} from '@folio/stripes/components';

import CreateOrganizationModal from '../../../CreateOrganizationModal';

class AgreementFormOrganizations extends React.Component {
  static propTypes = {
    change: PropTypes.func,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.connectedCreateOrganizationModal = props.stripes.connect(CreateOrganizationModal);
  }

  state = {
    orgs: [],
    roles: [],
    showCreateOrgModal: false,
  }

  static getDerivedStateFromProps(nextProps, state) {
    const newState = {};

    const orgs = get(nextProps.parentResources.orgs, ['records'], []);
    if (!state.orgs.length && orgs.length) {
      newState.orgs = orgs.map(({ id, name }) => ({ value: id, label: name }));
    }

    const roles = get(nextProps.parentResources.orgRoleValues, ['records'], []);
    if (!state.roles.length && roles.length) {
      newState.roles = roles.map(({ label }) => ({ value: label, label }));
    }

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderOrgList = ({ fields }) => {
    const agreementOrgs = fields.getAll() || [];

    return (
      <div>
        <div>
          { !agreementOrgs.length && <FormattedMessage id="ui-agreements.organizations.agreementHasNone" /> }
          { agreementOrgs.map((_, index) => ((
            <Row key={index}>
              <Col xs={8}>
                <FormattedMessage id="ui-agreements.organizations.selectOrg">
                  {placeholder => (
                    <Field
                      name={`orgs[${index}].org`}
                      component={Selection}
                      dataOptions={this.state.orgs}
                      formatter={(props) => {
                        return <OptionSegment {...props}>{props.option.label}</OptionSegment>;
                      }}
                      onFilter={(searchString, orgs) => {
                        return orgs.filter(org => {
                          return org.label.toLowerCase().includes(searchString.toLowerCase());
                        });
                      }}
                      placeholder={placeholder}
                    />
                  )}
                </FormattedMessage>
              </Col>
              <Col xs={3}>
                <FormattedMessage id="ui-agreements.organizations.selectRole">
                  {placeholder => (
                    <Field
                      name={`orgs[${index}].role`}
                      component={Select}
                      dataOptions={this.state.roles}
                      placeholder={placeholder}
                    />
                  )}
                </FormattedMessage>
              </Col>
              <Col xs={1}>
                <IconButton
                  icon="trash"
                  onClick={() => fields.remove(index)}
                />
              </Col>
            </Row>
          )))}
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
