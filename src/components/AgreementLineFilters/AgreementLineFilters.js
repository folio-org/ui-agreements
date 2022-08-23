import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSet, FilterAccordionHeader, Layout, Spinner } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import { DateFilter, useAgreement } from '@folio/stripes-erm-components';

import AgreementFilterButton from '../AgreementFilterButton';
import POLineField from '../POLinesFieldArray/POLineField';

const propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
  name: PropTypes.string,
  value: PropTypes.string
};

const AgreementLineFilters = ({
  activeFilters = {},
  data,
  filterHandlers
}) => {
  const [filterState, setFilterState] = useState({
    agreementLineType: [],
    tags: []
  });

  const [agreementFilterName, setAgreementFilterName] = useState();
  const agreementId = activeFilters?.agreement?.[0];

  const { isAgreementLoading } = useAgreement({
    agreementId,
    afterQueryCall: (res) => {
      setAgreementFilterName(res.name);
    },
    queryOptions: { enabled: !!agreementId && !agreementFilterName }
  });

  useEffect(() => {
    const newState = {};
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

  const renderPOLines = (poLines, props) => {
    const groupFilters = activeFilters[poLines] || [];

    let disabled = false;
    if (poLines) {
      disabled = true;
    }

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${poLines}`}
        label={<FormattedMessage id={`ui-agreements.agreementLines.POLines ${poLines}`} />}
        name={poLines}
        onClearFilter={() => { filterHandlers.clearGroup(poLines); }}
        separator={false}
        {...props}
      >
        {/* <POLineField
          disabled={disabled}
          onPOLineSelected={(poline) => {
            filterHandlers.state({ ...activeFilters, [poLines]: [poline.id] });
          }}
          orderLine={poLines}
        /> */}
      </Accordion>
    );
  };

  const renderAgreementFilter = (name, props) => {
    const groupFilters = activeFilters[name] || [];

    const displayAgreementName = () => {
      if (isAgreementLoading) {
        return <Spinner />;
      }

      if (agreementFilterName) {
        return (
          <Layout className="padding-bottom-gutter">
            {agreementFilterName}
          </Layout>
        );
      }

      return null;
    };

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id="ui-agreements.agreement" />}
        name={name}
        onClearFilter={() => {
          filterHandlers.clearGroup(name);
          setAgreementFilterName();
        }}
        separator={false}
        {...props}
      >
        {displayAgreementName()}
        <AgreementFilterButton
          disabled={!!agreementFilterName || isAgreementLoading}
          name={name}
          onAgreementSelected={(agreement) => {
            filterHandlers.state({ ...activeFilters, [name]: [agreement.id] });
            setAgreementFilterName(agreement.name);
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
      {renderAgreementFilter('agreement')}
      {/*renderCheckboxFilter('agreementLineType')*/}
      {renderActiveFromDate()}
      {renderActiveToDate()}
      {/*renderPOLines()*/}
      {renderTagsFilter()}
    </AccordionSet>
  );
}

AgreementLineFilters.propTypes = propTypes;

export default AgreementLineFilters;
