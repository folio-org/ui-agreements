import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSet, FilterAccordionHeader, Layout } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { DateFilter } from '@folio/stripes-erm-components';

import AgreementFilterButton from '../AgreementFilterButton';
// import POLineField from '../POLinesFieldArray/POLineField';


const propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
  name: PropTypes.string,
  value: PropTypes.string
};

const FILTERS = [
  'agreement',
  'agreementLineType',
  'activeFrom',
  'activeTo',
  'purchaseOrderLine',
  'tags'
];

export default function AgreementLineFilters({ activeFilters, data, filterHandlers }) {
  const [filterState, setFilterState] = useState({
    agreement: [],
    agreementLineType: [],
    activeFrom: [],
    activeTo: [],
    purchaseOrderLine: [],
    tags: []
  });

  useEffect(() => {
    const newState = {};
    FILTERS.forEach(filter => {
      const values = data[`${filter}Values`];
      if (!isEqual(values, filterState[filter])) {
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
        label={<FormattedMessage id={`ui-agreements.agreementLines.${name}`} />}
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

  // const renderPOLines = (orderLine) => {
  //   let disabled = false;
  //   if (orderLine) {
  //     disabled = true;
  //   }
  //   const poLineFilters = activeFilters.polines || [];
  //   return (
  //     <Accordion
  //       closedByDefault
  //       displayClearButton={poLineFilters.length > 0}
  //       header={FilterAccordionHeader}
  //       label={<FormattedMessage id="ui-agreements.agreementLines.POLines" />}
  //       onClearFilter={() => {
  //         filterHandlers.state({
  //           ...activeFilters,
  //           polines: [],
  //         });
  //       }}
  //       separator={false}
  //     >
  //       <POLineField
  //         disabled={disabled}
  //         onPolineSelected={(poline) => {
  //           filterHandlers.state({ ...activeFilters, [orderLine]: [poline.id] });
  //         }}
  //         orderLine={orderLine}
  //       />
  //     </Accordion>
  //   );
  // };

  const renderAgreement = (name, props) => {
    const groupFilters = activeFilters[name] || [];

    let disabled = false;
    if (name) {
      disabled = true;
    }

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-agreements.agreement${name}`} />}
        name={name}
        onClearFilter={() => { filterHandlers.clearGroup(name); }}
        separator={false}
        {...props}
      >
        {(name) ?
          <Layout className="padding-bottom-gutter">
            {[`${name}Value`]}
          </Layout> : null
        }
        <AgreementFilterButton
          disabled={disabled}
          name={name}
          onAgreementSelected={(agreement) => {
            filterHandlers.state({ ...activeFilters, [name]: [agreement.id] });
          }}
        />
      </Accordion>
    );
  };

  const renderActiveFromDate = () => {
    return <DateFilter
      activeFilters={activeFilters}
      filterHandlers={filterHandlers}
      hideNoDateSetCheckbox
      name="activeFrom"
    />;
  };

  const renderActiveToDate = () => {
    return <DateFilter
      activeFilters={activeFilters}
      filterHandlers={filterHandlers}
      hideNoDateSetCheckbox
      name="activeTo"
    />;
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
      {renderAgreement('')}
      {renderCheckboxFilter('agreementLineType')}
      {renderActiveFromDate()}
      {renderActiveToDate()}
      {/* {renderPOLines()} */}
      {renderTagsFilter()}
    </AccordionSet>
  );
}

AgreementLineFilters.propTypes = propTypes;
AgreementLineFilters.defaultProps = {
  activeFilters: {}
};
