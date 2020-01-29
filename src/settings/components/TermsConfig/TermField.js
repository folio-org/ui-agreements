import React from 'react';
import PropTypes from 'prop-types';

import TermFieldEdit from './TermFieldEdit';
import TermFieldView from './TermFieldView';

export default class TermField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.shape({ id: PropTypes.string }),
        PropTypes.string,
      ]).isRequired,
    }).isRequired,
    mutators: PropTypes.shape({
      setTermValue: PropTypes.func.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { value } = props.input;

    this.state = {
      editing: !(value && value.id),
      initialValue: value,
    };
  }

  handleEdit = () => {
    this.setState({
      initialValue: this.props.input.value,
      editing: true,
    });
  }

  handleCancel = () => {
    const {
      input: { name, value },
      mutators,
      onDelete,
    } = this.props;

    if (value.id) {
      mutators.setTermValue(name, this.state.initialValue);
    } else {
      onDelete();
    }

    this.setState({
      editing: false,
    });
  }

  handleSave = () => {
    this.props.onSave()
      .then(() => this.setState({ editing: false }));
  }

  render() {
    const TermComponent = this.state.editing ? TermFieldEdit : TermFieldView;

    return (
      <TermComponent
        {...this.props}
        onCancel={this.handleCancel}
        onDelete={this.props.onDelete}
        onSave={this.handleSave}
        onEdit={this.handleEdit}
      />
    );
  }
}
