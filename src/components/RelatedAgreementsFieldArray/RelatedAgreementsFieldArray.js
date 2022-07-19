import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Layout, MessageBanner, Select, TextArea } from '@folio/stripes/components';
import {
  EditCard,
  requiredValidator,
  withKiwtFieldArray
} from '@folio/stripes-erm-components';

import RelatedAgreementField from './RelatedAgreementField';
import { agreementRelationshipTypes } from '../../constants';

const RelatedAgreementsFieldArray = ({
  currentAgreementId,
  currentAgreementName,
  items,
  name,
  onAddField,
  onDeleteField,
  onUpdateField,
}) => {
  const relationshipTypes = [{ label: '', value: '' }];

  agreementRelationshipTypes.forEach(type => {
    relationshipTypes.push(type.outward);
    // we should only add the inward relation to the select list
    // if outward and inward relation label is not the same
    if (type.outward.label !== type.inward.label) {
      relationshipTypes.push(type.inward);
    }
  });

  const handleAgreementSelected = (index, agreement) => {
    onUpdateField(index, { agreement });
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
    return items.map((relatedAgreement, index) => (
      <EditCard
        key={index}
        data-testid={`relatedAgreementsFieldArray[${index}]`}
        deleteBtnProps={{
          'id': `ra-delete-${index}`,
          'data-test-delete-field-button': true
        }}
        deleteButtonTooltipText={<FormattedMessage id="ui-agreements.relatedAgreements.remove" values={{ index: index + 1 }} />}
        header={<FormattedMessage id="ui-agreements.relatedAgreements.relatedAgreementIndex" values={{ index: index + 1 }} />}
        id={`edit-ra-card-${index}`}
        onDelete={() => onDeleteField(index, relatedAgreement)}
      >
        <Field
          agreement={relatedAgreement.agreement}
          component={RelatedAgreementField}
          id={`ra-agreement-${index}`}
          index={index}
          name={`${name}[${index}].agreement`}
          onAgreementSelected={selectedAgreement => handleAgreementSelected(index, selectedAgreement)}
          parentAgreementId={currentAgreementId}
          parentAgreementName={currentAgreementName}
          validate={requiredValidator}
        />
        <Field
          component={Select}
          dataOptions={relationshipTypes}
          disabled={!get(relatedAgreement, 'agreement.id')}
          id={`ra-type-${index}`}
          label={<FormattedMessage id="ui-agreements.relatedAgreements.relationshipToThisAgreement" />}
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
    ));
  };
  return (
    <div data-test-ra-fa>
      <div>
        {items.length ? renderRelatedAgreements(items) : renderEmpty()}
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
  items: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  onAddField: PropTypes.func.isRequired,
  onDeleteField: PropTypes.func.isRequired,
  onUpdateField: PropTypes.func.isRequired,
};

export default withKiwtFieldArray(RelatedAgreementsFieldArray);
