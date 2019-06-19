import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { OrganizationSelection } from '@folio/stripes-erm-components';

const FILTERS = [
  'agreementStatus',
  'renewalPriority',
  'isPerpetual',
  'tags'
];

export default class AgreementFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {}
  };

  state = {
    agreementStatus: [],
    renewalPriority: [],
    isPerpetual: [],
    tags: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = props.data[`${filter}Values`] || [];
      if (values.length !== state[filter].length) {
        newState[filter] = values.map(({ label }) => ({ label, value: label }));
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderCheckboxFilter = (name, props) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-agreements.agreements.${name}`} />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup(name); }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={name}
          onChange={(group) => {
            this.props.filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  }

  renderOrganizationFilter = () => {
    const { activeFilters } = this.props;
    const orgFilters = activeFilters.orgs || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={orgFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        onClearFilter={() => {
          this.props.filterHandlers.state({
            ...activeFilters,
            role: [],
            orgs: [],
          });
        }}
        separator={false}
      >
        <OrganizationSelection
          input={{
            name: 'agreement-orgs-filter',
            onChange: value => this.props.filterHandlers.state({ ...activeFilters, orgs: [value] }),
            value: orgFilters[0] || '',
          }}
        />
      </Accordion>
    );
  }

  renderOrganizationRoleFilter = () => {
    const roles = this.props.data.orgRoleValues;
    // TODO: TEST USING THE VALUES GENERATED IN GDSFP
    const dataOptions = roles.map(role => ({
      value: role.id,
      label: role.label,
    }));

    const { activeFilters } = this.props;
    const orgFilters = activeFilters.orgs || [];
    const roleFilters = activeFilters.role || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={roleFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-agreements.settings.orgRoles.orgRole" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('role'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          disabled={orgFilters.length === 0}
          value={roleFilters[0] || ''}
          onChange={value => this.props.filterHandlers.state({ ...activeFilters, role: [value] })}
        />
      </Accordion>
    );
  }

  renderTagsFilter = (name, props) => {
    const tags = get(this.props.data, 'tagValues.records', []);
    // TODO: TEST USING THE VALUES GENERATED IN GDSFP
    const dataOptions = tags.map(({ label }) => ({ value: label, label }));
    const activeFilters = this.props.activeFilters.tags || [];

    return (
      <Accordion
        id="clickable-tags-filter"
        displayClearButton={activeFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-agreements.agreements.tags" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('tags'); }}
        separator={false}
        {...props}
      >
        <MultiSelectionFilter
          id="tags-filter"
          dataOptions={dataOptions}
          name="tags"
          onChange={values => this.props.filterHandlers.state({ ...activeFilters, tags: values })}
          selectedValues={activeFilters}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('agreementStatus')}
        {this.renderCheckboxFilter('renewalPriority', { closedByDefault: true })}
        {this.renderCheckboxFilter('isPerpetual', { closedByDefault: true })}
        {this.renderOrganizationFilter()}
        {this.renderOrganizationRoleFilter()}
        {this.renderTagsFilter('Tags', { closedByDefault: true })}
      </AccordionSet>
    );
  }
}
