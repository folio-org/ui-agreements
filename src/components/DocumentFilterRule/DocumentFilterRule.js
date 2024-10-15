/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Tooltip,
  IconButton,
  Layout,
  Select,
  TextField,
} from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { requiredValidator } from '@folio/stripes-erm-components';
import DocumentFilterRuleConstants from './DocumentFilterRuleConstants';

const DocumentFilterRule = ({
  ariaLabelledby,
  atTypeValues,
  index,
  name,
  onDelete,
  value,
}) => {
  const intl = useIntl();

  const { operators, attributes } = DocumentFilterRuleConstants(atTypeValues.length > 0);
  return (
    <Row key={name}>
      <Col xs={2}>
        <Layout className="textCentered">
          {index === 0 ? null : <FormattedMessage id="stripes-erm-components.AND" />}
        </Layout>
      </Col>
      <Col xs={3}>
        <Field name={`${name}.path`} validate={requiredValidator}>
          {({ input, meta }) => (
            <Select
              {...input}
              aria-labelledby={`${ariaLabelledby}-rule-column-header-attribute`}
              dataOptions={attributes}
              error={meta?.touched && meta?.error}
              required
            />
          )}
        </Field>
      </Col>
      <Col xs={3}>
        <Field name={`${name}.comparator`} validate={requiredValidator}>
          {({ input, meta }) => (
            <Select
              {...input}
              aria-labelledby={`${ariaLabelledby}-rule-column-header-comparator`}
              dataOptions={
                value?.path === 'docs.atType.value'
                  ? [
                    { label: '', value: '' },
                    {
                      label: intl.formatMessage({
                        id: 'ui-agreements.documentFilter.operator.is',
                      }),
                      value: '==',
                    },
                    {
                      label: intl.formatMessage({
                        id: 'ui-agreements.documentFilter.operator.isNot',
                      }),
                      value: '!=',
                    },
                  ]
                  : operators
              }
              error={meta?.touched && meta?.error}
              required
            />
          )}
        </Field>
      </Col>
      <Col xs={3}>
        <Field name={`${name}.value`} validate={requiredValidator}>
          {({ input, meta }) => (
            <>
              {value?.path === 'docs.atType.value' ? (
                <Select
                  {...input}
                  aria-labelledby={`${ariaLabelledby}-rule-column-header-value`}
                  dataOptions={[{ label: '', value: '' }, ...atTypeValues]}
                  disabled={!value?.path}
                  error={meta?.touched && meta?.error}
                  required
                />
              ) : (
                <TextField
                  {...input}
                  aria-labelledby={`${ariaLabelledby}-rule-column-header-value`}
                  disabled={!value?.path}
                  required
                />
              )}
            </>
          )}
        </Field>
      </Col>
      <Col xs={1}>
        {index ? (
          <Tooltip
            id={`delete-rule-btn-${index}`}
            text={
              <FormattedMessage
                id="stripes-erm-components.documentFilter.removeRule"
                values={{ number: index + 1 }}
              />
            }
          >
            {({ ref, ariaIds }) => (
              <IconButton
                ref={ref}
                aria-labelledby={ariaIds.text}
                icon="trash"
                onClick={onDelete}
              />
            )}
          </Tooltip>
        ) : null}
      </Col>
    </Row>
  );
};

DocumentFilterRule.propTypes = {
  ariaLabelledby: PropTypes.string.isRequired,
  atTypeValues: PropTypes.arrayOf(PropTypes.object),
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  value: PropTypes.shape({
    operator: PropTypes.string,
    value: PropTypes.string,
    path: PropTypes.string,
  }),
};

export default DocumentFilterRule;
