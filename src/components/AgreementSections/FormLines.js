import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import AgreementLinesFieldArray from './components/AgreementLinesFieldArray';

export default class FormLines extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    data: PropTypes.shape({
      basket: PropTypes.array,
      agreementLines: PropTypes.array,
    }),
  };

  render() {
    const { data, id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-agreements.agreements.agreementLines" />}
        onToggle={onToggle}
        open={open}
      >
        <FieldArray
          component={AgreementLinesFieldArray}
          data={data}
          name="items"
        />
      </Accordion>
    );
  }
}
