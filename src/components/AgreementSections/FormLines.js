import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import AgreementLinesFieldArray from './components/AgreementLinesFieldArray';

export default class FormLines extends React.Component {
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
          basket={data.basket}
          component={AgreementLinesFieldArray}
          data={data}
          name="items"
        />
      </Accordion>
    );
  }
}
