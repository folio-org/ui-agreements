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

import AgreementDocumentFilterForm from './AgreementDocumentFilterForm';

const AgreementDocumentFilter = ({ activeFilters, filterHandlers }) => {
  const [editingFilters, setEditingFilters] = useState(false);
  const openEditModal = () => setEditingFilters(true);
  const closeEditModal = () => setEditingFilters(false);

  // Due to how filters are handled within SearchAndSortQuery the filter string needs to be parsed back into a usual object
  const parseQueryString = (filterArray) => {
    if (filterArray) {
      const parsedFilters = parseKiwtQueryFilters(filterArray?.[0]);
      const filters = parsedFilters.reduce((acc, curr) => {
        if (typeof curr === 'string') {
          return [{ rules: acc }];
        }
        return [...acc, { rules: curr.filter((e) => typeof e !== 'string') }];
      }, []);
      return filters;
    }
    return [];
  };

  const parsedFilterData = parseQueryString(activeFilters?.documents || null);

  const handleSubmit = (values) => {
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
      documents: [
        deparseKiwtQueryFilters(kiwtQueryShape).replaceAll(/\s/g, ''),
      ],
    });
    setEditingFilters(false);
  };

  return (
    <Accordion
      displayClearButton={parsedFilterData?.length}
      header={FilterAccordionHeader}
      id="clickable-agreement-document-filter"
      label={<FormattedMessage id="ui-agreements.documentFilter.documents" />}
      onClearFilter={() => filterHandlers.state({ ...activeFilters, documents: [] })
      }
      separator={false}
    >
      {!!parsedFilterData?.length && (
        <Layout className="padding-bottom-gutter">
          <FormattedMessage
            id="ui-agreements.documentFilter.documents"
            values={{ filtersLength: parsedFilterData?.length }}
          />
        </Layout>
      )}
      <AgreementDocumentFilterForm
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

AgreementDocumentFilter.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default AgreementDocumentFilter;
