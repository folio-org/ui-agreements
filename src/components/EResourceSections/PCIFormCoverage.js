import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  KeyValue
} from '@folio/stripes/components';
import { FieldArray } from 'react-final-form-arrays';
import Embargo from '../Embargo';

import CoverageFieldArray from '../CoverageFieldArray';

export default class PCIFormCoverage extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    open: PropTypes.bool,
    onToggle: PropTypes.func,
    values: PropTypes.object,
  };

  renderCoverageFieldArray = () => {
    const coverageProps = {
      'addButtonId': 'edit-pci-add-coverage-button',
      'addLabelId': 'ui-agreements.pci.addCoverage',
      'deleteButtonTooltipId': 'ui-agreements.pci.removeCoverage',
      'headerId': 'ui-agreements.pci.coverageTitle',
      'id': 'pci-form-coverages',
      'name': 'coverage',
    };

    return (
      <FieldArray
        component={CoverageFieldArray}
        {...coverageProps}
      />
    );
  }

  renderEmbargo = (values) => {
    return values?.embargo ? (
      <KeyValue label={<FormattedMessage id="ui-agreements.embargo" />}>
        <Embargo embargo={values?.embargo} />
      </KeyValue>
    ) : null;
  }

  render() {
    const { id, open, onToggle, values } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.eresources.coverage" />}
        onToggle={onToggle}
        open={open}
      >
        {this.renderEmbargo(values)}
        {this.renderCoverageFieldArray()}
      </Accordion>
    );
  }
}
