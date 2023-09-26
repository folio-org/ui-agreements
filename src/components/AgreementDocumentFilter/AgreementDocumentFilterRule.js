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
import { useAgreementsRefdata } from '../../hooks';
import { selectifyRefdata } from '../utilities';

const AgreementDocumentFilterRule = ({
  ariaLabelledby,
  index,
  name,
  onDelete,
  value,
}) => {
  const intl = useIntl();

  const [AT_TYPE] = ['DocumentAttachment.AtType'];
  const refdataValues = useAgreementsRefdata([AT_TYPE]);
  const atTypeValues = selectifyRefdata(refdataValues, AT_TYPE, 'value');

  const operators = [
    { label: '', value: '' },
    {
      label: intl.formatMessage({
        id: 'ui-agreements.operator.is',
      }),
      value: '==',
    },
    {
      label: intl.formatMessage({
        id: 'ui-agreements.operator.contains',
      }),
      value: '=~',
    },
    {
      label: intl.formatMessage({
        id: 'ui-agreements.operator.doesNotContain',
      }),
      value: '!~',
    },
  ];

  const attributes = [
    { label: '', value: '' },
    {
      label: intl.formatMessage({
        id: 'stripes-erm-components.doc.name',
      }),
      value: 'name',
    },
    {
      label: intl.formatMessage({
        id: 'stripes-erm-components.doc.note',
      }),
      value: 'note',
    },
    {
      label: intl.formatMessage({
        id: 'stripes-erm-components.doc.type',
      }),
      value: 'type',
    },
    {
      label: intl.formatMessage({
        id: 'stripes-erm-components.doc.location',
      }),
      value: 'location',
    },
    {
      label: intl.formatMessage({
        id: 'stripes-erm-components.doc.url',
      }),
      value: 'url',
    },
    {
      label: intl.formatMessage({
        id: 'ui-agreements.eresources.contentType',
      }),
      value: 'contentType',
    },
    {
      label: intl.formatMessage({
        id: 'stripes-erm-components.fuf.filename',
      }),
      value: 'fileName',
    },
  ];

  return (
    <Row key={name}>
      <Col xs={2}>
        <Layout className="textCentered">
          {index === 0 ? null : <FormattedMessage id="ui-agreements.OR" />}
        </Layout>
      </Col>
      <Col xs={3}>
        <Field name={`${name}.attribute`} validate={requiredValidator}>
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
        <Field name={`${name}.operator`} validate={requiredValidator}>
          {({ input, meta }) => (
            <Select
              {...input}
              aria-labelledby={`${ariaLabelledby}-rule-column-header-comparator`}
              dataOptions={
                value?.attribute === 'type'
                  ? [
                    { labe: '', value: '' },
                    {
                      label: intl.formatMessage({
                        id: 'ui-agreements.operator.is',
                      }),
                      value: '==',
                    },
                    {
                      label: intl.formatMessage({
                        id: 'ui-agreements.operator.isNot',
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
              {value?.attribute === 'type' ? (
                <Select
                  {...input}
                  aria-labelledby={`${ariaLabelledby}-rule-column-header-value`}
                  dataOptions={[{ label: '', value: '' }, ...atTypeValues]}
                  disabled={!value?.attribute}
                  error={meta?.touched && meta?.error}
                  required
                />
              ) : (
                <TextField
                  {...input}
                  aria-labelledby={`${ariaLabelledby}-rule-column-header-value`}
                  disabled={!value?.attribute}
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
                id="ui-oa.checklistFilter.removeRule"
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

AgreementDocumentFilterRule.propTypes = {
  ariaLabelledby: PropTypes.string.isRequired,
  clearRuleValue: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  value: PropTypes.shape({
    operator: PropTypes.string,
    value: PropTypes.string,
  }),
};

export default AgreementDocumentFilterRule;
