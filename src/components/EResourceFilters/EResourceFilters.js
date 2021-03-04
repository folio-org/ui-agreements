import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';

const propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
};

const FILTERS = [
  'publicationType',
  'type',
  'source',
  'tags'
];

export default function EResourceFilters({ activeFilters, data, filterHandlers }) {
  const intl = useIntl();
  console.log("activeFilters: %o", activeFilters);

  const [filterState, setFilterState] = useState({
    publicationType: [],
    type: [],
    class: [],
    tags: []
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

  const renderIsPackageFilter = () => {
    const groupFilters = activeFilters.class || [];
    console.log("groupFilters: %o", groupFilters)

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-is-package"
        label={<FormattedMessage id="ui-agreements.eresources.isPackage" />}
        onClearFilter={() => { filterHandlers.clearGroup('class'); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={[
            { value: 'package', label: <FormattedMessage id="ui-agreements.yes" /> },
            { value: 'nopackage', label: <FormattedMessage id="ui-agreements.no" /> },
          ]}
          name="class"
          onChange={group => {
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

  const renderCheckboxFilter = (name, prps) => {
    const groupFilters = activeFilters[name] || [];
    console.log("groupFilters in renderCheckboxFilter: %o", groupFilters)

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

  return (
    <AccordionSet>
      {renderCheckboxFilter('type')}
      {renderCheckboxFilter('publicationType')}
      {renderIsPackageFilter()}
      {renderRemoteKbFilter()}
      {renderTagsFilter()}
    </AccordionSet>
  );
}

EResourceFilters.propTypes = propTypes;
EResourceFilters.defaultProps = {
  activeFilters: {}
};


// export default class EResourceFilters extends React.Component {
//   static propTypes = {
//     activeFilters: PropTypes.object,
//     data: PropTypes.object.isRequired,
//     filterHandlers: PropTypes.object,
//   };
//
//   static defaultProps = {
//     activeFilters: {
//       class: [],
//       publicationType: [],
//       type: [],
//     }
//   };
//
//   state = {
//     publicationType: [],
//     type: [],
//   }
//
//   static getDerivedStateFromProps(props, state) {
//     const newState = {};
//
//     FILTERS.forEach(filter => {
//       const values = props.data[`${filter}Values`] || [];
//       if (values.length !== state[filter].length) {
//         newState[filter] = values.map(({ label }) => ({ label, value: label }));
//       }
//     });
//
//     if (Object.keys(newState).length) return newState;
//
//     return null;
//   }
//
//   renderIsPackageFilter = () => {
//     const { activeFilters } = this.props;
//     const groupFilters = activeFilters.class || [];
//
//     return (
//       <Accordion
//         displayClearButton={groupFilters.length > 0}
//         header={FilterAccordionHeader}
//         id="filter-accordion-is-package"
//         label={<FormattedMessage id="ui-agreements.eresources.isPackage" />}
//         onClearFilter={() => { this.props.filterHandlers.clearGroup('class'); }}
//         separator={false}
//       >
//         <CheckboxFilter
//           dataOptions={[
//             { value: 'package', label: <FormattedMessage id="ui-agreements.yes" /> },
//             { value: 'nopackage', label: <FormattedMessage id="ui-agreements.no" /> },
//           ]}
//           name="class"
//           onChange={group => {
//             this.props.filterHandlers.state({
//               ...activeFilters,
//               [group.name]: group.values
//             });
//           }}
//           selectedValues={groupFilters}
//         />
//       </Accordion>
//     );
//   }
//
//   renderCheckboxFilter = (name, props) => {
//     const { activeFilters } = this.props;
//     const groupFilters = activeFilters[name] || [];
//
//     return (
//       <Accordion
//         displayClearButton={groupFilters.length > 0}
//         header={FilterAccordionHeader}
//         id={`filter-accordion-${name}`}
//         label={<FormattedMessage id={`ui-agreements.eresources.${name}`} />}
//         onClearFilter={() => { this.props.filterHandlers.clearGroup(name); }}
//         separator={false}
//         {...props}
//       >
//         <CheckboxFilter
//           dataOptions={this.state[name]}
//           name={name}
//           onChange={group => {
//             this.props.filterHandlers.state({
//               ...activeFilters,
//               [group.name]: group.values
//             });
//           }}
//           selectedValues={groupFilters}
//         />
//       </Accordion>
//     );
//   }
//
//   renderRemoteKbFilter = () => {
//     const remoteKbValues = this.props.data.sourceValues;
//     const dataOptions = remoteKbValues.map(remoteKb => ({
//       label: remoteKb.name,
//       value: remoteKb.id,
//     }));
//
//     const { activeFilters } = this.props;
//     const remoteKbFilters = activeFilters.remoteKb || [];
//
//     return (
//       <Accordion
//         displayClearButton={remoteKbFilters.length > 0}
//         header={FilterAccordionHeader}
//         id="filter-accordion-remoteKb"
//         label={<FormattedMessage id="ui-agreements.eresources.sourceKb" />}
//         onClearFilter={() => { this.props.filterHandlers.clearGroup('remoteKb'); }}
//         separator={false}
//       >
//         <Selection
//           dataOptions={dataOptions}
//           id="remoteKb-filter"
//           onChange={value => this.props.filterHandlers.state({ ...activeFilters, remoteKb: [value] })}
//           value={remoteKbFilters[0] || ''}
//         />
//       </Accordion>
//     );
//   }
//
//   renderTagsFilter = () => {
//     const dataOptions = this.props.data.tagsValues.map(({ label }) => ({ value: label, label }));
//     const { activeFilters } = this.props;
//     const tagFilters = activeFilters.tags || [];
//
//     return (
//       <Accordion
//         closedByDefault
//         displayClearButton={tagFilters.length > 0}
//         header={FilterAccordionHeader}
//         id="filter-accordion-tags"
//         label={<FormattedMessage id="ui-agreements.agreements.tags" />}
//         onClearFilter={() => { this.props.filterHandlers.clearGroup('tags'); }}
//         separator={false}
//       >
//         <MultiSelectionFilter
//           dataOptions={dataOptions}
//           id="tags-filter"
//           name="tags"
//           onChange={e => this.props.filterHandlers.state({ ...activeFilters, tags: e.values })}
//           selectedValues={tagFilters}
//         />
//       </Accordion>
//     );
//   }
//
//   render() {
//     return (
//       <AccordionSet>
//         {this.renderCheckboxFilter('type')}
//         {this.renderCheckboxFilter('publicationType')}
//         {this.renderIsPackageFilter()}
//         {this.renderRemoteKbFilter()}
//         {this.renderTagsFilter()}
//       </AccordionSet>
//     );
//   }
// }
