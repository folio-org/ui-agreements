import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field, FieldArray } from 'redux-form';

import {
  Accordion,
  Button,
  Col,
  Select,
  Selection,
  IconButton,
  Row,
} from '@folio/stripes/components';

class AgreementFormOrganizations extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.object,
  };

  state = {
    orgs: [],
    roles: [],
  }

  static getDerivedStateFromProps(nextProps, state) {
    const newState = {};

    const orgs = get(nextProps.parentResources.orgs, ['records'], []);
    if (!state.orgs.length && orgs.length) {
      return {
        ...newState,
        orgs: orgs.map(org => ({
          label: org.name,
          value: org.name,
        })),
      };
    }

    const roles = get(nextProps.parentResources.orgRoleValues, ['records'], []);
    if (!state.roles.length && roles.length) {
      return {
        ...newState,
        roles: roles.map(role => ({
          value: role.label,
          label: role.label,
        })),
      };
    }

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderField = ({ fields }) => {
    const orgs = fields.getAll() || [];

    return (
      <div>
        <div>
          { !orgs.length && <FormattedMessage id="ui-agreements.organizations.agreementHasNone" /> }
          { orgs.map((_, index) => ((
            <Row>
              <Col xs={8}>
                <Field
                  name={`orgs[${index}].org.name`}
                  component={Selection}
                  dataOptions={this.state.orgs}
                />
              </Col>
              <Col xs={3}>
                <Field
                  name={`orgs[${index}].role`}
                  component={Select}
                  defaultValue={this.state.roles[0]}
                  dataOptions={this.state.roles}
                />
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
        <Button onClick={() => fields.push({ role: this.state.roles[0] })}>
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
              component={this.renderField}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default AgreementFormOrganizations;
