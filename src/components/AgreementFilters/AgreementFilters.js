import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { FormattedMessage, useIntl } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';
import {
  DateFilter,
  DocumentFilter,
  InternalContactSelection,
  OrganizationSelection,
} from '@folio/stripes-erm-components';

import { CustomPropertiesFilter } from '@k-int/stripes-kint-components';

import AgreementContentFilter from '../AgreementContentFilter';
import { CUSTPROP_ENDPOINT } from '../../constants';

const propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
};

const FILTERS = [
  'agreementStatus',
  'reasonForClosure',
  'renewalPriority',
  'isPerpetual',
  'agreementContentType',
];

const AgreementFilters = ({
  activeFilters = {},
  data,
  filterHandlers,
}) => {
  const intl = useIntl();

  const [filterState, setFilterState] = useState({
    agreementStatus: [],
    reasonForClosure: [],
    renewalPriority: [],
    isPerpetual: [],
    agreementContentType: [],
    tags: [],
  });

  const atTypeValues = data.documentAtTypeValues;

  useEffect(() => {
    const newState = {};
    FILTERS.forEach((filter) => {
      const values = data[`${filter}Values`];
      if (!isEqual(values, filterState[filter])) {
        newState[filter] = values;
      }
    });

    if ((data?.tagsValues?.length ?? 0) !== filterState.tags?.length) {
      newState.tags = data.tagsValues.map(({ label }) => ({
        value: label,
        label,
      }));
    }

    if (Object.keys(newState).length) {
      setFilterState((prevState) => ({ ...prevState, ...newState }));
    }
  }, [data, filterState]);

  const renderCheckboxFilter = (name, prps) => {
    const groupFilters = activeFilters[name] || [];
    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-agreements.agreements.${name}`} />}
        onClearFilter={() => {
          filterHandlers.clearGroup(name);
        }}
        separator={false}
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

  const renderMultiSelectFilter = (name, prps) => {
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        // ID differs from the checkbox above just to avoid any clashes
        id={`filter-ms-accordion-${name}`}
        label={<FormattedMessage id={`ui-agreements.agreements.${name}`} />}
        onClearFilter={() => {
          filterHandlers.clearGroup(name);
        }}
        separator={false}
        {...prps}
      >
        <MultiSelectionFilter
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

  const renderOrganizationFilter = () => {
    const orgFilters = activeFilters.orgs || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={orgFilters.length > 0}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        onClearFilter={() => {
          filterHandlers.state({
            ...activeFilters,
            orgs: [],
          });
        }}
        separator={false}
      >
        <OrganizationSelection
          input={{
            name: 'agreement-orgs-filter',
            onChange: (value) => filterHandlers.state({ ...activeFilters, orgs: [value] }),
            value: orgFilters[0] || '',
          }}
        />
      </Accordion>
    );
  };

  const renderOrganizationRoleFilter = () => {
    const roles = data.orgRoleValues;
    const dataOptions = roles.map((role) => ({
      value: role.id,
      label: role.label,
    }));

    const roleFilters = activeFilters.role || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={roleFilters.length > 0}
        header={FilterAccordionHeader}
        label={
          <FormattedMessage id="ui-agreements.settings.orgRoles.orgRole" />
        }
        onClearFilter={() => {
          filterHandlers.clearGroup('role');
        }}
        separator={false}
      >
        <FormattedMessage id="ui-agreements.organizations.selectRole">
          {(placeholder) => (
            <Selection
              dataOptions={dataOptions}
              onChange={(value) => filterHandlers.state({ ...activeFilters, role: [value] })
              }
              placeholder={
                typeof placeholder === 'string' ? placeholder : placeholder[0]
              }
              value={roleFilters[0] || ''}
            />
          )}
        </FormattedMessage>
      </Accordion>
    );
  };

  const renderInternalContactFilter = () => {
    const contactFilters = activeFilters.contacts || [];

    return (
      <IfPermission perm="users.collection.get">
        <Accordion
          closedByDefault
          displayClearButton={contactFilters.length > 0}
          header={FilterAccordionHeader}
          id="internal-contacts-filter"
          label={
            <FormattedMessage id="ui-agreements.agreements.internalContacts" />
          }
          onClearFilter={() => filterHandlers.clearGroup('contacts')}
          separator={false}
        >
          <InternalContactSelection
            id="agreement-internal-contacts-filter"
            input={{
              name: 'agreement-contacts-filter',
              onChange: (value) => filterHandlers.state({ ...activeFilters, contacts: [value] }),
              value: contactFilters[0] || '',
            }}
            path="erm/contacts"
          />
        </Accordion>
      </IfPermission>
    );
  };

  const renderInternalContactRoleFilter = () => {
    const contactRoles = data.contactRoleValues;
    const dataOptions = contactRoles.map((contactRole) => ({
      value: contactRole.id,
      label: contactRole.label,
    }));

    const contactRoleFilters = activeFilters.contactRole || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={contactRoleFilters.length > 0}
        header={FilterAccordionHeader}
        id="internal-contacts-role-filter"
        label={
          <FormattedMessage id="ui-agreements.agreements.internalContactsRole" />
        }
        onClearFilter={() => {
          filterHandlers.clearGroup('contactRole');
        }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="agreement-internal-contacts-role-filter"
          onChange={(value) => filterHandlers.state({ ...activeFilters, contactRole: [value] })
          }
          value={contactRoleFilters[0] || ''}
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
        onClearFilter={() => {
          filterHandlers.clearGroup('tags');
        }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={filterState.tags || []}
          id="tags-filter"
          name="tags"
          onChange={(e) => filterHandlers.state({ ...activeFilters, tags: e.values })
          }
          selectedValues={tagFilters}
        />
      </Accordion>
    );
  };

  const renderCustomPropertyFilters = () => {
    return (
      <CustomPropertiesFilter
        activeFilters={activeFilters}
        customPropertiesEndpoint={CUSTPROP_ENDPOINT}
        filterHandlers={filterHandlers}
      />
    );
  };

  const renderStartDateFilter = () => {
    return (
      <DateFilter
        activeFilters={activeFilters}
        filterHandlers={filterHandlers}
        hideNoDateSetCheckbox
        name="startDate"
      />
    );
  };

  const renderEndDateFilter = () => {
    return (
      <DateFilter
        activeFilters={activeFilters}
        filterHandlers={filterHandlers}
        name="endDate"
        resourceName={intl
          .formatMessage({ id: 'ui-agreements.agreements' })
          .toLowerCase()}
      />
    );
  };

  const renderCancellationDeadlineFilter = () => {
    return (
      <DateFilter
        activeFilters={activeFilters}
        filterHandlers={filterHandlers}
        name="cancellationDeadline"
        resourceName={intl
          .formatMessage({ id: 'ui-agreements.agreements' })
          .toLowerCase()}
      />
    );
  };

  const renderAgreementContentFilter = () => {
    const agreementContentFilters = activeFilters.agreementContent || [];

    return (
      <Accordion
        closedByDefault
        displayClearButton={agreementContentFilters.length > 0}
        header={FilterAccordionHeader}
        id="clickable-agreement-content-filter"
        label={<FormattedMessage id="ui-agreements.agreementContent" />}
        onClearFilter={() => {
          filterHandlers.clearGroup('agreementContent');
        }}
        separator={false}
      >
        <AgreementContentFilter
          activeFilters={activeFilters}
          agreementContentFilters={agreementContentFilters}
          filterHandlers={filterHandlers}
          name="agreementContent"
        />
      </Accordion>
    );
  };

  // for supplementary documents pass the atTypeValues
  const renderSupplementaryDocumentFilter = () => {
    return <DocumentFilter
      activeFilters={activeFilters}
      atTypeValues={atTypeValues}
      filterHandlers={filterHandlers}
    />;
  };

  return (
    <AccordionSet>
      {renderCheckboxFilter('agreementStatus')}
      {renderMultiSelectFilter('reasonForClosure')}
      {renderCheckboxFilter('renewalPriority', { closedByDefault: true })}
      {renderCheckboxFilter('isPerpetual', { closedByDefault: true })}
      {renderStartDateFilter()}
      {renderEndDateFilter()}
      {renderCancellationDeadlineFilter()}
      {renderOrganizationFilter()}
      {renderOrganizationRoleFilter()}
      {renderInternalContactFilter()}
      {renderInternalContactRoleFilter()}
      {renderCheckboxFilter('agreementContentType', { closedByDefault: true })}
      {renderTagsFilter()}
      {renderCustomPropertyFilters()}
      {renderAgreementContentFilter()}
      {renderSupplementaryDocumentFilter()}
    </AccordionSet>
  );
};

AgreementFilters.propTypes = propTypes;

export default AgreementFilters;
