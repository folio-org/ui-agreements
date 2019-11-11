import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, mapValues } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Checkbox,
  Modal,
  ModalFooter
} from '@folio/stripes/components';

export default class DuplicateAgreementModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    onClone: PropTypes.func,
  };

  constructor() {
    super();

    this.cloneableProperties = {
      'agreementInfo': 'Agreement information',
      'internalContacts': 'Internal contacts',
      'agreementLines': 'Agreement lines',
      'linkedLicenses': 'Linked licenses',
      'externalLicenses': 'External licenses',
      'organizations': 'Organizations',
      'supplementaryInformation': 'Supplementary information',
      'usageData': 'Usage data'
    };

    this.state = {
      allSelected: false,
      selected: {},
    };
  }

  updateSelection = (e) => {
    const name = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => (
      {
        selected: { ...prevState.selected, [name]: isChecked },
        allSelected: isChecked ? prevState.allSelected : false,
      }));
  };

  toggleSelectAll = (e) => {
    const selectAllObject = mapValues(this.cloneableProperties, () => true);
    const isChecked = e.target.checked;

    this.setState(() => (
      {
        selected: isChecked ? selectAllObject : [],
        allSelected: isChecked === true,
      }));
  }

  render() {
    const { selected } = this.state;
    const footer = (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          disabled={isEmpty(selected) || Object.values(selected).every(item => item === false)}
          id="duplicate-agreement-modal-save-button"
          onClick={() => this.props.onClone(selected)}
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
        <Button
          buttonStyle="default"
          id="duplicate-agreement-modal-cancel-button"
          onClick={this.props.onClose}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
      </ModalFooter>
    );

    return (
      <Modal
        open
        dismissible
        footer={footer}
        id="duplicate-agreement"
        label={<FormattedMessage id="ui-agreements.duplicateAgreement" />}
        onClose={this.props.onClose}
        size="small"
      >
        <Checkbox
          label={<FormattedMessage id="ui-agreements.selectAll" />}
          value="selectAll"
          onChange={this.toggleSelectAll}
          checked={this.state.allSelected}
        />
        {Object.entries(this.cloneableProperties).map(([prop, value], index) => {
          return (
            <Checkbox
              key={index}
              label={value}
              value={prop}
              name={prop}
              onChange={this.updateSelection}
              checked={this.state.allSelected ||
                this.state.selected[prop]
              }
            />
          );
        })
        }
      </Modal>
    );
  }
}
