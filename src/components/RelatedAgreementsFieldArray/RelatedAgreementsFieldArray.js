import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Layout, Select, TextArea } from '@folio/stripes/components';
import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import RelatedAgreementField from './RelatedAgreementField';
import { validators } from '../utilities';
import { agreementRelationshipTypes } from '../../constants';

class RelatedAgreementsFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onMarkForDeletion: PropTypes.func.isRequired,
    onReplaceField: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.relationshipTypes = [{ label: '', value: '' }];

    agreementRelationshipTypes.forEach(type => {
      this.relationshipTypes.push(type.outward);
      this.relationshipTypes.push(type.inward);
    });
  }

  handleAgreementSelected = (index, agreement) => {
    this.props.onReplaceField(index, { agreement });
  }

  handleAgreementUnselected = (index, relatedAgreement) => {
    /* handleAgreementUnselected should mark the Agreement to be deleted once we update the form.
    onMarkForDeletion does that job. It pushes the {id: id, _delete: true) into the fields array
    and on update would actually delete the field. onReplaceField takes care
    of replacing the Related Agreement UI with the default Add Agreement UI */
    this.props.onMarkForDeletion(relatedAgreement, ['type']);
    this.props.onReplaceField(index, {});
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter" data-test-ra-empty-message>
      <FormattedMessage id="ui-agreements.relatedAgreements.agreementHasNone" />
    </Layout>
  );

  renderRelatedAgreements = (items) => {
    return items.map((relatedAgreement, index) => (
      <EditCard
        deleteBtnProps={{
          'id': `ra-delete-${index}`,
          'data-test-delete-field-button': true
        }}
        header={<FormattedMessage id="ui-agreements.relatedAgreements.relatedAgreementIndex" values={{ index: index + 1 }} />}
        id={`edit-ra-card-${index}`}
        key={index}
        onDelete={() => this.props.onDeleteField(index, relatedAgreement, ['type'])}
      >
        <Field
          component={RelatedAgreementField}
          id={`ra-agreement-${index}`}
          index={index}
          name={`${this.props.name}[${index}].agreement`}
          onAgreementSelected={selectedAgreement => this.handleAgreementSelected(index, selectedAgreement)}
          onAgreementUnselected={() => this.handleAgreementUnselected(index, relatedAgreement)}
          agreement={relatedAgreement.agreement}
          validate={validators.required}
        />
        <Field
          component={Select}
          dataOptions={this.relationshipTypes}
          id={`ra-type-${index}`}
          label={<FormattedMessage id="ui-agreements.relatedAgreements.relationshipToThisAgreement" />}
          name={`${this.props.name}[${index}].type`}
          required
          validate={validators.required}
        />
        <Field
          component={TextArea}
          id={`ra-note-${index}`}
          label={<FormattedMessage id="ui-agreements.note" />}
          name={`${this.props.name}[${index}].note`}
        />
      </EditCard>
    ));
  }

  render() {
    const { items, onAddField } = this.props;
    return (
      <div data-test-ra-fa>
        <div>
          {items.length ? this.renderRelatedAgreements(items) : this.renderEmpty()}
        </div>
        <Button
          data-test-ra-fa-add-button
          onClick={() => onAddField()}
          id="add-ra-btn"
        >
          <FormattedMessage id="ui-agreements.relatedAgreements.addRelatedAgreement" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(RelatedAgreementsFieldArray);
