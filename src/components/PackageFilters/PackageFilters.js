import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader } from '@folio/stripes/components';
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
  'source',
  'status',
  'tags'
];

const PackageFilters = ({ activeFilters = {}, data, filterHandlers }) => {
  const [filterState, setFilterState] = useState({
    availability: [],
    contentType: [],
    scope: [],
    source: [],
    status: [],
    tags: [],
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
    const fieldName = name;
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

  const renderSourceFilter = () => {
    const dataOptions = (filterState.source || []).map(source => ({
      label: source,
      value: source
    }));
    const sourceFilters = activeFilters.source || [];

    return (
      <Accordion
        displayClearButton={sourceFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-source"
        label={<FormattedMessage id="ui-agreements.eresources.sourceKb" />}
        onClearFilter={() => { filterHandlers.clearGroup('source'); }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={dataOptions || []}
          id="source-filter"
          name="source"
          onChange={e => filterHandlers.state({ ...activeFilters, source: e.values })}
          selectedValues={sourceFilters}
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

  const renderAvailabilityFilter = () => {
    const availabilityFilters = activeFilters.availability || [];

    return (
      <Accordion
        displayClearButton={availabilityFilters.length > 0}
        header={FilterAccordionHeader}
        id="clickable-availability-filter"
        label={<FormattedMessage id="ui-agreements.eresources.availability" />}
        onClearFilter={() => { filterHandlers.clearGroup('availability'); }}
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
      {renderSourceFilter()}
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('scope')}
      {renderAvailabilityFilter()}
      {renderCheckboxFilter('contentType')}
      {renderTagsFilter()}
    </AccordionSet>
  );
};

PackageFilters.propTypes = propTypes;

export default PackageFilters;
