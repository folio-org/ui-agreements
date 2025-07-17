import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';
import { Accordion, AccordionSet, FilterAccordionHeader, RadioButton } from '@folio/stripes/components';

import { getFilters } from '../utilities';

const propTypes = {
  activeFilters: PropTypes.shape({
    type: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  filterHandlers: PropTypes.shape({
    clear: PropTypes.func.isRequired,
    clearGroup: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    state: PropTypes.func.isRequired,
  }).isRequired,
};

const GokbFilters = ({ activeFilters = {}, filterHandlers }) => {
  const { filterNames, filterOptions, initialFilterState } = getFilters();

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
            key={opt.value}
            checked={selectedValue === opt.value}
            label={<FormattedMessage id={`ui-agreements.gokb.filters.${name}.${opt.label}`} />}
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

  return (
    <AccordionSet>
      {filterNames.map(name => renderRadioButtonFilter(name))}
    </AccordionSet>
  );
};

GokbFilters.propTypes = propTypes;

export default GokbFilters;
