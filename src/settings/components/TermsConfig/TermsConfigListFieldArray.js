import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Button, Col, Row } from '@folio/stripes/components';

import TermField from './TermField';

export default class TermsConfigListFieldArray extends React.Component {
  static propTypes = {
    fields: PropTypes.shape({
      unshift: PropTypes.func.isRequired,
      value: PropTypes.array.isRequired,
    }).isRequired,
    mutators: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  state = {
    disableNewButton: false,
  }

  defaultTermValue = {
    weight: 0,
    primary: false,
    defaultInternal: true,
  }

  handleDelete = (index) => {
    const { fields, onDelete } = this.props;
    const term = fields.value[index];

    if (term.id) {
      onDelete(term);
    } else {
      fields.remove(index);
      this.setState({ disableNewButton: false });
    }
  }

  handleNew = () => {
    this.props.fields.unshift(this.defaultTermValue);
    this.setState({ disableNewButton: true });
  }

  handleSave = (index) => {
    const term = this.props.fields.value[index];

    if (!term.id) {
      this.setState({ disableNewButton: false });
    }

    return this.props.onSave(term);
  }

  render() {
    const { fields, mutators } = this.props;

    return (
      <div>
        <Row end="sm">
          <Col>
            <Button
              buttonStyle="primary"
              disabled={this.state.disableNewButton}
              id="clickable-new-term"
              onClick={this.handleNew}
            >
              <FormattedMessage id="stripes-components.button.new" />
            </Button>
          </Col>
        </Row>
        {
          fields.value.map((term, i) => (
            <Field
              component={TermField}
              isEqual={isEqual}
              key={term.id || 'new'}
              mutators={mutators}
              name={`${fields.name}[${i}]`}
              onDelete={() => this.handleDelete(i)}
              onSave={() => this.handleSave(i)}
              // This `validate` appears stupid and like a no-op, but it's necessary because of the way
              // that RFF decides whether to run validation: https://github.com/final-form/final-form/pull/267
              // We want this Field to have validation info (meta.invalid) upon mount because some of the
              // child Fields are required and they will run validation.
              validate={() => { }}
            />
          ))
        }
      </div>
    );
  }
}
