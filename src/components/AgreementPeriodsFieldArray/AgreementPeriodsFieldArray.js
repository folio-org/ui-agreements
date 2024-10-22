import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Headline,
} from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';
import AgreementPeriodField from './AgreementPeriodField';

const AgreementPeriodsFieldArray = ({
  fields: { name },
}) => {
  const { items, onAddField, onDeleteField } = useKiwtFieldArray(name);

  const renderPeriods = () => {
    return items.map((period, index) => (
      <EditCard
        key={index}
        data-test-cc-number={index}
        data-testid={`agreementPeriodsFieldArray[${index}]`}
        deleteButtonTooltipText={<FormattedMessage id="ui-agreements.agreementPeriods.removePeriod" values={{ periodNum: index + 1 }} />}
        header={<FormattedMessage id="ui-agreements.agreementPeriods.periodTitle" values={{ number: index + 1 }} />}
        onDelete={index !== 0 ? () => onDeleteField(index, period) : undefined}
      >
        <Field
          component={AgreementPeriodField}
          index={index}
          name={`${name}[${index}]`}
        />
      </EditCard>
    ));
  };

  return (
    <div>
      <Headline margin="x-small" size="large" tag="h3">
        <FormattedMessage id="ui-agreements.agreementPeriods" />
      </Headline>
      <div
        data-testid="agreementPeriodsFieldArray"
        id="agreement-form-periods"
      >
        {renderPeriods()}
      </div>
      {/* Initial startDate is '', but all subsequent should be undefined to ensure we can grab focus */}
      <Button id="add-period-button" onClick={() => onAddField()}>
        <FormattedMessage id="ui-agreements.agreementPeriods.addPeriod" />
      </Button>
    </div>
  );
};

AgreementPeriodsFieldArray.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default AgreementPeriodsFieldArray;
