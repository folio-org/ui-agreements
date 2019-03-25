import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  IconButton,
  Label,
  Layout,
  Row,
  Select,
} from '@folio/stripes/components';

import {
  OrganizationSelection,
  withKiwtFieldArray,
} from '@folio/stripes-erm-components';

class OrganizationsFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/no-unused-prop-types
  }

  state = {
    roles: [],
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { roles } = nextProps;
    if (state.roles.length !== roles.length) {
      return {
        roles: roles.map(({ id, label }) => ({ value: id, label })),
      };
    }

    return null;
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-agreements.organizations.agreementHasNone" />
    </Layout>
  )

  renderOrgs = () => {
    return (
      <React.Fragment>
        { this.renderOrgsHeaders() }
        { this.renderOrgsList() }
      </React.Fragment>
    );
  }

  renderOrgsHeaders = () => (
    <Row>
      <Col xs={8}>
        <Label required tagName="span">
          <FormattedMessage id="ui-agreements.organizations.name" />
        </Label>
      </Col>
      <Col xs={3}>
        <Label required tagName="span">
          <FormattedMessage id="ui-agreements.organizations.role" />
        </Label>
      </Col>
    </Row>
  )

  renderOrgsList = () => {
    const { items, name, onDeleteField } = this.props;

    return items.map((org, i) => (
      <Row key={i}>
        <Col xs={8}>
          <Field
            component={OrganizationSelection}
            id={`org-name-${i}`}
            name={`${name}[${i}].org`}
            required
          />
        </Col>
        <Col xs={3}>
          <FormattedMessage id="ui-agreements.organizations.selectRole">
            {placeholder => (
              <Field
                component={Select}
                dataOptions={this.state.roles}
                id={`org-role-${i}`}
                name={`${name}[${i}].role`}
                placeholder={placeholder}
                required
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={1}>
          <IconButton
            icon="trash"
            id={`org-delete-${i}`}
            onClick={() => onDeleteField(i, org)}
          />
        </Col>
      </Row>
    ));
  }

  render = () => {
    const { items, onAddField } = this.props;

    return (
      <div>
        <div>
          { items.length ? this.renderOrgs() : this.renderEmpty() }
        </div>
        <Button
          id="add-agreement-org-btn"
          onClick={() => onAddField({})}
        >
          <FormattedMessage id="ui-agreements.organizations.add" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(OrganizationsFieldArray);
