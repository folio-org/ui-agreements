import PropTypes from 'prop-types';
import { Button, Row, Col, Label } from '@folio/stripes/components';
import { useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';
import DocumentFilterRule from '../DocumentFilterRule';

const DocumentFilterField = ({ atTypeValues, index, name }) => {
  const {
    mutators: { push },
  } = useForm();
  const { values } = useFormState();
  const renderRuleComponent = (ruleFields, ruleFieldName, ruleFieldIndex) => {
    return (
      <DocumentFilterRule
        key={ruleFieldName}
        ariaLabelledby={`selected-document-item-name-${index}`}
        atTypeValues={atTypeValues}
        index={ruleFieldIndex}
        name={ruleFieldName}
        onDelete={() => ruleFields.remove(ruleFieldIndex)}
        value={values.filters[index]?.rules[ruleFieldIndex]}
      />
    );
  };

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
            <FormattedMessage id="ui-agreements.documentFilter.comparator" />
          </Label>
        </Col>
        <Col xs={3}>
          <Label id="rule-column-header-value" required>
            <FormattedMessage id="ui-agreements.documentFilter.value" />
          </Label>
        </Col>
        <Col xs={1} />
      </Row>

      <FieldArray name={`${name}.rules`}>
        {({ fields: ruleFields }) => ruleFields.map((ruleFieldName, ruleFieldIndex) => renderRuleComponent(ruleFields, ruleFieldName, ruleFieldIndex))}
      </FieldArray>
      <Button data-test-add-rule-btn onClick={() => push(`${name}.rules`)}>
        <FormattedMessage id="ui-agreements.documentFilter.addRule" />
      </Button>
    </>
  );
};

DocumentFilterField.propTypes = {
  atTypeValues: PropTypes.arrayOf(PropTypes.object),
  index: PropTypes.number,
  name: PropTypes.string,
};

export default DocumentFilterField;
