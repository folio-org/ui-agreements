import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';
import { Accordion, AccordionSet, FilterAccordionHeader, RadioButton } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import { getFilterConfig } from '../utilities';

const propTypes = {
  activeFilters: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired,

  filterHandlers: PropTypes.shape({
    clear: PropTypes.func.isRequired,
    clearGroup: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    state: PropTypes.func.isRequired,
  }).isRequired,
};

const GokbFilters = ({ activeFilters = {}, filterHandlers }) => {
  const config = useMemo(() => getFilterConfig(), []);
  const { filterNames, filterOptions, filterTypes, initialFilterState } = config;

  const [filterState, setFilterState] = useState(initialFilterState);

  useEffect(() => {
    const newState = {};
    filterNames.forEach((filter) => {
      const values = filterOptions[filter];
      if (!isEqual(values, filterState[filter])) {
        newState[filter] = values;
      }
    });

    if (Object.keys(newState).length) {
      setFilterState((prevState) => ({ ...prevState, ...newState }));
    }
  }, [filterOptions, filterNames, filterState]);

  const accordionDefaultProps = (name, groupFilters) => ({
    displayClearButton: groupFilters.length > 0,
    header: FilterAccordionHeader,
    id: `gokb-${name}-filter-accordion`,
    label: <FormattedMessage id={`ui-agreements.gokb.filters.${name}`} />,
    onClearFilter: () => {
      filterHandlers.clearGroup(name);
    },
    separator: false,
  });

  const renderRadioButtonFilter = (name, prps) => {
    const groupFilters = activeFilters[name] || [];
    const selectedValue = groupFilters[0] || ''; // Radio selects only one, but stored as array
    const options = filterState[name] || [];
    return (
      <Accordion
        {...accordionDefaultProps(name, groupFilters)}
        {...prps}
      >
        {options.map(opt => (
          <RadioButton
            key={`${name}-${opt.value}`}
            checked={selectedValue === opt.value}
            label={opt.label}
            name={name}
            onChange={(e) => {
              filterHandlers.state({
                ...activeFilters,
                [name]: [e.target.value],
              });
            }}
            value={opt.value}
          />
        ))}
      </Accordion>
    );
  };

  const renderCheckboxFilter = (name, prps) => {
    const groupFilters = activeFilters[name] || [];
    return (
      <Accordion
        {...accordionDefaultProps(name, groupFilters)}
        {...prps}
      >
        <CheckboxFilter
          dataOptions={filterState[name] || []}
          name={name}
          onChange={(group) => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values,
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {filterNames.map(name => {
        const type = filterTypes[name];
        return (
          <div key={name}>
            {type === 'singleSelect' && renderRadioButtonFilter(name)}
            {type === 'multiSelect' && renderCheckboxFilter(name)}
          </div>
        );
      })}
    </AccordionSet>
  );
};

GokbFilters.propTypes = propTypes;

export default GokbFilters;
