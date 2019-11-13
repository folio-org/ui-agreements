import React from 'react';
import PropTypes from 'prop-types';
import { mapValues, pickBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Checkbox,
  Layout,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import css from './DuplicateAgreementModal.css';

export default class DuplicateAgreementModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    onClone: PropTypes.func,
  };

  constructor() {
    super();

    this.cloneableProperties = {
      agreementInfo: <FormattedMessage id="ui-agreements.duplicateAgreementModal.agreementInfo" />,
      internalContacts: <FormattedMessage id="ui-agreements.duplicateAgreementModal.internalContacts" />,
      agreementLines: <FormattedMessage id="ui-agreements.duplicateAgreementModal.agreementLines" />,
      linkedLicenses: <FormattedMessage id="ui-agreements.duplicateAgreementModal.linkedLicenses" />,
      externalLicenses: <FormattedMessage id="ui-agreements.duplicateAgreementModal.externalLicenses" />,
      organizations: <FormattedMessage id="ui-agreements.duplicateAgreementModal.organizations" />,
      supplementaryInformation: <FormattedMessage id="ui-agreements.duplicateAgreementModal.supplementaryInformation" />,
      usageData: <FormattedMessage id="ui-agreements.duplicateAgreementModal.usageData" />
    };

    this.state = {
      selected: mapValues(this.cloneableProperties, () => false),
    };
  }

  updateSelection = (e) => {
    const { checked, name } = e.target;

    this.setState(prevState => ({
      selected: { ...prevState.selected, [name]: checked }
    }));
  };

  toggleSelectAll = (e) => {
    const { checked } = e.target;

    this.setState(() => ({
      selected: mapValues(this.cloneableProperties, () => checked),
    }));
  }

  render() {
    const { selected } = this.state;

    const footer = (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          disabled={Object.values(selected).every(item => item === false)}
          id="duplicate-agreement-modal-save-button"
          onClick={() => this.props.onClone(pickBy(selected))}
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
        dismissible
        footer={footer}
        id="duplicate-agreement"
        label={<FormattedMessage id="ui-agreements.duplicateAgreement" />}
        onClose={this.props.onClose}
        open
        size="small"
      >
        <Layout className="padding-bottom-gutter">
          <FormattedMessage id="ui-agreements.duplicateAgreementModal.message" />
        </Layout>
        <Layout className="padding-bottom-gutter">
          <Checkbox
            checked={Object.values(selected).includes(false) !== true}
            label={<strong><FormattedMessage id="ui-agreements.selectAll" /></strong>}
            onChange={this.toggleSelectAll}
            value="selectAll"
          />
        </Layout>
        <div className={css.separator} />
        <Layout className="padding-top-gutter">
          {Object.entries(this.cloneableProperties).map(([prop, value], index) => (
            <Checkbox
              checked={this.state.selected[prop]}
              key={index}
              label={value}
              name={prop}
              onChange={this.updateSelection}
              value={prop}
            />
          ))}
        </Layout>
      </Modal>
    );
  }
}
