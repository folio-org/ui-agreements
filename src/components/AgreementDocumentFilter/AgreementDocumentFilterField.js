import PropTypes from 'prop-types';
import { Button, Row, Col, Label } from '@folio/stripes/components';
import { useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';
import AgreementDocumentFilterRule from './AgreementDocumentFilterRule';

const AgreementDocumentFilterField = ({ index, name }) => {
  const {
    mutators: { push },
  } = useForm();
  const { values } = useFormState();

  return (
    <>
      <Row>
        <Col xs={2} />
        <Col xs={3}>
          <Label id="rule-column-header-attribute" required>
            <FormattedMessage id="ui-agreements.documentFilter.attribute" />
          </Label>
        </Col>
        <Col xs={3}>
          <Label id="rule-column-header-comparator" required>
            <FormattedMessage id="ui-agreements.comparator" />
          </Label>
        </Col>
        <Col xs={3}>
          <Label id="rule-column-header-value" required>
            <FormattedMessage id="ui-agreements.value" />
          </Label>
        </Col>
        <Col xs={1} />
      </Row>

      <FieldArray name={`${name}.rules`}>
        {({ fields: ruleFields }) => ruleFields.map((ruleFieldName, ruleFieldIndex) => (
          <AgreementDocumentFilterRule
            key={ruleFieldName}
            ariaLabelledby={`selected-document-item-name-${index}`}
            index={ruleFieldIndex}
            name={ruleFieldName}
            onDelete={() => ruleFields.remove(ruleFieldIndex)}
            value={values.filters[index]?.rules[ruleFieldIndex]}
          />
        ))
        }
      </FieldArray>
      <Button
        data-test-add-rule-btn
        onClick={() => push(`${name}.rules`)}
      >
        <FormattedMessage id="ui-agreements.documentFilter.addRule" />
      </Button>
    </>
  );
};

AgreementDocumentFilterField.propTypes = {
  index: PropTypes.string,
  name: PropTypes.string,
};

export default AgreementDocumentFilterField;
