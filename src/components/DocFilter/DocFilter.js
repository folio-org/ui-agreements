import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Accordion,
  FilterAccordionHeader,
  Layout,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import {
  deparseKiwtQueryFilters,
  parseKiwtQueryFilters,
} from '@k-int/stripes-kint-components';

import DocFilterForm from '../DocFilterForm';

const DocFilter = ({ activeFilters, atTypeValues = [], filterHandlers }) => {
  const filterType = atTypeValues.length > 0 ? 'documents' : '';
  const [editingFilters, setEditingFilters] = useState(false);
  const openEditModal = () => setEditingFilters(true);
  const closeEditModal = () => setEditingFilters(false);

  // Due to how filters are handled within SearchAndSortQuery the filter string needs to be parsed back into a usual object
  const parseQueryString = (filterArray) => {
    if (filterArray?.length) {
      // Since the filters are grouped, the docuements filterstring will be within the first array element
      const parsedFilters = parseKiwtQueryFilters(filterArray?.[0]);

      const filters = parsedFilters.reduce((acc, curr) => {
        if (typeof curr === 'string') {
          return [...acc];
        }
        return [...acc, { rules: curr.filter((e) => typeof e !== 'string') }];
      }, []);
      return filters;
    }
    return [];
  };

  const parsedFilterData = parseQueryString(activeFilters?.[filterType] || []);

  const handleSubmit = (values) => {
    // In order to convert the form values into the shape for them to be deparsed we do the inverse of the above
    // Adding a || operator between all elements of the filters array and a && operator between all elements of the nested arrays
    // With special logic to ensure that operators are not added infront of the first elements of any arrays, to ensure no grouping errors
    const kiwtQueryShape = values?.filters?.reduce((acc, curr, index) => {
      let newAcc = [...acc];

      if (index !== 0) {
        newAcc = [...newAcc, '||'];
      }

      newAcc = [
        ...newAcc,
        curr.rules.reduce((a, c, i) => {
          return [
            ...a,
            i !== 0 ? '&&' : null, // Don't group on first entry
            c,
          ].filter(Boolean);
        }, []),
      ];

      return newAcc;
    }, []);

    filterHandlers.state({
      ...activeFilters,
      [filterType]: [
        // Currently the deparse function returns a query string containing whitespace which leads to grouping errors
        // This regex removes all whitespace from the querystring
        deparseKiwtQueryFilters(kiwtQueryShape),
      ],
    });
    setEditingFilters(false);
  };

  return (
    <Accordion
      closedByDefault
      displayClearButton={!!parsedFilterData?.length}
      header={FilterAccordionHeader}
      id={`clickable-agreement-${filterType}-filter`}
      label={<FormattedMessage id="ui-agreements.documentFilter" />}
      onClearFilter={() => filterHandlers.state({ ...activeFilters, [filterType]: [] })
      }
      separator={false}
    >
      {!!parsedFilterData?.length && (
        <Layout className="padding-bottom-gutter">
          <FormattedMessage
            id="ui-agreements.documentFilter.filtersApplied"
            values={{ filtersLength: parsedFilterData?.length }}
          />
        </Layout>
      )}
      <DocFilterForm
        atTypeValues={atTypeValues}
        editingFilters={editingFilters}
        filters={parsedFilterData}
        handlers={{
          closeEditModal,
          openEditModal,
        }}
        onSubmit={handleSubmit}
      />
    </Accordion>
  );
};

DocFilter.propTypes = {
  activeFilters: PropTypes.object,
  atTypeValues: PropTypes.arrayOf(PropTypes.object),
  filterHandlers: PropTypes.object,
};

export default DocFilter;
