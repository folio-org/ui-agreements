import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Card, Col, Row, KeyValue } from '@folio/stripes/components';

const TYPE_CLASS_PREFIX = 'com.k_int.web.toolkit.custprops.types.CustomProperty';

export default class TermFieldView extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        type: PropTypes.string,
      }).isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
  }

  renderType = () => {
    const type = this.props.input.value.type.split(TYPE_CLASS_PREFIX)[1].toLowerCase();
    const translationKey = `ui-licenses.settings.terms.type.${type}`;
    return <FormattedMessage id={translationKey} />;
  }

  render() {
    const {
      input: { value = {} },
      onDelete,
      onEdit,
    } = this.props;

    return (
      <Card
        data-test-term={value.name}
        headerStart={<strong><FormattedMessage id="ui-licenses.terms.term" /></strong>}
        headerEnd={(
          <span>
            <Button
              buttonStyle="danger"
              data-test-term-delete-btn
              marginBottom0
              onClick={onDelete}
            >
              <FormattedMessage id="stripes-core.button.delete" />
            </Button>
            <Button
              marginBottom0
              data-test-term-edit-btn
              onClick={onEdit}
            >
              <FormattedMessage id="stripes-core.button.edit" />
            </Button>
          </span>
        )}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              data-test-term-label
              label={<FormattedMessage id="ui-licenses.settings.terms.term.label" />}
              value={value.label}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              data-test-term-name
              label={<FormattedMessage id="ui-licenses.settings.terms.term.name" />}
              value={value.name}
            />
          </Col>
        </Row>
        <KeyValue
          data-test-term-description
          label={<FormattedMessage id="ui-licenses.settings.terms.term.description" />}
          value={value.description}
        />
        <Row>
          <Col xs={4}>
            <KeyValue
              data-test-term-weight
              label={<FormattedMessage id="ui-licenses.settings.terms.term.orderWeight" />}
              value={value.weight}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              data-test-term-primary
              label={<FormattedMessage id="ui-licenses.settings.terms.term.primaryTerm" />}
              value={<FormattedMessage id={value.primary ? 'ui-licenses.yes' : 'ui-licenses.no'} />}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              data-test-term-defaultinternal
              label={<FormattedMessage id="ui-licenses.settings.terms.term.defaultVisibility" />}
              value={<FormattedMessage id={value.defaultInternal ? 'ui-licenses.term.internalTrue' : 'ui-licenses.term.internalFalse'} />}
            />
          </Col>
          <Col xs={6}>
            {value.type && value.type.indexOf(TYPE_CLASS_PREFIX) === 0 &&
              <KeyValue
                data-test-term-type
                label={<FormattedMessage id="ui-licenses.settings.terms.term.type" />}
                value={this.renderType()}
              />
            }
          </Col>
        </Row>
      </Card>
    );
  }
}
