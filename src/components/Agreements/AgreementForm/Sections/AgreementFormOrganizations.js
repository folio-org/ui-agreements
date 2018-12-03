import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field, FieldArray } from 'redux-form';

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

const CREATE_NEW_ORG_VALUE = 'CREATE_NEW_ORGANIZATION';

class AgreementFormOrganizations extends React.Component {
  static propTypes = {
    change: PropTypes.func,
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
        orgs: [
          { value: CREATE_NEW_ORG_VALUE },
          ...orgs.map(org => ({ value: org.name })),
        ],
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
                      name={`orgs[${index}].org.name`}
                      component={Selection}
                      dataOptions={this.state.orgs}
                      formatter={(props) => {
                        const { option, searchTerm } = props;
                        if (option.value !== CREATE_NEW_ORG_VALUE) {
                          return <OptionSegment {...props}>{option.value}</OptionSegment>;
                        }
                        if (searchTerm) {
                          return <FormattedMessage id="ui-agreements.organizations.createNewOrg" values={{ name: searchTerm }} />;
                        }

                        return null;
                      }}
                      onChange={(e, value) => {
                        if (value === CREATE_NEW_ORG_VALUE) {
                          e.preventDefault();

                          this.setState(prevState => ({
                            orgs: [
                              ...prevState.orgs,
                              { value: prevState.searchString },
                            ]
                          }));

                          // The call to `change()` needs to occur after the above `setState` call has been resolved.
                          setTimeout(() => this.props.change(`orgs[${index}].org.name`, this.state.searchString), 1000);
                        }
                      }}
                      onFilter={(searchString, orgs) => {
                        this.setState({ searchString });
                        return orgs.filter(org => {
                          if (searchString && org.value === CREATE_NEW_ORG_VALUE) return true;

                          return org.value.toLowerCase().includes(searchString.toLowerCase());
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
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default AgreementFormOrganizations;
