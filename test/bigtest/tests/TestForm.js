import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

export default class TestForm extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    initialValues: PropTypes.object,
  };

  static defaultProps = {
    initialValues: {}
  };

  render() {
    console.log;
    return (
      <Form
        initialValues={this.props.initialValues}
        mutators={arrayMutators}
        onSubmit={() => {}}
      >
        {props => (
          <form onSubmit={props.onSubmit}>
            {this.props.children}
          </form>
        )}
      </Form>
    );
  }
}
