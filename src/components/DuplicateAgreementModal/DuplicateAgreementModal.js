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
    if (isChecked) {
      this.setState(prevState => (
        {
          selected: { ...prevState.selected, [name]: isChecked },
        }));
    } else {
      this.setState(prevState => (
        {
          selected: { ...prevState.selected, [name]: isChecked },
          allSelected: false
        }));
    }
  };

  toggleSelectAll = (e) => {
    if (e.target.checked) {
      const selectAllObject = mapValues(this.cloneableProperties, () => true);

      this.setState(() => {
        return {
          selected: selectAllObject,
          allSelected: true,
        };
      });
    } else {
      this.setState(() => {
        return {
          selected: [],
          allSelected: false
        };
      });
    }
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
        {Object.entries(this.cloneableProperties).map(([key, prop], index) => {
          return (
            <Checkbox
              key={index}
              label={prop}
              value={key}
              name={key}
              onChange={this.updateSelection}
              checked={this.state.allSelected ||
                this.state.selected[key]
              }
            />
          );
        })
        }
      </Modal>
    );
  }
}
