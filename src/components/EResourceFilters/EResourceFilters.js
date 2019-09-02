import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const FILTERS = [
  'type',
  'remoteKb',
];

export default class EResourceFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {}
  };

  state = {
    type: [],
    remoteKb: [],
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

  renderIsPackageFilter = () => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters.class || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-is-package"
        label={<FormattedMessage id="ui-agreements.eresources.isPackage" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('class'); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={[
            { value: 'package', label: <FormattedMessage id="ui-agreements.yes" /> },
            { value: 'nopackage', label: <FormattedMessage id="ui-agreements.no" /> },
          ]}
          name="class"
          onChange={group => {
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

  renderCheckboxFilter = (name, props) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-agreements.eresources.${name}`} />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup(name); }}
        separator={false}
        {...props}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={name}
          onChange={group => {
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

  /* renderOrganizationRoleFilter = () => {
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
  } */

  renderSourceFilter = () => {
    const sourceValues = this.props.data.sourceValues;
    const dataOptions = sourceValues.map(remoteKb => ({
      label: remoteKb.name,
      value: remoteKb.id,
    }));

    const { activeFilters } = this.props;
    const sourceFilters = activeFilters.remoteKb || [];

    return (
      <Accordion
        //  closedByDefault
        displayClearButton={sourceFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-agreements.eresources.source" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('remoteKb'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          //  disabled={sourceFilters.length === 0}
          value={sourceFilters[0] || ''}
          onChange={value => this.props.filterHandlers.state({ ...activeFilters, remoteKb: [value] })}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('type')}
        {this.renderIsPackageFilter()}
        {this.renderSourceFilter()}
      </AccordionSet>
    );
  }
}
