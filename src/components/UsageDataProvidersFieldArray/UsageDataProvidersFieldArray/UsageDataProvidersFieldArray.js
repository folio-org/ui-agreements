import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Layout, TextArea } from '@folio/stripes/components';
import { EditCard, requiredValidator } from '@folio/stripes-erm-components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import UsageDataProviderField from '../UsageDataProviderField/UsageDataProviderField';

const UsageDataProvidersFieldArray = ({
  fields: { name }
}) => {
  const { items, onAddField, onDeleteField, onUpdateField } = useKiwtFieldArray(name);
  const [udps, setUdps] = useState({});

  const handleUDPSelected = (index, udp) => {
    onUpdateField(index, { remoteId: udp.id });

    setUdps({
      ...udps,
      [udp.id]: udp,
    });
  };

  const renderEmpty = () => (
    <Layout className="padding-bottom-gutter" data-test-udp-empty-message>
      <FormattedMessage id="ui-agreements.usageData.agreementHasNone" />
    </Layout>
  );

  const renderUDPFields = () => {
    return items.map((udp, index) => (
      <EditCard
        key={index}
        data-testid={`usageDataProvidersFieldArray[${index}]`}
        deleteBtnProps={{
          'id': `udp-delete-${index}`,
          'data-test-delete-field-button': true
        }}
        deleteButtonTooltipText={<FormattedMessage id="ui-agreements.usageData.removeUsageDataProvider" values={{ index: index + 1 }} />}
        header={<FormattedMessage id="ui-agreements.usageData.usageDataProviderIndex" values={{ index: index + 1 }} />}
        id={`edit-udp-card-${index}`}
        onDelete={() => onDeleteField(index, udp)}
      >
        <Field
          component={UsageDataProviderField}
          id={`udp-remoteId-${index}`}
          index={index}
          name={`${name}[${index}].remoteId`}
          onUDPSelected={selectedUDP => handleUDPSelected(index, selectedUDP)}
          udp={udps[udp.remoteId] || udp.remoteId_object}
          validate={requiredValidator}
        />
        <Field
          component={TextArea}
          id={`udp-note-${index}`}
          label={<FormattedMessage id="ui-agreements.usageData.note" />}
          name={`${name}[${index}].usageDataProviderNote`}
          parse={v => v} // Lets us send an empty string instead of `undefined`
        />
      </EditCard>
    ));
  };

  return (
    <div data-test-udp-fa>
      <div>
        {items.length ? renderUDPFields() : renderEmpty()}
      </div>
      <Button
        data-test-udp-fa-add-button
        id="add-udp-btn"
        onClick={() => onAddField()}
      >
        <FormattedMessage id="ui-agreements.usageData.addUDP" />
      </Button>
    </div>
  );
};

UsageDataProvidersFieldArray.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default UsageDataProvidersFieldArray;
