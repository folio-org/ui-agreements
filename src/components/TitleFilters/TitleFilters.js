import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Headline } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';

const propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
};

const FILTERS = [
  'publicationType',
  'type',
  'tags'
];

export default function TitleFilters({ activeFilters, data, filterHandlers }) {
  const [filterState, setFilterState] = useState({
    publicationType: [],
    type: [],
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
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-agreements.eresources.${name}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(name); }}
        separator={false}
        {...prps}
      >
        <CheckboxFilter
          dataOptions={filterState[name] || []}
          name={name}
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

  return (
    <AccordionSet>
      {renderTagsFilter()}
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
    </AccordionSet>
  );
}

TitleFilters.propTypes = propTypes;
TitleFilters.defaultProps = {
  activeFilters: {}
};
