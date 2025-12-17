import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Layout, MessageBanner, Select, TextArea } from '@folio/stripes/components';
import {
  EditCard,
  requiredValidator
} from '@folio/stripes-erm-components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import RelatedAgreementField from './RelatedAgreementField';
import { agreementRelationshipTypes } from '../../constants';
import { focusByIdWhenReady } from '../utilities';


const RelatedAgreementsFieldArray = ({
  currentAgreementId,
  currentAgreementName,
  fields: { name }
}) => {
  const intl = useIntl();
  const { items, onAddField, onDeleteField, onUpdateField } = useKiwtFieldArray(name);
  const relationshipTypes = [{ label: '', value: '' }];

  agreementRelationshipTypes.forEach(type => {
    relationshipTypes.push({
      label: intl.formatMessage({
        id: `ui-agreements.relationship.outward.${type.type}`,
      }),
      value: type.outward.value,
    });
    // we should only add the inward relation to the select list
    // if outward and inward relation label is not the same
    if (type.outward.label !== type.inward.label) {
      relationshipTypes.push({
        label: intl.formatMessage({
          id: `ui-agreements.relationship.inward.${type.type}`,
        }),
        value: type.inward.value,
      });
    }
  });

  const handleAgreementSelected = (index, agreement, triggerButtonId) => {
    onUpdateField(index, { agreement });
    focusByIdWhenReady(triggerButtonId);
  };

  const renderEmpty = () => (
    <Layout className="padding-bottom-gutter" data-test-ra-empty-message>
      <FormattedMessage id="ui-agreements.relatedAgreements.agreementHasNone" />
    </Layout>
  );

  const renderRelationshipSummary = (relatedAgreement) => {
    const { agreement = {}, type } = relatedAgreement;
    if (!agreement.id || !type) return null;

    const source = agreement.name;
    const relationship = relationshipTypes.find(t => t.value === type).label;
    const target = currentAgreementName;

    const translationKey = `ui-agreements.relatedAgreements.${target ? 'relationshipSummary' : 'relationshipSummaryForNewAgreement'}`;

    return (
      <MessageBanner>
        <FormattedMessage id={translationKey} values={{ source, relationship, target }} />
      </MessageBanner>
    );
  };

  const renderRelatedAgreements = () => {
    return items.map((relatedAgreement, index) => {
      const fieldId = `ra-agreement-${index}`;
      const triggerButtonId = `${fieldId}-find-agreement-btn`;

      return (
        <EditCard
          key={index}
          data-testid={`relatedAgreementsFieldArray[${index}]`}
          deleteBtnProps={{
            id: `ra-delete-${index}`,
            'data-test-delete-field-button': true
          }}
          deleteButtonTooltipText={
            <FormattedMessage
              id="ui-agreements.relatedAgreements.remove"
              values={{ index: index + 1 }}
            />
          }
          header={
            <FormattedMessage
              id="ui-agreements.relatedAgreements.relatedAgreementIndex"
              values={{ index: index + 1 }}
            />
          }
          id={`edit-ra-card-${index}`}
          onDelete={() => onDeleteField(index, relatedAgreement)}
        >
          <Field
            agreement={relatedAgreement.agreement}
            component={RelatedAgreementField}
            id={fieldId}
            index={index}
            name={`${name}[${index}].agreement`}
            onAgreementSelected={selectedAgreement => handleAgreementSelected(index, selectedAgreement, triggerButtonId)
            }
            parentAgreementId={currentAgreementId}
            parentAgreementName={currentAgreementName}
            triggerButtonId={triggerButtonId}
            validate={requiredValidator}
          />

          <Field
            component={Select}
            dataOptions={relationshipTypes}
            disabled={!get(relatedAgreement, 'agreement.id')}
            id={`ra-type-${index}`}
            label={
              <FormattedMessage id="ui-agreements.relatedAgreements.relationshipToThisAgreement" />
            }
            name={`${name}[${index}].type`}
            required
            validate={requiredValidator}
          />

          {renderRelationshipSummary(relatedAgreement)}

          <Field
            component={TextArea}
            id={`ra-note-${index}`}
            label={<FormattedMessage id="ui-agreements.note" />}
            name={`${name}[${index}].note`}
            parse={v => v}
          />
        </EditCard>
      );
    });
  };


  return (
    <div data-test-ra-fa>
      <div>
        {items.length ? renderRelatedAgreements() : renderEmpty()}
      </div>
      <Button
        data-test-ra-fa-add-button
        id="add-ra-btn"
        onClick={() => onAddField()}
      >
        <FormattedMessage id="ui-agreements.relatedAgreements.addRelatedAgreement" />
      </Button>
    </div>
  );
};

RelatedAgreementsFieldArray.propTypes = {
  currentAgreementId: PropTypes.string,
  currentAgreementName: PropTypes.string,
  fields: PropTypes.shape({
    name: PropTypes.string,
  })
};

export default RelatedAgreementsFieldArray;
