import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';

export default class AgreementFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    resources: PropTypes.object.isRequired,
  };

  static defaultProps = {
    activeFilters: {
      agreementStatus: [],
    }
  };

  state = {
    agreementStatusOptions: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const agreementStatusOptions = get(props.resources, ['agreementStatus', 'records'], []);
    if (agreementStatusOptions.length !== state.agreementStatusOptions.length) {
      newState.agreementStatusOptions = agreementStatusOptions.map(option => ({
        label: option.label,
        value: option.label,
      }));
    }

    if (Object.keys(newState).length) return newState;

    return null;
  }

  createClearFilterHandler = (name) => () => {
    this.props.onChange({ name, values: [] });
  }

  render() {
    const { activeFilters, onChange } = this.props;

    return (
      <AccordionSet>
        <Accordion
          displayClearButton={activeFilters.agreementStatus.length}
          header={FilterAccordionHeader}
          label={<FormattedMessage id="ui-agreements.agreements.agreementStatus" />}
          onClearFilter={this.createClearFilterHandler('agreementStatus')}
        >
          <CheckboxFilter
            dataOptions={this.state.agreementStatusOptions}
            name="agreementStatus"
            onChange={onChange}
            selectedValues={activeFilters.agreementStatus}
          />
        </Accordion>
      </AccordionSet>
    );
  }
}
