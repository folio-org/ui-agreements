import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Headline, Selection } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';

const propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
};

const FILTERS = [
  'availability',
  'contentType',
  'scope',
  'status',
  'publicationType',
  'type',
  'tags'
];

export default function EResourceFilters({ activeFilters, data, filterHandlers }) {
  const [filterState, setFilterState] = useState({
    availability: [],
    contentType: [],
    publicationType: [],
    scope: [],
    status: [],
    type: [],
    tags: [],
    isPackage: [
      { value: 'package', label: <FormattedMessage id="ui-agreements.yes" /> },
      { value: 'nopackage', label: <FormattedMessage id="ui-agreements.no" /> },
    ]
  });

  useEffect(() => {
    const newState = {};
    FILTERS.forEach(filter => {
      const values = data[`${filter}Values`];
      if (values.length !== filterState[filter]?.length) {
        newState[filter] = values;
      }
    });

    if ((data?.tagsValues?.length ?? 0) !== filterState.tags?.length) {
      newState.tags = data.tagsValues.map(({ label }) => ({ value: label, label }));
    }

    if (Object.keys(newState).length) {
      setFilterState(prevState => ({ ...prevState, ...newState }));
    }
  }, [data, filterState]);

  const renderCheckboxFilter = (name, prps) => {
    const fieldName = (name === 'isPackage') ? 'class' : name;
    const groupFilters = activeFilters[fieldName] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-agreements.eresources.${name}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(fieldName); }}
        separator={false}
        {...prps}
      >
        <CheckboxFilter
          dataOptions={filterState[name] || []}
          name={fieldName}
          onChange={(group) => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderRemoteKbFilter = () => {
    const remoteKbValues = data.sourceValues;
    const dataOptions = remoteKbValues.map(remoteKb => ({
      label: remoteKb.name,
      value: remoteKb.id,
    }));

    const remoteKbFilters = activeFilters.remoteKb || [];

    return (
      <Accordion
        displayClearButton={remoteKbFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-remoteKb"
        label={<FormattedMessage id="ui-agreements.eresources.sourceKb" />}
        onClearFilter={() => { filterHandlers.clearGroup('remoteKb'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="remoteKb-filter"
          onChange={value => filterHandlers.state({ ...activeFilters, remoteKb: [value] })}
          value={remoteKbFilters[0] || ''}
        />
      </Accordion>
    );
  };

  const renderTagsFilter = () => {
    const tagFilters = activeFilters.tags || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={tagFilters.length > 0}
        header={FilterAccordionHeader}
        id="clickable-tags-filter"
        label={<FormattedMessage id="ui-agreements.agreements.tags" />}
        onClearFilter={() => { filterHandlers.clearGroup('tags'); }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={filterState.tags || []}
          id="tags-filter"
          name="tags"
          onChange={e => filterHandlers.state({ ...activeFilters, tags: e.values })}
          selectedValues={tagFilters}
        />
      </Accordion>
    );
  };

  console.log(filterState.availability);
  const renderAvailabilityFilter = () => {
    const availabilityFilters = activeFilters.availability || [];

    return (
      <Accordion
        displayClearButton={availabilityFilters.length > 0}
        header={FilterAccordionHeader}
        id="clickable-availability-filter"
        label={<FormattedMessage id="ui-agreements.eresources.availability" />}
        onClearFilter={() => { filterHandlers.clearGroup('availablity'); }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={filterState.availability || []}
          id="availability-filter"
          name="availability"
          onChange={e => filterHandlers.state({ ...activeFilters, availability: e.values })}
          selectedValues={availabilityFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderTagsFilter()}
      {renderCheckboxFilter('isPackage')}
      <hr />
      <Headline
        faded
        margin="none"
        size="large"
      >
        <FormattedMessage id="ui-agreements.eresources.filters.titleFilters" />
      </Headline>
      {renderCheckboxFilter('type')}
      {renderCheckboxFilter('publicationType')}
      <hr />
      <Headline
        faded
        margin="none"
        size="large"
      >
        <FormattedMessage id="ui-agreements.eresources.filters.packageFilters" />
      </Headline>
      {renderRemoteKbFilter()}
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('scope')}
      {renderAvailabilityFilter()}
      {renderCheckboxFilter('contentType')}
    </AccordionSet>
  );
}

EResourceFilters.propTypes = propTypes;
EResourceFilters.defaultProps = {
  activeFilters: {}
};
