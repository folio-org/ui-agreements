import React from 'react';
import PropTypes from 'prop-types';

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default function withKiwtFieldArray(WrappedComponent) {
  class WithKiwtFieldArray extends React.Component {
    static propTypes = {
      fields: PropTypes.object,
    }

    handleAddField = (field = {}) => {
      this.props.fields.push(field);
    }

    handleDeleteField = (index, field) => {
      const { fields } = this.props;

      fields.remove(index);

      if (field.id) {
        fields.push({ id: field.id, _delete: true });
      }
    }

    handleReplaceField = (index, field) => {
      this.props.fields.remove(index);
      this.props.fields.insert(index, field);
    }

    render() {
      const { fields } = this.props;

      // Filter away items that have been marked for deletion.
      const items = (fields.getAll() || []).filter(line => !line._delete);

      return (
        <WrappedComponent
          {...this.props}
          items={items}
          onAddField={this.handleAddField}
          onDeleteField={this.handleDeleteField}
          onReplaceField={this.handleReplaceField}
        />
      );
    }
  }

  WithKiwtFieldArray.displayName = `WithKiwtFieldArray(${getDisplayName(WrappedComponent)})`;
  return WithKiwtFieldArray;
}
